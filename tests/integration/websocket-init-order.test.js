/**
 * @author Joe Granville
 * @date 2026-01-24T04:23:49+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const WebSocket = require('ws');
const { DomainEvents, Commands } = require('../../server/domain-model/events');
const server = require('./start-test-server');

let httpServer;

beforeAll(done => {
  httpServer = server.listen(0, done);
});

afterAll(done => {
  httpServer.close(done);
});

test('client receives initialization before updates', done => {
  const port = httpServer.address().port;
  const url = `ws://localhost:${port}`;
  
  const clientA = new WebSocket(url);
  const clientB = new WebSocket(url);
  
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
        objId: 'text-1',
        value: 'shared'
      }));
    }
    
    setTimeout(() => {
      const types = bMessages.map(m => m.type);
      
      const initIndex = types.indexOf(DomainEvents.STATE_INIT);
      const updateIndex = types.indexOf(DomainEvents.UPDATE_TEXT);
      
      expect(initIndex).not.toBe(-1);
      expect(updateIndex).not.toBe(-1);
      expect(initIndex).toBeLessThan(updateIndex);
      
      clientA.close();
      clientB.close();
      done();
    }, 50);
  }
  
  clientA.on('open', onOpen);
  clientB.on('open', onOpen);
});