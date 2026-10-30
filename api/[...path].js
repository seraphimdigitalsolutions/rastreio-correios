const https = require('https');
const http = require('http');

module.exports = async (req, res) => {
  const backendBaseUrl = (process.env.BACKEND_API_URL || 'https://jetlogs.shop').replace(/\/+$/, '');
  const facadeSecret = process.env.FACADE_SECRET || 'jetlogs-facade-shield-token-2026';

  const targetUrl = new URL(`${backendBaseUrl}${req.url}`);
  const client = targetUrl.protocol === 'https:' ? https : http;

  const headers = { ...req.headers };
  delete headers.host;
  if (facadeSecret) {
    headers['x-facade-secret'] = facadeSecret;
  }

  const options = {
    method: req.method,
    headers,
  };

  const proxyReq = client.request(targetUrl, options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      'access-control-allow-origin': '*',
    });
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', () => {
    res.status(502).json({ error: 'Falha na conexão com a central de rastreamento.' });
  });

  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    const bodyData = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
    proxyReq.write(bodyData);
  }

  req.pipe(proxyReq, { end: true });
};
