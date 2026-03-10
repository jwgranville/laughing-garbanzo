/**
 * @author Joe Granville
 * @date 2026-03-10T22:26:33+00:00
 * @license MIT
 * @version 0.1.0
 * @email 874605+jwgranville@users.noreply.github.com
 * @status Proof-of-concept
 */

import AppState from '../domain-model/AppState.js';
import Session from './Session.js';

export default class AppContext {
  constructor(state, session) {
    this.state = state;
    this.session = session;
    this.state.subscribe(event => this.session.broadcast(event));
  }
}