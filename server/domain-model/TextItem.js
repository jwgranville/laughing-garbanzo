/**
 * @author Joe Granville
 * @date 2026-01-23T04:00:27+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainObject = require('./DomainObject');
const { DomainEvents } = require('./events');

class TextItem extends DomainObject {
  constructor(id, initialText = '') {
    super(id);
    this.text = initialText;
  }
  
  updateText(newText) {
    this.text = newText;
    this._emitChange({ type: DomainEvents.UPDATE_TEXT, value: newText });
  }
  
  toJSON() {
    return { id: this.id, text: this.text };
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