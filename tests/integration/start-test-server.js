/**
 * @author Joe Granville
 * @date 2026-01-21T17:40:43+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const http = require('http');
const { createHTTPServer } = require('../../server/http');
const { createWebSocketServer } = require('../../server/websocket');
const { findProjectRoot } = require('../../infrastructure/findProjectRoot');

const projectRoot = findProjectRoot();
const app = createHTTPServer({ projectRoot });
const server = http.createServer(app);

createWebSocketServer(server);

module.exports = server;