import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

const docs = join(import.meta.dirname, '..', 'docs');
const prefix = '/game-dev-fieldbook/';
const { values } = parseArgs({ options: { port: { type: 'string', default: '4173' } } });
const port = Number(values.port);
if (!/^\d+$/.test(values.port) || port > 65535) {
  console.error('請用 --port 指定 1 到 65535 的連接埠，或用 0 自動分配。');
  process.exit(1);
}
const assetTypes = { 'site.css': 'text/css; charset=utf-8', 'favicon.svg': 'image/svg+xml' };

const server = createServer(async (request, response) => {
  const path = request.url.split('?', 1)[0];
  const relative = path.startsWith(prefix) ? path.slice(prefix.length) : null;
  const asset = /^assets\/(site\.css|favicon\.svg)$/.exec(relative ?? '');
  const isArt = /^assets\/art\/(?:hero\/(?:desktop|mobile|cover)|[a-z0-9]+(?:-[a-z0-9]+)*)\.webp$/.test(relative ?? '');
  const isPage = relative === '' || /^notes\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(relative ?? '');
  if (!['GET', 'HEAD'].includes(request.method) || (!asset && !isArt && !isPage)) {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    const file = await readFile(join(docs, isPage ? `${relative}index.html` : relative));
    const contentType = isPage ? 'text/html; charset=utf-8' : isArt ? 'image/webp' : assetTypes[asset[1]];
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(request.method === 'HEAD' ? undefined : file);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Unable to open preview file');
  }
});

server.on('error', (error) => {
  console.error(error.code === 'EADDRINUSE' ? `連接埠 ${port} 已被使用。請以 npm run preview -- --port 0 自動分配。` : error.message);
  process.exitCode = 1;
});
server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${server.address().port}${prefix}`));
