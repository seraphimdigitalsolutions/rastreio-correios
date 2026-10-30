export default {
  async fetch(request, env) {
    const url = new URL(request.url);

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

    if (url.pathname.startsWith('/api/tracking')) {
      const backendBaseUrl = (env.BACKEND_API_URL || 'https://jetlogs.shop').replace(/\/+$/, '');
      const facadeSecret = env.FACADE_SECRET || 'jetlogs-facade-shield-token-2026';
      const targetUrl = `${backendBaseUrl}${url.pathname}${url.search}`;

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

    if (env.ASSETS) {
      const pathname = url.pathname;

      if (pathname === '/rastreio' || pathname === '/rastreio/' || pathname.startsWith('/rastreio/')) {
        return env.ASSETS.fetch(new Request(`${url.origin}/rastreio.html${url.search}`, request));
      }

      const isStaticFile = /\.[a-z0-9]{2,5}$/i.test(pathname);
      if (isStaticFile) {
        return env.ASSETS.fetch(request);
      }

      if (pathname !== '/') {
        const cleanCode = pathname.replace(/^\/+/, '').replace(/\/+$/, '');
        if (/^[A-Z0-9]{8,25}$/i.test(cleanCode)) {
          return Response.redirect(`${url.origin}/rastreio?codigo=${encodeURIComponent(cleanCode.toUpperCase())}`, 302);
        }
        return Response.redirect(`${url.origin}/`, 302);
      }

      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
