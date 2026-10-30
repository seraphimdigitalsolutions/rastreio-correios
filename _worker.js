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

    // Preflight CORS
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

    // Para qualquer outro arquivo (HTML, CSS, imagens, JS), serve a página estática / SPA
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response('Not found', { status: 404 });
  },
};

