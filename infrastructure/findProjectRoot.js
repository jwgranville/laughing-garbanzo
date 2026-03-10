/**
 * @author Joe Granville
 * @date 2026-03-10T04:54:36+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const dirname = path.dirname(fileURLToPath(import.meta.url));

export function findProjectRoot(startDir = dirname) {
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