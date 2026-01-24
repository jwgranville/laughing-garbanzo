/**
 * @author Joe Granville
 * @date 2026-01-24T02:15:27+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const Session = require('../../server/domain-model/Session');
const TextItem = require('../../server/domain-model/TextItem');
const { DomainEvents } = require('../../server/domain-model/events');

describe('Session domain object synchronization', () => {
  test('broadcasts TextItem updates to all listeners', () => {
    const session = new Session('session-1');
    const text = new TextItem('text-1', 'hello');
    
    session.addItem(text);
    
    const clientA = { send: jest.fn() };
    const clientB = { send: jest.fn() };
    
    session.subscribe(clientA);
    session.subscribe(clientB);
    
    clientA.send.mockClear();
    clientB.send.mockClear();
    
    text.updateText('world');
    
    expect(clientA.send).toHaveBeenCalledTimes(1);
    expect(clientB.send).toHaveBeenCalledTimes(1);
    
    const msgA = JSON.parse(clientA.send.mock.calls[0][0]);
    const msgB = JSON.parse(clientB.send.mock.calls[0][0]);
    
    expect(msgA).toEqual(msgB);
    expect(msgA).toMatchObject({
      objId: 'text-1',
      type: DomainEvents.UPDATE_TEXT,
      value: 'world'
    });
  });
});