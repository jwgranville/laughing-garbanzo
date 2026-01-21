/**
 * @author Joe Granville
 * @date 2026-01-20T04:52:15+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const WebSocket = require('ws');
const Session = require('./domain-model/Session');
const TextItem = require('./domain-model/TextItem');

function createWebSocketServer(server, session) {
  const webSocketServer = new WebSocket.Server({ server });
  
  webSocketServer.on('connection', (ws) => {
    session.subscribe(ws);
    
    ws.on('message', (msg) => {
      webSocketServer.clients.forEach((client) => {
        let data;
        try {
          data = JSON.parse(msg);
        } catch (err) {
          console.error('Invalid JSON', msg);
          return;
        }
        
        if (data.command === 'updateText' && data.objId) {
          const obj = session.domainObjects.get(data.objId);
          if (obj && obj.updateText) {
            obj.updateText(data.value);
          }
        }
      });
    });
  });
  
  return webSocketServer;
}

module.exports = { createWebSocketServer };