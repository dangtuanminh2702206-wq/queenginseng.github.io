// Preview the GitHub Pages export with its real base path; never serves source files.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve('out');
const prefix = '/queenginseng.github.io';
const types = {'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.txt':'text/plain; charset=utf-8','.png':'image/png','.webp':'image/webp','.svg':'image/svg+xml','.pdf':'application/pdf','.ico':'image/x-icon'};
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    if (pathname === '/') { res.writeHead(302, {Location: prefix + '/'}); return res.end(); }
    if (pathname !== prefix && !pathname.startsWith(prefix + '/')) throw new Error('Not found');
    let file = path.resolve(root, '.' + (pathname.slice(prefix.length) || '/'));
    if (file !== root && !file.startsWith(root + path.sep)) throw new Error('Not found');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {'Content-Type':types[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'}); res.end(body);
  } catch { res.writeHead(404); res.end('Not found'); }
}).listen(4175, '127.0.0.1', () => console.log('Preview: http://127.0.0.1:4175/queenginseng.github.io/'));
