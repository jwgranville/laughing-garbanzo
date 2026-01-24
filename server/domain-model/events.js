/**
 * @author Joe Granville
 * @date 2026-01-23T03:14:16+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainEvents = {
  ADD_ITEM: 'addItem',
  REMOVE_ITEM: 'removeItem',
  
  STATE_INIT: 'stateInitialization',
  
  UPDATE_TEXT: 'updateText',
  
  MOVE: 'move',
  
  ADD_CHILD: 'addChild',
  REMOVE_CHILD: 'removeChild',
  CHILD_CHANGED: 'childChanged'
};

module.exports = { DomainEvents };