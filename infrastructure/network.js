/**
 * @author Joe Granville
 * @date 2026-01-20T16:55:00+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const os = require('os');

function getExternalIPAddresses() {
  const interfaces = os.networkInterfaces();
  const results = [];
  
  for (const [name, entries] of Object.entries(interfaces)) {
    for (const physicalAddr of entries) {
      if (physicalAddr.internal) continue;
      
      results.push({
        interface: name,
        address: physicalAddr.address,
        family: physicalAddr.family
      });
    }
  }
  
  return results;
}

module.exports = { getExternalIPAddresses };