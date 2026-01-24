/**
 * @author Joe Granville
 * @date 2026-01-23T01:11:37+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const Session = require('../server/domain-model/Session');
const PrimitiveStroke = require('../server/domain-model/canvas/PrimitiveStroke');
const CompositeCanvasItem = require('../server/domain-model/canvas/CompositeCanvasItem');

const session = new Session('session-demo');

const stroke1 = new PrimitiveStroke('stroke-1', { x1:0, y1:0, x2:10, y2:10, color:'red', width:1 });
const stroke2 = new PrimitiveStroke('stroke-2', { x1:10, y1:10, x2:20, y2:20, color:'blue', width:1 });

const group = new CompositeCanvasItem('group-1');
group.addChild(stroke1);
group.addChild(stroke2);

session.addItem(group);

const mockClient = { send: (msg) => console.log('broadcast:', msg) };
session.subscribe(mockClient);

console.log('--- move composite ---');
group.move(5, 5);

console.log('composite group children positions:');
group.children.forEach(child => {
  console.log(child.id, child.stroke);
});

console.log('--- move primitive ---');
stroke1.move(2, 3);

console.log('composite group children positions:');
group.children.forEach(child => {
  console.log(child.id, child.stroke);
});