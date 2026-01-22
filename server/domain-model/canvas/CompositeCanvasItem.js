/**
 * @author Joe Granville
 * @date 2026-01-21T22:55:26+00:00
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
    
    toJSON() {
      return {
        id: this.id,
        children: this.children.map(c => c.toJSON())
      };
    }
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
}

module.exports = CompositeCanvasItem;