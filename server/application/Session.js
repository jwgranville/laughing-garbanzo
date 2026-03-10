/**
 * @author Joe Granville
 * @date 2026-03-10T22:16:53+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

export default class Session {
  constructor(sessionId) {
    this.sessionId = sessionId;
    this.subscribers = new Set();
  }
  
  subscribe(client) {
    this.subscribers.add(client);
  }
  
  unsubscribe(client) {
    this.subscribers.delete(client);
  }
  
  broadcast(event) {
    const message = JSON.stringify(event);
    this.subscribers.forEach(client => client.send(message));
  }
}