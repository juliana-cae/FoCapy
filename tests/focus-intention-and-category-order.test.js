import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('focus header has category at the right and turns intention into static session text', () => {
  assert.match(html, /id="intention-label"/);
  assert.match(html, /id="session-category"/);
  assert.match(app, /function renderFocusContext\(/);
  assert.match(css, /\.session-active \.timer-card\{margin-top:34px\}/);
  assert.match(css, /\.stopwatch-finish-button\{[^}]*box-shadow:0 0 0 2px/);
});

test('new category creation follows the selected category editor', () => {
  const editor = html.indexOf('id="tag-editor"');
  const create = html.indexOf('class="tag-create-panel"');
  assert.ok(editor >= 0 && create > editor);
});
