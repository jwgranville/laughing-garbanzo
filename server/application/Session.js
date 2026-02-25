/**
 * @author Joe Granville
 * @date 2026-02-25T06:19:38+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

class Session {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.domainObjects = new Map();
    this.subscribers = new Set();
  }
  
  addItem(item) {
    this.domainObjects.set(item.entityId, item);
    item.onChange(event => this._broadcast(item.entityId, event));
  }
  
  subscribe(client) {
    this.subscribers.add(client);
  }
  
  _broadcast(entityId, event) {
    const message = JSON.stringify({ entityId, ...event });
    this.subscribers.forEach(client => client.send(message));
  }
}

module.exports = Session;