/**
 * @author Joe Granville
 * @date 2026-03-11T17:12:37+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import { WebSocketServer } from 'ws';

import AppContext from '../server/application/AppContext.js';

import { DomainEvents, Commands } from '../shared/domain-events.js';

export function createWebSocketServer(server, context) {
  const webSocketServer = new WebSocketServer({ server });
  
  webSocketServer.on('connection', (ws) => {
    context.subscribeClient(ws);
    
    context.subscribeToState(event => {
      if (event.type === DomainEvents.STATE_INIT) {
        ws.send(JSON.stringify({
          entityId: event.entityId,
          type: event.type,
          state: event.payload
        }));
      }
    });
    
    ws.on('message', (msg) => {
      let data;
      try {
        data = JSON.parse(msg);
      } catch (err) {
        console.error('invalid JSON', msg);
        return;
      }
      
      const item = data.entityId ? context.getItem(data.entityId) : null;
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