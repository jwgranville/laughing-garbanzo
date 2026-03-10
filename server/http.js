/**
 * @author Joe Granville
 * @date 2026-03-10T18:38:58+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import express from 'express';
import path from 'path';

export function createHTTPServer({ projectRoot }) {
  const app = express();
  app.use(express.static(path.join(projectRoot, 'public')));
  app.use('/shared', express.static(path.join(projectRoot, 'shared')));
  return app;
}