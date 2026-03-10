/**
 * @author Joe Granville
 * @date 2026-03-09T22:42:18+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import AbstractCanvasItem from './AbstractCanvasItem.js';
import { DomainEvents } from '../../../shared/domain-events.js';

export default class CompositeCanvasItem extends AbstractCanvasItem {
  constructor(entityId) {
    super(entityId);
    this.children = [];
  }
  
  addChild(childItem) {
    if (!childItem || !(childItem instanceof AbstractCanvasItem)) {
      throw new Error('child must be an AbstractCanvasItem');
    }
    
    this.children.push(childItem);
    
    childItem.onChange((event) => {
      this._emitChange({
        type: DomainEvents.CHILD_CHANGED,
        childId: childItem.entityId,
        childEvent: event,
      });
    });
    
    this._emitChange({
      type: DomainEvents.ADD_CHILD,
      childId: childItem.entityId
    });
  }
  
  removeChild(childItem) {
    const index = this.children.indexOf(childItem);
    if (index >= 0) {
      this.children.splice(index, 1);
      this._emitChange({
        type: DomainEvents.REMOVE_CHILD,
        childId: childItem.entityId
      });
    }
  }
  
  move(dx, dy) {
    this.children.forEach((child) => {
      if (child.move) {
        child.move(dx, dy);
      }
    });
    
    this._emitChange({
      type: DomainEvents.MOVE,
      dx,
      dy
    });
  }
  
  render(ctx) {
    this.children.forEach((child) => {
      if (child.render) {
        child.render(ctx);
      }
    });
  }
  
  toJSON() {
    return {
      entityId: this.entityId,
      children: this.children.map(c => c.toJSON())
    };
  }
  
  updateFromJSON(json) {
    super.updateFromJSON(json);
    if (json.children) {
      this.children = json.children.map(childJson => {
        const existing = this.children.find(c => c.entityId === childJson.entityId);
        if (existing) {
          existing.updateFromJSON(childJson);
          return existing;
        }
        return null;
      }).filter(c => c !== null);
    }
  }
}