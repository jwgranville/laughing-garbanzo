/**
 * @author Joe Granville
 * @date 
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

const Session = require('./Session');
const TextItem = require('./TextItem');

const session = new Session('session-1');

const note = new TextItem('note-1', 'Hello, World!');
session.addDomainObject(note);

const mockClient = { send: (msg) => console.log('Broadcast:', msg) };
session.subscribe(mockClient);

note.updateText('UpdateText');