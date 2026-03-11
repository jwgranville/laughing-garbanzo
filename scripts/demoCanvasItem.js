/**
 * @author Joe Granville
 * @date 2026-03-11T17:40:02+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import Session from '../server/application/Session.js';
import AppContext from '../server/application/AppContext.js';
import AppState from '../server/domain-model/AppState.js';
import PrimitiveCanvasStroke from '../server/domain-model/canvas/PrimitiveCanvasStroke.js';
import CompositeCanvasItem from '../server/domain-model/canvas/CompositeCanvasItem.js';

const appState = new AppState('demo-state');
const session = new Session('session-demo');
const context = new AppContext(appState, session);

const stroke1 = new PrimitiveCanvasStroke('stroke-1', { x1:0, y1:0, x2:10, y2:10, color:'red', width:1 });
const stroke2 = new PrimitiveCanvasStroke('stroke-2', { x1:10, y1:10, x2:20, y2:20, color:'blue', width:1 });

const group = new CompositeCanvasItem('group-1');
group.addChild(stroke1);
group.addChild(stroke2);

context.addItem(group);

const mockClient = { send: (msg) => console.log('broadcast:', msg) };
context.subscribeClient(mockClient);

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