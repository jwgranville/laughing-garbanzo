/**
 * @author Joe Granville
 * @date 2026-01-24T02:45:20+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const AbstractCanvasItem = require('./AbstractCanvasItem');
const { DomainEvents } = require('../events');

class CompositeCanvasItem extends AbstractCanvasItem {
  constructor(id) {
    super(id);
    this.children = [];
  }
  
  addChild(childItem) {
    if (!childItem || !childItem.id) {
      throw new Error('child must be an AbstractCanvasItem with an id');
    }
    
    this.children.push(childItem);
    
    childItem.onChange((event) => {
      this._emitChange({
        type: DomainEvents.CHILD_CHANGED,
        childId: childItem.id,
        childEvent: event,
      });
    });
    
    this._emitChange({
      type: DomainEvents.ADD_CHILD,
      childId: childItem.id
    });
  }
  
  removeChild(childItem) {
    const index = this.children.indexOf(childItem);
    if (index >= 0) {
      this.children.splice(index, 1);
      this._emitChange({
        type: DomainEvents.REMOVE_CHILD,
        childId: childItem.id
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
      id: this.id,
      children: this.children.map(c => c.toJSON())
    };
  }
  
  updateFromJSON(json) {
    super.updateFromJSON(json);
    if (json.children) {
      this.children = json.children.map(childJson => {
        const existing = this.children.find(c => c.id === childJson.id);
        if (existing) {
          existing.updateFromJSON(childJson);
          return existing;
        }
        return null;
      }).filter(c => c !== null);
    }
  }
}

module.exports = CompositeCanvasItem;