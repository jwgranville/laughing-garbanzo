/**
 * @author Joe Granville
 * @date 2026-01-22T19:26:44+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const AbstractCanvasItem = require('./AbstractCanvasItem');

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
        type: 'childChanged',
        childId: childItem.id,
        child: event,
      });
    });
    
    this._emitChange({
      type: 'addChild',
      childId: childItem.id
    });
  }
  
  removeChild(childItem) {
    const index = this.children.indexOf(childItem);
    if (index >= 0) {
      this.children.splice(index, 1);
      this._emitChange({
        type: 'removeChild',
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
      type: 'move',
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