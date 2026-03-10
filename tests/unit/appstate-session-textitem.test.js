/**
 * @author Joe Granville
 * @date 2026-03-10T23:00:58+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

import Session from '../../server/application/Session.js';
import AppContext from '../../server/application/AppContext.js';
import AppState from '../../server/domain-model/AppState.js';
import TextItem from '../../server/domain-model/TextItem.js';
import { DomainEvents } from '../../shared/domain-events.js';

describe('Domain object synchronization across AppState and Session', () => {
  test('broadcasts TextItem updates to all listeners', () => {
    const appState = new AppState('test-state');
    const session = new Session('session-1');
    const context = new AppContext(appState, session);
    const text = new TextItem('text-1', 'hello');
    appState.addItem(text);
    
    const clientA = { send: (...args) => clientA.send.calls.push(args) };
    clientA.send.calls = [];
    const clientB = { send: (...args) => clientB.send.calls.push(args) };
    clientB.send.calls = [];
    
    clientA.send.calls = [];
    clientB.send.calls = [];
    
    session.subscribe(clientA);
    session.subscribe(clientB);
    
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