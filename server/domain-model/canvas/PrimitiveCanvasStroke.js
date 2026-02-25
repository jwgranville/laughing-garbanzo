/**
 * @author Joe Granville
 * @date 2026-02-25T05:00:35+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const AbstractCanvasItem = require('./AbstractCanvasItem');
const { DomainEvents } = require('../events');

class PrimitiveCanvasStroke extends AbstractCanvasItem {
  constructor(entityId, stroke) {
    super(entityId);
    this.stroke = stroke;
  }
  
  addChild() {
    throw new Error('PrimitiveCanvasStroke does not support child items');
  }
  
  move(dx, dy) {
    this.stroke.x1 += dx;
    this.stroke.y1 += dy;
    this.stroke.x2 += dx;
    this.stroke.y2 += dy;
    this._emitChange({
      type: DomainEvents.MOVE,
      x1: this.stroke.x1,
      y1: this.stroke.y1,
      x2: this.stroke.x2,
      y2: this.stroke.y2
    });
  }
  
  render(ctx) {
    ctx.strokeStyle = this.stroke.color || 'black';
    ctx.lineWentityIdth = this.stroke.wentityIdth || 1;
    ctx.beginPath();
    ctx.moveTo(this.stroke.x1, this.stroke.y1);
    ctx.lineTo(this.stroke.x2, this.stroke.y2);
    ctx.stroke();
  }
  
  toJSON() {
    return { entityId: this.entityId, stroke: { ...this.stroke } };
  }
}

module.exports = PrimitiveCanvasStroke;