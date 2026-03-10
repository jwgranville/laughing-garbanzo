/**
 * @author Joe Granville
 * @date 2026-03-10T20:21:24+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import WebSocket from 'ws';
import {test, describe, before, after } from 'node:test';
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

describe('WebSocket broadcast behavior', () => {
  test('multiple WebSocket clients receive the same message', (t, done) => {
    const port = httpServer.address().port;
    const url = `ws://localhost:${port}`;
    
    const clientA = new WebSocket(url);
    const clientB = new WebSocket(url);
    
    t.after(() => {
      clientA.close();
      clientB.close();
    });
    
    let received = 0;
    
    function check(msg) {
      const data = JSON.parse(msg);
      if (data.type !== DomainEvents.UPDATE_TEXT) return;
      assert.deepEqual({
        type: data.type,
        entityId: data.entityId,
        value: data.value
      },
      {
        type: DomainEvents.UPDATE_TEXT,
        entityId: 'text-1',
        value: 'shared'
      });
      received++;
      if (received === 2) {
        done();
      }
    }
    
    clientA.on('message', check);
    clientB.on('message', check);
    
    clientA.on('open', () => {
      clientA.send(JSON.stringify({
        command: Commands.UPDATE_TEXT,
        entityId: 'text-1',
        value: 'shared'
      }));
    });
  });
});