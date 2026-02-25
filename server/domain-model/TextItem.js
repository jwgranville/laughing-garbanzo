/**
 * @author Joe Granville
 * @date 2026-02-25T06:39:16+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainObject = require('./DomainObject');
const { DomainEvents } = require('./events');

class TextItem extends DomainObject {
  constructor(entityId, initialText = '') {
    super(entityId);
    this.text = initialText;
  }
  
  updateText(text) {
    this.text = text;
    this._emitChange({ type: DomainEvents.UPDATE_TEXT, value: text });
  }
  
  toJSON() {
    return { entityId: this.entityId, text: this.text };
  }
  
  updateFromJSON(json) {
    super.updateFromJSON(json)
    if (typeof json.text === 'string' && json.text !== this.text) {
      this.text = json.text;
      this._emitChange({ type: DomainEvents.UPDATE_TEXT, value: this.text });
    }
  }
}

module.exports = TextItem;