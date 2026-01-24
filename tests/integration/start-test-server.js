/**
 * @author Joe Granville
 * @date 2026-01-23T03:06:30+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const http = require('http');
const { createHTTPServer } = require('../../server/http');
const { createWebSocketServer } = require('../../server/websocket');
const { findProjectRoot } = require('../../infrastructure/findProjectRoot');

const AppState = require('../../server/domain-model/AppState');
const Session = require('../../server/domain-model/Session');
const TextItem = require('../../server/domain-model/TextItem');

const projectRoot = findProjectRoot();
const app = createHTTPServer({ projectRoot });
const server = http.createServer(app);

const appState = new AppState('test-state');
const session = new Session('test-session');

const text = new TextItem('text-1', 'initial');
appState.addItem(text);
session.addItem(text);

createWebSocketServer(server, session, appState);

module.exports = server;