// Servidor dual HTTP + HTTPS para o OdontoApp
//
// HTTP  (PORT_HTTP,  padrão 9002): páginas públicas ( / e /politica-de-seguranca )
//   → qualquer rota sensível (/auth, /dashboard, /api) é redirecionada para HTTPS
//
// HTTPS (PORT_HTTPS, padrão 9443): páginas com dados sensíveis
//   → login, cadastro, dashboard, API

const http    = require('http');
const https   = require('https');
const { readFileSync } = require('fs');
const { parse }        = require('url');
const next             = require('next');
const path             = require('path');

const dev        = process.env.NODE_ENV !== 'production';
const HTTP_PORT  = parseInt(process.env.PORT_HTTP  || '9002', 10);
const HTTPS_PORT = parseInt(process.env.PORT_HTTPS || '9443', 10);
const certDir    = path.join(__dirname, 'certificates');

// Prefixos que exigem HTTPS por conter dados sensíveis
const SECURE_PREFIXES = ['/auth', '/dashboard', '/api'];

function requiresHttps(pathname) {
  return SECURE_PREFIXES.some(p => pathname === p || pathname.startsWith(p + '/'));
}

const app    = next({ dev, hostname: 'localhost' });
const handle = app.getRequestHandler();

app.prepare().then(() => {

  // ── Servidor HTTP — páginas públicas ──────────────────────────────────────
  http.createServer((req, res) => {
    const { pathname } = parse(req.url || '/', true);

    if (requiresHttps(pathname)) {
      // Redireciona permanentemente para o servidor HTTPS
      res.writeHead(301, { 'Location': `https://localhost:${HTTPS_PORT}${req.url}` });
      res.end();
      return;
    }

    handle(req, res, parse(req.url, true));
  }).listen(HTTP_PORT, (err) => {
    if (err) throw err;
    console.log(`\n🌐  Público (HTTP):   http://localhost:${HTTP_PORT}`);
    console.log(`    Rotas:  /  |  /politica-de-seguranca`);
  });

  // ── Servidor HTTPS — páginas com dados sensíveis ───────────────────────────
  try {
    const httpsOptions = {
      key:        readFileSync(path.join(certDir, 'server', 'server.key')),
      cert:       readFileSync(path.join(certDir, 'server', 'server.crt')),
      ca:         readFileSync(path.join(certDir, 'ca', 'ca.crt')),
      minVersion: 'TLSv1.2',  // bloqueia TLS 1.0 e 1.1
    };

    https.createServer(httpsOptions, (req, res) => {
      // HSTS apenas nas respostas HTTPS (ignorado por navegadores em HTTP)
      res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
      handle(req, res, parse(req.url, true));
    }).listen(HTTPS_PORT, (err) => {
      if (err) throw err;
      console.log(`🔒  Seguro  (HTTPS):  https://localhost:${HTTPS_PORT}`);
      console.log(`    Rotas:  /auth/*  |  /dashboard/*  |  /api/*\n`);
    });

  } catch {
    console.warn('\n⚠️   Certificados não encontrados — servidor HTTPS não iniciado.');
    console.warn('    Execute: npm run generate-certs\n');
  }

});
