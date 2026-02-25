/**
 * @author Joe Granville
 * @date 2026-02-25T18:35:53+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const Entity = require('./Entity');

class DomainObject extends Entity {
  constructor(entityId) {
    super(entityId);
    this.listeners = [];
  }
  
  onChange(listener) {
    this.listeners.push(listener);
  }
  
  _emitChange(event) {
    this.listeners.forEach(l => l(event));
  }
  
  toJSON() {
    return { entityId: this.entityId };
  }
  
  updateFromJSON(json) {
    if (json.entityId && json.entityId !== this.entityId) {
      throw new Error('mismatched IDs during updateFromJSON');
    }
  }
}

module.exports = DomainObject;