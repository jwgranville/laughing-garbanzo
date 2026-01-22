/**
 * @author Joe Granville
 * @date 2026-01-22T03:59:00+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const http = require('http');
const path = require('path');

const { createHTTPServer } = require('./http');
const { createWebSocketServer } = require('./websocket');
const { findProjectRoot } = require(path.join(__dirname, '..', 'infrastructure', 'findProjectRoot'));
const { getExternalIPAddresses } = require(path.join(__dirname, '..', 'infrastructure', 'network'));

const Session = require('./domain-model/Session');
const TextItem = require('./domain-model/TextItem');
const PrimitiveStroke = require('./domain-model/canvas/PrimitiveStroke');

const projectRoot = findProjectRoot();

const app = createHTTPServer({ projectRoot });
const server = http.createServer(app);

const session = new Session('session-1');
const textItem = new TextItem('text-1', '');
session.addDomainObject(textItem);
const stroke = new PrimitiveStroke(
  'stroke-1',
  { x1: 100, y1: 100, x2: 200, y2: 200, color: 'black', width: 2 }
);
session.addDomainObject(stroke);

createWebSocketServer(server, session);

const PORT = process.env.PORT || 3000;
const addresses = getExternalIPAddresses();
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  addresses.forEach(({ interface, address, family }) => {
    if (family === 'IPv4') {
      console.log(`  ${interface}: http://${address}:${PORT}`);
    } else {
      console.log(`  ${interface}: ${address}`);
    }
  });
});