/**
 * @author Joe Granville
 * @date 2026-01-21T17:34:00+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const DomainObject = require('./DomainObject');

class TextItem extends DomainObject {
  constructor(id, initialText = '') {
    super(id);
    this.text = initialText;
  }
  
  updateText(newText) {
    this.text = newText;
    this._emitChange({ type: 'updateText', value: newText });
  }
  
  toJSON() {
    return { id: this.id, text: this.text };
  }
}

module.exports = TextItem;