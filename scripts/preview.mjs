import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const docs = join(import.meta.dirname, '..', 'docs');
const prefix = '/game-dev-fieldbook/';
const port = 4173;
const assetTypes = { 'site.css': 'text/css; charset=utf-8', 'favicon.svg': 'image/svg+xml' };

const server = createServer(async (request, response) => {
  const path = request.url.split('?', 1)[0];
  const relative = path.startsWith(prefix) ? path.slice(prefix.length) : null;
  const asset = /^assets\/(site\.css|favicon\.svg)$/.exec(relative ?? '');
  const isPage = relative === '' || /^notes\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/.test(relative ?? '');
  if (!['GET', 'HEAD'].includes(request.method) || (!asset && !isPage)) {
    response.writeHead(404).end('Not found');
    return;
  }

  try {
    const file = await readFile(join(docs, asset ? relative : `${relative}index.html`));
    const contentType = asset ? assetTypes[asset[1]] : 'text/html; charset=utf-8';
    response.writeHead(200, { 'Content-Type': contentType });
    response.end(request.method === 'HEAD' ? undefined : file);
  } catch (error) {
    response.writeHead(error.code === 'ENOENT' ? 404 : 500).end('Unable to open preview file');
  }
});

server.listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}${prefix}`));
