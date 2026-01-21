/**
 * @author Joe Granville
 * @date 
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const WebSocket = require('ws');
const server = require('./start-test-server');

let httpServer;

beforeAll(done => {
  httpServer = server.listen(0, done);
});

afterAll(done => {
  httpServer.close(done);
});

description('WebSocket broadcast behavior', () => {
  test('multiple WebSocket clients receive the same message', done => {
    const port = httpServer.address().port;
    const url = `ws://localhost:${port}`;
    
    const clientA = new WebSocket(url);
    const clientB = new WebSocket(url);
    
    let received = 0;
    
    function check(msg) {
      const data = JSON.parse(msg);
      expect(data.value).toBe('shared');
      received++;
      if (received === 2) {
        clientA.close();
        clientB.close();
        done();
      }
    }
    
    clientA.on('message', check);
    clientB.on('message', check);
    
    clientA.on('open', () => {
      clientA.send(JSON.stringify({
        value: 'shared'
      }));
    });
  });
});