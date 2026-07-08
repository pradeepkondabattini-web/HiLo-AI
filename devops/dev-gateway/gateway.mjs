// HiLo local dev API gateway (reverse proxy). ZERO dependencies.
//
// Stands in for the production API Gateway / BFF (EOS-000 §14) during LOCAL development so
// the Flutter app can reach every microservice through one origin. Routes by path prefix
// and adds permissive CORS so the web build (chrome) can call the backend.
//
// NOT for production — no auth, rate limiting, or TLS. The real gateway is a separate,
// governed component.
//
//   node devops/dev-gateway/gateway.mjs
//
// Env: GATEWAY_PORT (8000), AUTH_TARGET (http://localhost:8081), EVENTS_TARGET (…:8082).

import http from 'node:http';

const PORT = Number(process.env.GATEWAY_PORT ?? 8000);
const ROUTES = [
  { prefix: '/api/v1/auth', target: process.env.AUTH_TARGET ?? 'http://localhost:8081' },
  { prefix: '/api/v1/events', target: process.env.EVENTS_TARGET ?? 'http://localhost:8082' },
  { prefix: '/api/v1/venues', target: process.env.VENUES_TARGET ?? 'http://localhost:8083' },
];

function corsHeaders(req) {
  return {
    'access-control-allow-origin': req.headers.origin ?? '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'access-control-allow-headers':
      req.headers['access-control-request-headers'] ?? 'authorization,content-type',
    'access-control-max-age': '3600',
    vary: 'Origin',
  };
}

function pickTarget(url) {
  return ROUTES.find((r) => url.startsWith(r.prefix))?.target;
}

function sendJson(res, status, cors, body) {
  res.writeHead(status, { 'content-type': 'application/json', ...cors });
  res.end(JSON.stringify(body));
}

const server = http.createServer((req, res) => {
  const cors = corsHeaders(req);

  if (req.method === 'OPTIONS') {
    res.writeHead(204, cors);
    res.end();
    return;
  }

  if (req.url === '/health') {
    sendJson(res, 200, cors, { status: 'ok', service: 'dev-gateway' });
    return;
  }

  const target = pickTarget(req.url ?? '');
  if (!target) {
    sendJson(res, 502, cors, {
      error: { code: 'NO_ROUTE', message: `No upstream configured for ${req.url}` },
    });
    return;
  }

  const upstream = new URL(req.url, target);
  const proxyReq = http.request(
    upstream,
    { method: req.method, headers: { ...req.headers, host: upstream.host } },
    (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 502, { ...proxyRes.headers, ...cors });
      proxyRes.pipe(res);
    },
  );
  proxyReq.on('error', (err) => {
    sendJson(res, 502, cors, {
      error: { code: 'UPSTREAM_UNAVAILABLE', message: `${target} is unreachable: ${err.message}` },
    });
  });
  req.pipe(proxyReq);
});

server.listen(PORT, () => {
  console.log(`[dev-gateway] listening on http://localhost:${PORT}`);
  for (const r of ROUTES) console.log(`[dev-gateway]   ${r.prefix}  ->  ${r.target}`);
});
