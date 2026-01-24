/**
 * @author Joe Granville
 * @date 2026-01-24T03:35:03+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainEvents = {
  ADD_ITEM: 'domain:addItem',
  REMOVE_ITEM: 'domain:removeItem',
  
  STATE_INIT: 'domain:stateInitialization',
  
  UPDATE_TEXT: 'domain:updateText',
  
  MOVE: 'domain:move',
  
  ADD_CHILD: 'domain:addChild',
  REMOVE_CHILD: 'domain:removeChild',
  CHILD_CHANGED: 'domain:childChanged'
};

const Commands = {
  UPDATE_TEXT: 'command:updateText',
  
  MOVE: 'command:move'
};

module.exports = { DomainEvents, Commands };