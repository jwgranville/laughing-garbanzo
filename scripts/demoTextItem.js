/**
 * @author Joe Granville
 * @date 2026-03-11T17:42:10+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import Session from '../server/application/Session.js';
import AppContext from '../server/application/AppContext.js';
import AppState from '../server/domain-model/AppState.js';
import TextItem from '../server/domain-model/TextItem.js';

const appState = new AppState('demo-state');
const session = new Session('session-1');
const context = new AppContext(appState, session);

const note = new TextItem('note-1', 'Hello, World!');
context.addItem(note);

const mockClient = { send: (msg) => console.log('Broadcast:', msg) };
context.subscribeClient(mockClient);

note.updateText('UpdateText');