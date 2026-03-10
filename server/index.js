/**
 * @author Joe Granville
 * @date 2026-03-10T05:02:08+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import http from 'http';
import path from 'path';

import { createHTTPServer } from './http.js';
import { createWebSocketServer } from './websocket.js';
import { findProjectRoot } from '../infrastructure/findProjectRoot.js';
import { getExternalIPAddresses } from '../infrastructure/network.js';

import Session from './application/Session.js';
import AppState from './domain-model/AppState.js';
import TextItem from './domain-model/TextItem.js';
import PrimitiveCanvasStroke from './domain-model/canvas/PrimitiveCanvasStroke.js';

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
  const item = appState.getItem(event.entityId);
  if (item) {
    session._broadcast(event.entityId, event);
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
  addresses.forEach(({ iface, address, family }) => {
    if (family === 'IPv4') {
      console.log(`  ${iface}: http://${address}:${PORT}`);
    } else {
      console.log(`  ${iface}: ${address}`);
    }
  });
});