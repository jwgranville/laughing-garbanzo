/**
 * @author Joe Granville
 * @date 2026-01-23T01:27:07+00:00
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

const AppState = require('./domain-model/AppState');
const Session = require('./domain-model/Session');
const TextItem = require('./domain-model/TextItem');
const PrimitiveCanvasStroke = require('./domain-model/canvas/PrimitiveCanvasStroke');

const projectRoot = findProjectRoot();

const app = createHTTPServer({ projectRoot });
const server = http.createServer(app);

const appState = new AppState('main-state');
const session = new Session('session-1');
const textItem = new TextItem('text-1', '');
appState.addItem(textItem);
const stroke = new PrimitiveCanvasStroke(
  'stroke-1',
  { x1: 100, y1: 100, x2: 200, y2: 200, color: 'black', width: 2 }
);
appState.addItem(stroke);
appState.subscribe(event => {
  const item = appState.getItem(event.itemId);
  if (item) {
    session._broadcast(event.itemId, event);
  }
});
for (const item of appState.getAllItems()) {
  session.addItem(item);
}

createWebSocketServer(server, session, appState);

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