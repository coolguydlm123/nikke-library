// Nikke Library — local server. Run: node server.js  (then open http://localhost:4170)
const http = require('http');
const fs = require('fs');
const path = require('path');
const { loadAll } = require('./lib/load');
const { createApi } = require('./lib/api');

const PUBLIC = path.join(__dirname, 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.glb': 'model/gltf-binary' };

const libs = loadAll(__dirname);
const api = createApi(libs);

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const out = api(url.pathname, url.searchParams);
  if (out) {
    res.writeHead(out.status, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify(out.body));
  }
  const rel = url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname).replace(/^\/+/, '');
  const file = path.normalize(path.join(PUBLIC, rel));
  if (!file.startsWith(PUBLIC) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); return res.end('Not found');
  }
  // no-cache: the browser revalidates, so edits to public/ show up on a normal refresh.
  res.writeHead(200, { 'Content-Type': (MIME[path.extname(file)] || 'application/octet-stream') + '; charset=utf-8', 'Cache-Control': 'no-cache' });
  fs.createReadStream(file).pipe(res);
});

const port = Number(process.env.PORT) || libs.config.port;
server.listen(port, '127.0.0.1', () => console.log(`Nikke Library: http://localhost:${port}`));
