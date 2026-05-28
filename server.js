const http = require('http');
const fs = require('fs');
const path = require('path');

const DIST = path.join(__dirname, 'dist');
const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.pdf': 'application/pdf',
};

const server = http.createServer((req, res) => {
  let filePath = req.url.split('?')[0];
  if (filePath === '/' || filePath === '') filePath = '/index.html';
  
  const fullPath = path.join(DIST, filePath);
  
  // Security: prevent path traversal
  if (!fullPath.startsWith(DIST)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }
  
  fs.readFile(fullPath, (err, data) => {
    if (err) {
      // SPA fallback — but ONLY for routes that are actually meant for the
      // SPA router. For /assets/* (versioned bundle URLs) and /papers/* and
      // any path with a recognised file extension, return a real 404 so the
      // browser surfaces the missing-bundle error instead of getting
      // index.html with the wrong content-type (which silently white-screens
      // the app when the cached HTML references a deleted hash).
      const ext = path.extname(fullPath);
      const isAssetLike = filePath.startsWith('/assets/') ||
                          filePath.startsWith('/papers/') ||
                          (ext && ext !== '.html');
      if (isAssetLike) {
        res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
        res.end('Not Found: ' + filePath);
        return;
      }
      // True SPA route (extensionless path like /lambda-bounds) — serve index.html.
      fs.readFile(path.join(DIST, 'index.html'), (err2, indexData) => {
        if (err2) {
          res.writeHead(500);
          res.end('Server Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html', 'Access-Control-Allow-Origin': '*', 'Cache-Control': 'no-cache' });
        res.end(indexData);
      });
      return;
    }

    const ext = path.extname(fullPath);
    const contentType = MIME[ext] || 'application/octet-stream';
    // Versioned /assets/* bundles can cache forever (hash is in filename).
    // Everything else (esp. index.html) gets no-cache so the operator never
    // sees stale HTML referencing a deleted bundle hash.
    const cacheControl = filePath.startsWith('/assets/')
      ? 'public, max-age=31536000, immutable'
      : 'no-cache';
    res.writeHead(200, {
      'Content-Type': contentType,
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': cacheControl,
    });
    res.end(data);
  });
});

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3003;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
