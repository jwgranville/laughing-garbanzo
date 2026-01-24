/**
 * @author Joe Granville
 * @date 2026-01-24T02:12:35+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const CompositeCanvasItem = require('../../server/domain-model/canvas/CompositeCanvasItem');
const AbstractCanvasItem = require('../../server/domain-model/canvas/AbstractCanvasItem');
const { DomainEvents } = require('../../server/domain-model/events');

class MockPrimitive extends AbstractCanvasItem {
  constructor(id) {
    super(id);
    this.position = { x: 0, y: 0 };
  }
  
  addChild() {
    throw new Error('MockPrimitive does not support child items');
  }
  
  move(dx, dy) {
    this.position.x += dx;
    this.position.y += dy;
    this._emitChange({
      type: DomainEvents.MOVE,
      dx,
      dy
    });
  }
  
  render(ctx) {
    // No-op
  }
}

describe('CompositeCanvasItem basic opeartions', () => {
  test('can add and remove children', () => {
    const composite = new CompositeCanvasItem('composite-1');
    const child1 = new MockPrimitive('child-1');
    const child2 = new MockPrimitive('child-2');
    
    composite.addChild(child1);
    composite.addChild(child2);
    
    expect(composite.children).toContain(child1);
    expect(composite.children).toContain(child2);
    
    composite.removeChild(child1);
    expect(composite.children).not.toContain(child1);
    expect(composite.children).toContain(child2);
  });
  
  test('move propagates to children', () => {
    const composite = new CompositeCanvasItem('composite-2');
    const child1 = new MockPrimitive('child-1');
    const child2 = new MockPrimitive('child-2');
    
    composite.addChild(child1);
    composite.addChild(child2);
    
    composite.move(9, 10);
    
    expect(child1.position).toEqual({ x: 9, y: 10 });
    expect(child2.position).toEqual({ x: 9, y: 10 });
  });
  
  test('child events propagate to composite', () => {
    const composite = new CompositeCanvasItem('composite-3');
    const child = new MockPrimitive('child-1');
    
    composite.addChild(child);
    
    const compositeEvents = [];
    composite.onChange(evt => compositeEvents.push(evt));
    
    child.move(3, 4);
    
    expect(compositeEvents).toHaveLength(1);
    expect(compositeEvents[0]).toMatchObject({
      type: DomainEvents.CHILD_CHANGED,
      childId: 'child-1',
      childEvent: {
        type: DomainEvents.MOVE,
        dx: 3,
        dy: 4
      }
    });
  });
  
  test('composite emits addChild events', () => {
    const composite = new CompositeCanvasItem('composite-4');
    const child = new MockPrimitive('child-1');
    
    const events = [];
    composite.onChange(evt => events.push(evt));
    
    composite.addChild(child);
    
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({ type: DomainEvents.ADD_CHILD, childId: 'child-1'});
  });
  
  test('composite emits move events when moved', () => {
    const composite = new CompositeCanvasItem('composite-5');
    const child = new MockPrimitive('child-1');
    
    composite.addChild(child);
    
    const events = [];
    composite.onChange(evt => events.push(evt));
    
    composite.move(1, 2);
    
    const moveEvent = events.find(e => e.type === DomainEvents.MOVE);
    expect(moveEvent).toMatchObject({ dx: 1, dy: 2 });
  });
});