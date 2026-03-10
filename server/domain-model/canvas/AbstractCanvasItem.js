/**
 * @author Joe Granville
 * @date 2026-03-09T22:41:17+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import DomainObject from '../DomainObject.js';

export default class AbstractCanvasItem extends DomainObject {
  constructor(entityId) {
    if (new.target === AbstractCanvasItem) {
      throw new TypeError('Cannot instantiate AbstractCanvasItem directly');
    }
    super(entityId);
  }
  
  addChild(item) {
    throw new Error('addChild must be implemented in subclass');
  }
  
  move(dx, dy) {
    throw new Error('move must be implemented in subclass');
  }
  
  render(ctx) {
    throw new Error('render must be implemented in subclass');
  }
}