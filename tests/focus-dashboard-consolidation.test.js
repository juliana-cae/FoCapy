import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('category controls exist only in preferences below the focus dashboard', () => {
  assert.doesNotMatch(html, /id="session-tag-select"/);
  assert.match(html, /id="tag-settings"/);
  assert.match(html, /id="new-session-tag"/);
  assert.match(html, /id="add-session-tag"/);
  assert.match(app, /function renderSessionTags\(\)\{const list=/);
  assert.doesNotMatch(app, /\$\('session-tag-select'\)/);
});

test('a Blindada active session hides focus content below the timer dashboard and pause restores it', () => {
  assert.match(html, /id="focus-dashboard"/);
  assert.match(html, /id="focus-below-dashboard"/);
  assert.match(css, /\.session-active-lock #focus-below-dashboard\{display:none\}/);
  assert.match(app, /const active=state\.current\?\.status==='running',locked=active&&state\.strict/);
});
