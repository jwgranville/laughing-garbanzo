/**
 * @author Joe Granville
 * @date 2026-01-20T04:52:15+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

function createWebSocketServer(server) {
  const WebSocket = require('ws');
  const webSocketServer = new WebSocket.Server({ server });
  
  webSocketServer.on('connection', (ws) => {
    ws.on('message', (msg) => {
      webSocketServer.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) client.send(msg);
      });
    });
    
    return ws;
  });
}

module.exports = { createWebSocketServer };