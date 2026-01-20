/**
 * @author Joe Granville
 * @date 2026-01-20T16:29:21+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const http = require('http');
const path = require('path');

const { createHTTPServer } = require('./http');
const { createWebSocketServer } = require('./websocket');
const { findProjectRoot } = require(path.join(__dirname, '..', 'infrastructure', 'findProjectRoot'));
const { getExternalIPAddresses } = require(path.join(__dirname, '..', 'infrastructure', 'network'));

const projectRoot = findProjectRoot();

const app = createHTTPServer({ projectRoot });
const server = http.createServer(app);
createWebSocketServer(server);

const PORT = process.env.PORT || 3000;
const addresses = getExternalIPAddresses();
server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  addresses.forEach(({ interface, address, family }) => {
    if (family === 'IPv4') {
      console.log(`  ${interface}: http://${address}:${PORT}`);
    } else {
      console.log(`  ${interface}: ${address}`);
    }
  });
});