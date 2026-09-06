import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('Categories is a collapsed card that expands to reveal its editing panel', () => {
  assert.match(html, /id="tag-settings-toggle"/);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /id="tag-settings-details"[^>]*hidden/);
  assert.match(css, /\.tag-settings-details\[hidden\]\{display:none!important\}/);
  assert.match(app, /function toggleTagSettings\(/);
});

test('expanded category panel provides hexadecimal creation, rename, color and delete controls', () => {
  assert.match(html, /id="new-session-tag"/);
  assert.match(html, /id="new-tag-color"[^>]*type="hidden"/);
  assert.match(html, /class="tag-color-trigger"/);
  assert.match(app, /function saveTagEdits\(/);
  assert.match(app, /function deleteTag\(/);
  assert.doesNotMatch(html, /id="tag-color"[^>]*type="color"/);
});
