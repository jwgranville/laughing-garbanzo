/**
 * @author Joe Granville
 * @date 2026-01-20T16:12:21+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const express = require('express');
const path = require('path');

function createHTTPServer({ projectRoot }) {
  const app = express();
  app.use(express.static(path.join(projectRoot, 'public')));
  return app;
}

module.exports = { createHTTPServer };