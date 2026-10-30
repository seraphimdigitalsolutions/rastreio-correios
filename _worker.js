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
      const cleanPath = url.pathname.replace(/\/+$/, '').toLowerCase();
      if (cleanPath === '/como-funciona' || cleanPath === '/guia' || cleanPath === '/blog') {
        return env.ASSETS.fetch(new Request(`${url.origin}/como-funciona.html`, request));
      }

      const isStaticFile = /\.[a-z0-9]{2,5}$/i.test(url.pathname);
      
      if (!isStaticFile && url.pathname !== '/') {
        const code = url.pathname.replace(/^\/?(rastreio\/)?/, '').replace(/\/+$/, '');
        if (code) {
          return Response.redirect(`${url.origin}/?codigo=${encodeURIComponent(code)}`, 302);
        }
        return Response.redirect(`${url.origin}/`, 302);
      }

      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  },
};
