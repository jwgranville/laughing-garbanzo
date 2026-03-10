/**
 * @author Joe Granville
 * @date 2026-03-10T19:47:28+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import Session from '../../server/application/Session.js';
import TextItem from '../../server/domain-model/TextItem.js';
import { DomainEvents } from '../../shared/domain-events.js';

describe('Session domain object synchronization', () => {
  test('broadcasts TextItem updates to all listeners', () => {
    const session = new Session('session-1');
    const text = new TextItem('text-1', 'hello');
    
    session.addItem(text);
    
    const clientA = { send: (...args) => clientA.send.calls.push(args) };
    clientA.send.calls = [];
    const clientB = { send: (...args) => clientB.send.calls.push(args) };
    clientB.send.calls = [];
    
    session.subscribe(clientA);
    session.subscribe(clientB);
    
    clientA.send.calls = [];
    clientB.send.calls = [];
    
    text.updateText('world');
    
    assert.equal(clientA.send.calls.length, 1);
    assert.equal(clientB.send.calls.length, 1);
    
    const msgA = JSON.parse(clientA.send.calls[0][0]);
    const msgB = JSON.parse(clientB.send.calls[0][0]);
    
    assert.deepEqual(msgA, msgB);
    assert.deepEqual({
      entityId: msgA.entityId,
      type: msgA.type,
      value: msgA.value
    },
    {
      entityId: 'text-1',
      type: DomainEvents.UPDATE_TEXT,
      value: 'world'
    });
  });
});