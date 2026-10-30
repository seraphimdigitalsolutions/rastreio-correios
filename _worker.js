/**
 * Cloudflare Pages / Worker - Proxy Cego de Fachada
 * 
 * Este worker roda diretamente na rede da Cloudflare.
 * O visitante entra no seu domínio da fachada (ex: rastreio.com).
 * Quando o navegador busca o código de rastreio, este worker intercepta a rota /api/tracking
 * e faz a consulta diretamente para o seu backend secreto em segundo plano.
 * 
 * BENEFÍCIOS:
 * 1. O visitante/espertinho NUNCA vê a URL do seu backend no F12 / DevTools.
 * 2. O IP do seu servidor de banco de dados fica 100% oculto.
 * 3. O cabeçalho 'X-Facade-Secret' protege seu backend contra acessos diretos.
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Se a requisição for para a API de rastreio, encaminha em segundo plano para o backend secreto
    if (url.pathname.startsWith('/api/tracking')) {
      const backendBaseUrl = (env.BACKEND_API_URL || 'https://jetlogs.shop').replace(/\/+$/, '');
      const facadeSecret = env.FACADE_SECRET || 'jetlogs-facade-shield-token-2026';

      const targetUrl = `${backendBaseUrl}${url.pathname}${url.search}`;

      // Clona os headers da requisição original e anexa o segredo de fachada
      const forwardHeaders = new Headers(request.headers);
      forwardHeaders.set('host', new URL(backendBaseUrl).host);
      if (facadeSecret) {
        forwardHeaders.set('x-facade-secret', facadeSecret);
      }

      const backendResponse = await fetch(targetUrl, {
        method: request.method,
        headers: forwardHeaders,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      // Devolve a resposta com os headers da fachada (sem expor o backend)
      const responseHeaders = new Headers(backendResponse.headers);
      responseHeaders.set('Access-Control-Allow-Origin', '*');
      responseHeaders.delete('server');
      responseHeaders.delete('x-powered-by');

      return new Response(backendResponse.body, {
        status: backendResponse.status,
        headers: responseHeaders,
      });
    }

    // Para qualquer outro arquivo (HTML, CSS, imagens, JS), tenta servir o asset estático
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
      // SPA Fallback: se o arquivo não existe (ex: /BR301300008BR ou /rastreio/...), serve o index.html
      const indexRequest = new Request(new URL('/index.html', request.url), request);
      return env.ASSETS.fetch(indexRequest);
    }

    return fetch(request);
  },
};

