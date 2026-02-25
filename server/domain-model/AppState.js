/**
 * @author Joe Granville
 * @date 2026-02-25T18:41:31+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainObject = require('./DomainObject');
const Entity = require('./Entity');
const { DomainEvents } = require('./events');

class AppState extends Entity {
  constructor(entityId, initialState = null) {
    super(entityId);
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
    if (this.items.has(item.entityId)) {
      throw new Error(`item with entityId "${item.entityId}" already exists`);
    }
    
    this.items.set(item.entityId, item);
    item.onChange(event => this._emit(item.entityId, event));
    this._emit(item.entityId, { type: DomainEvents.ADD_ITEM, payload: item.toJSON() });
  }
  
  removeItem(entityId) {
    const item = this.items.get(entityId);
    if (item) {
      this.items.delete(entityId);
      this._emit(entityId, { type: DomainEvents.REMOVE_ITEM });
    }
  }
  
  getItem(entityId) {
    return this.items.get(entityId) || null;
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
        entityId: item.entityId,
        type: DomainEvents.STATE_INIT,
        payload: item.toJSON()
      });
    }
  }
  
  unsubscribe(callback) {
    this.subscribers.delete(callback);
  }
  
  _emit(entityId, event) {
    const message = { sequence: this._sequence++, entityId, ...event };
    this.subscribers.forEach(cb => cb(message));
  }
  
  toJSON() {
    const result = {};
    for (const [entityId, item] of this.items.entries()) {
      result[entityId] = item.toJSON();
    }
    
    return result;
  }
  
  snapshot() {
    return {
      entityId: this.entityId,
      timestamp: Date.now(),
      sequence: this._sequence,
      state: this.toJSON()
    };
  }
    
  updateFromJSON(json) {
    for (const [entityId, itemState] of Object.entries(json)) {
      let existing = this.items.get(entityId);
      if (existing) {
        existing.updateFromJSON(itemState);
      } else {
        console.warn(`skipping unknown item entityId "${entityId}" in updateFromJSON`);
      }
    }
  }
}

module.exports = AppState;