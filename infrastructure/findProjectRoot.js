/**
 * @author Joe Granville
 * @date 2026-01-20T16:12:21+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const path = require('path');
const fs = require('fs');

function findProjectRoot(startDir = __dirname) {
  let dir = startDir;
  
  while (!fs.existsSync(path.join(dir, 'package.json'))) {
    const parent = path.dirname(dir)
    if (parent === dir) {
      throw new Error('Project root not found');
    }
    dir = parent;
  }
  
  return dir;
}

module.exports = { findProjectRoot };