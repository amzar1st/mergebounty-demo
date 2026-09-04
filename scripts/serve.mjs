import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';

const dirArg = process.argv[2] || 'frontend';
const port = Number(process.argv[3] || process.env.PORT || 4173);
const root = resolve(process.cwd(), dirArg);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const rel = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
    const safe = normalize(rel).replace(/^([.][.][/\\])+/, '');
    const path = join(root, safe);
    if (!path.startsWith(root)) throw new Error('invalid path');
    const info = await stat(path);
    if (!info.isFile()) throw new Error('not a file');
    const body = await readFile(path);
    res.writeHead(200, {
      'content-type': types[extname(path)] || 'application/octet-stream',
      'cache-control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});
server.listen(port, () => console.log(`MergeBounty serving ${root} at http://localhost:${port}`));
