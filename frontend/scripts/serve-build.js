/**
 * Serves frontend/build and forwards /api/* to the API, like the Hosting
 * rewrite. Shared by the page checks (viewport-check.js, reading-order-check.js).
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

function serveBuild(port, apiUrl) {
  const build = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(path.join(build, 'index.html'))) {
    throw new Error('frontend/build not found: run `npm run build` first (or set SERVE_BUILD=0 and APP_URL)');
  }
  const api = new URL(apiUrl);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg' };
  const server = http.createServer((req, res) => {
    if (req.url.startsWith('/api/')) {
      // Same-origin from the browser's point of view: drop Origin so the
      // API's CORS allow-list does not apply (as behind the Hosting rewrite).
      const { origin, ...headers } = req.headers;
      const proxy = http.request({ host: api.hostname, port: api.port, path: req.url, method: req.method, headers }, (up) => {
        res.writeHead(up.statusCode, up.headers);
        up.pipe(res);
      });
      proxy.on('error', (e) => { res.writeHead(502); res.end(String(e)); });
      req.pipe(proxy);
      return;
    }
    // Stay inside build/ and survive malformed percent-encoding
    let pathname = '/';
    try { pathname = decodeURIComponent(req.url.split('?')[0]); } catch (e) { pathname = '/'; }
    let file = path.resolve(build, '.' + pathname);
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(build, 'index.html');
    }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

module.exports = { serveBuild };
