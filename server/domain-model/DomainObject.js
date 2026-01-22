/**
 * @author Joe Granville
 * @date 2026-01-22T19:26:44+00:00
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
  
  toJSON() {
    return { id: this.id };
  }
  
  updateFromJSON(json) {
    if (json.id && json.id !== this.id) {
      throw new Error('mismatched IDs during updateFromJSON');
    }
  }
}

module.exports = DomainObject;