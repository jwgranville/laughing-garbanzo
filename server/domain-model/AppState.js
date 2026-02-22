/**
 * @author Joe Granville
 * @date 2026-01-23T03:59:57+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainObject = require('./DomainObject');
const { DomainEvents } = require('./events');

class AppState {
  constructor(id, initialState = null) {
    this.id = id;
    this.items = new Map();
    this.subscribers = new Set();
    this._sequence = 0;
    
    if (initialState) {
      this.updateFromJSON(initialState);
    }
  }
  
  addItem(item) {
    if (!(item instanceof DomainObject)) {
      throw new Error('only DomainObject instances can be added');
    }
    if (this.items.has(item.id)) {
      throw new Error(`item with id "${item.id}" already exists`);
    }
    
    this.items.set(item.id, item);
    item.onChange(event => this._emit(item.id, event));
    this._emit(item.id, { type: DomainEvents.ADD_ITEM, payload: item.toJSON() });
  }
  
  removeItem(itemId) {
    const item = this.items.get(itemId);
    if (item) {
      this.items.delete(itemId);
      this._emit(itemId, { type: DomainEvents.REMOVE_ITEM });
    }
  }
  
  getItem(itemId) {
    return this.items.get(itemId) || null;
  }
  
  getAllItems() {
    return Array.from(this.items.values());
  }
  
  getItemsByType(typeName) {
    return Array.from(this.items.values()).filter(
      item => item.constructor.name === typeName
    );
  }
  
  subscribe(callback) {
    this.subscribers.add(callback);
    for (const item of this.items.values()) {
      callback({
        itemId: item.id,
        type: DomainEvents.STATE_INIT,
        payload: item.toJSON()
      });
    }
  }
  
  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }
  
  _emit(itemId, event) {
    const message = { sequence: this._sequence++, itemId, ...event };
    this.subscribers.forEach(cb => cb(message));
  }
  
  toJSON() {
    const result = {};
    for (const [id, item] of this.items.entries()) {
      result[id] = item.toJSON();
    }
    
    return result;
  }
  
  snapshot() {
    return {
      id: this.id,
      timestamp: Date.now(),
      sequence: this._sequence,
      state: this.toJSON()
    };
  }
    
  updateFromJSON(json) {
    const result = {};
    for (const [id, itemState] of Object.entries(json)) {
      let existing = this.items.get(id);
      if (existing) {
        existing.updateFromJSON(itemState);
      } else {
        console.warn(`skipping unknown item id "${id}" in updateFromJSON`);
      }
    }
  }
}

module.exports = AppState;