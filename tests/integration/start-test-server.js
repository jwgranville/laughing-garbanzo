/**
 * @author Joe Granville
 * @date 2026-03-09T23:01:17+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import http from 'http';

import { createHTTPServer } from '../../server/http.js';
import { createWebSocketServer } from '../../server/websocket.js';
import { findProjectRoot } from '../../infrastructure/findProjectRoot.js';

import Session from '../../server/application/Session.js';
import AppState from '../../server/domain-model/AppState.js';
import TextItem from'../../server/domain-model/TextItem.js';

const projectRoot = findProjectRoot();
const app = createHTTPServer({ projectRoot });
const server = http.createServer(app);

const appState = new AppState('test-state');
const session = new Session('test-session');

const text = new TextItem('text-1', 'initial');
appState.addItem(text);
session.addItem(text);

createWebSocketServer(server, session, appState);

export default server;