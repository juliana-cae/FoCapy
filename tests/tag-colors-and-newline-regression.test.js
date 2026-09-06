import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { addSessionTag, normalizeSessionTags } from '../src/core.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('legacy tag strings migrate to editable colored tags without duplicates', () => {
  const tags = normalizeSessionTags(['Trabalho', { name: 'Estudo', color: '#7b61ff' }, ' trabalho ']);
  assert.deepEqual(tags, [
    { name: 'Trabalho', color: '#2d6c4d' },
    { name: 'Estudo', color: '#7b61ff' },
  ]);
  assert.deepEqual(addSessionTag(tags, 'Leitura', '#d66e58').at(-1), { name: 'Leitura', color: '#d66e58' });
});

test('tags configuration is placed immediately above Blindado, is initially collapsed, and offers a hexadecimal color editor', () => {
  const tagsAt = html.indexOf('id="tag-settings"');
  const blindadoAt = html.indexOf('id="strict-toggle"');
  assert.ok(tagsAt >= 0 && tagsAt < blindadoAt);
  assert.match(html, /id="tag-settings-details"[^>]*hidden/);
  assert.match(html, /id="new-tag-color"[^>]*type="hidden"/);
  assert.match(html, /id="tag-color-dialog"/);
  assert.match(html, /class="tag-color-trigger"/);
  assert.match(html, /id="tag-list"/);
  assert.match(app, /function saveTagEdits\(/);
  assert.match(app, /function deleteTag\(/);
});

test('app markup never contains literal escaped newlines rendered as text', () => {
  assert.equal(html.includes('\\n'), false);
});
