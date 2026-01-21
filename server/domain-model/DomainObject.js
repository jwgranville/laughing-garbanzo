/**
 * @author Joe Granville
 * @date 2026-01-21T17:34:00+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

class DomainObject {
  constructor(id) {
    this.id = id;
    this.listeners = [];
  }
  
  onChange(listener) {
    this.listeners.push(listener);
  }
  
  _emitChange(event) {
    this.listeners.forEach(l => l(event));
  }
}

module.exports = DomainObject;