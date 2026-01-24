/**
 * @author Joe Granville
 * @date 2026-01-24T04:19:49+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const WebSocket = require('ws');

const { DomainEvents, Commands } = require('./domain-model/events');

function createWebSocketServer(server, session, appState) {
  const webSocketServer = new WebSocket.Server({ server });
  
  webSocketServer.on('connection', (ws) => {
    session.subscribe(ws);
    
    if (appState) {
      appState.subscribe(event => {
        if (event.type === DomainEvents.STATE_INIT) {
          ws.send(JSON.stringify({
            objId: event.itemId,
            type: event.type,
            state: event.payload
          }));
        }
      });
    }
    
    ws.on('message', (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (err) {
        console.error('invalid JSON', msg);
        return;
      }
      
      if (!appState) return;
      const item = data.objId ? appState.getItem(data.objId) : null;
      if (!item) return;
      switch (data.command) {
        case Commands.UPDATE_TEXT:
          if (item.updateText) item.updateText(data.value);
          break;
        case Commands.MOVE:
          if (item.move) item.move(data.dx, data.dy);
          break
        default:
          console.log('unknown command:', data.command);
      }
    });
  });
  
  return webSocketServer;
}

module.exports = { createWebSocketServer };