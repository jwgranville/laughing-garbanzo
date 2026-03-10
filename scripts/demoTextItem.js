/**
 * @author Joe Granville
 * @date 2026-03-09T22:38:09+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import Session from './Session.js';
import TextItem from './TextItem.js';

const session = new Session('session-1');

const note = new TextItem('note-1', 'Hello, World!');
session.addDomainObject(note);

const mockClient = { send: (msg) => console.log('Broadcast:', msg) };
session.subscribe(mockClient);

note.updateText('UpdateText');