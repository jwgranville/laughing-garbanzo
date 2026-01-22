/**
 * @author Joe Granville
 * @date 2026-01-22T19:26:44+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const AbstractCanvasItem = require('./AbstractCanvasItem');

class PrimitiveStroke extends AbstractCanvasItem {
  constructor(id, stroke) {
    super(id);
    this.stroke = stroke;
  }
  
  addChild() {
    throw new Error('PrimitiveStroke does not support child items');
  }
  
  move(dx, dy) {
    this.stroke.x1 += dx;
    this.stroke.y1 += dy;
    this.stroke.x2 += dx;
    this.stroke.y2 += dy;
    this._emitChange({
      type: 'move',
      x1: this.stroke.x1,
      y1: this.stroke.y1,
      x2: this.stroke.x2,
      y2: this.stroke.y2
    });
  }
  
  render(ctx) {
    ctx.strokeStyle = this.stroke.color || 'black';
    ctx.lineWidth = this.stroke.width || 1;
    ctx.beginPath();
    ctx.moveTo(this.stroke.x1, this.stroke.y1);
    ctx.lineTo(this.stroke.x2, this.stroke.y2);
    ctx.stroke();
  }
  
  toJSON() {
    return { id: this.id, stroke: { ...this.stroke } };
  }
}

module.exports = PrimitiveStroke;