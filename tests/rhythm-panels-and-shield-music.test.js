import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('Rhythm keeps recent sessions and motivational phrases behind separate clickable panels',()=>{
  assert.match(html,/id="history-toggle"[^>]*aria-expanded="false"/);
  assert.match(html,/id="history-content"[^>]*hidden/);
  assert.match(html,/id="phrases-toggle"[^>]*aria-expanded="false"/);
  assert.match(html,/id="phrases-content"[^>]*hidden/);
  assert.match(app,/function toggleHistoryPanel\(\)/);
  assert.match(app,/function togglePhrasesPanel\(\)/);
});

test('a shielded running focus exposes a music button and toggles ambient tracks from its menu',()=>{
  assert.match(html,/id="shield-ambient-button"/);
  assert.match(html,/id="shield-ambient-dialog"/);
  assert.match(app,/function renderShieldAmbientMenu\(\)/);
  assert.match(app,/function toggleShieldAmbientTrack\(track\)/);
  assert.match(app,/shieldAmbientButton\.hidden=!\(running&&state\.strict/);
});

test('focus context excludes completed tasks from the current selection label',()=>{
  const focusContext=app.match(/function renderFocusContext\(session\)\{([\s\S]*?)\nfunction renderTimer/)[1];
  assert.match(focusContext,/state\.tasks\.filter\(task=>!task\.done&&state\.sessionTaskIds\.includes\(task\.id\)\)/);
});
