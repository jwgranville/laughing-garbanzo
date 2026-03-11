/**
 * @author Joe Granville
 * @date 2026-03-11T17:30:35+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import AppState from '../domain-model/AppState.js';
import Session from './Session.js';

export default class AppContext {
  constructor(state, session) {
    this.state = state;
    this.session = session;
    this.state.subscribe(event => this.session.broadcast(event));
  }
  
  addItem(item) {
    this.state.addItem(item);
  }
  
  removeItem(entityId) {
    this.state.removeItem(entityId);
  }
  
  getItem(entityId) {
    return this.state.getItem(entityId);
  }
  
  getAllItems() {
    return this.state.getAllItems();
  }
  
  subscribeToState(callback) {
    this.state.subscribe(callback);
  }
  
  unsubscribeFromState(callback) {
    this.state.unsubscribe(callback);
  }
  
  subscribeClient(client) {
    this.session.subscribe(client);
  }
  
  unsubscribeClient(client) {
    this.session.unsubscribe(client);
  }
  
  snapshot() {
    return this.state.snapshot();
  }
}