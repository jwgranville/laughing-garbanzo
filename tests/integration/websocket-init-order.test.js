/**
 * @author Joe Granville
 * @date 2026-03-10T20:32:05+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import WebSocket from 'ws';
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';

import { DomainEvents, Commands } from '../../shared/domain-events.js';
import server from './start-test-server.js';

let httpServer;

before(done => {
  httpServer = server.listen(0, done);
});

after(done => {
  httpServer.close(done);
});

test('client receives initialization before updates', (t, done) => {
  const port = httpServer.address().port;
  const url = `ws://localhost:${port}`;
  
  const clientA = new WebSocket(url);
  const clientB = new WebSocket(url);
  
  t.after(() => {
    clientA.close();
    clientB.close();
  });
  
  let bMessages = [];
  
  clientB.on('message', msg => {
    bMessages.push(JSON.parse(msg));
  });
  
  let clientsReady = 0;
  function onOpen() {
    clientsReady++;
    if (clientsReady === 2) {
      clientA.send(JSON.stringify({
        command: Commands.UPDATE_TEXT,
        entityId: 'text-1',
        value: 'shared'
      }));
    
      setTimeout(() => {
        const types = bMessages.map(m => m.type);
        
        const initIndex = types.indexOf(DomainEvents.STATE_INIT);
        const updateIndex = types.indexOf(DomainEvents.UPDATE_TEXT);
        
        assert.notEqual(initIndex, -1);
        assert.notEqual(updateIndex, -1);
        assert.ok(initIndex < updateIndex);
        
        done();
      }, 50);
    }
  }
  
  clientA.on('open', onOpen);
  clientB.on('open', onOpen);
});