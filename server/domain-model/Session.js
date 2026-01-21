/**
 * @author Joe Granville
 * @date 2026-01-21T17:34:00+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

class Session {
  constructor(id) {
    this.id = id;
    this.domainObjects = new Map();
    this.participants = new Map();
    this.subscribers = new Set();
  }
  
  addDomainObject(obj) {
    this.domainObjects.set(obj.id, obj);
    obj.onChange(event => this._broadcast(obj.id, event));
  }
  
  addParticipants(player) {
    this.participants.set(player.id, player);
  }
  
  subscribe(client) {
    this.subscribers.add(client);
  }
  
  _broadcast(objId, event) {
    const message = JSON.stringify({ objId, ...event });
    this.subscribers.forEach(client => client.send(message));
  }
}

module.exports = Session;