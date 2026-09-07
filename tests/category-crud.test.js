import test from 'node:test';
import assert from 'node:assert/strict';
import { addSessionTag, renameSessionTag, removeSessionTag, clearDeletedSessionTagReferences } from '../src/core.js';

const initial = [
  { name: 'Trabalho', color: '#2d6c4d' },
  { name: 'Estudo', color: '#7b61ff' },
];
const expected = (name, color) => ({name, color, fontColor:'#15382e'});

test('a category can be renamed without losing its color or position', () => {
  assert.deepEqual(renameSessionTag(initial, 'Trabalho', 'Projeto'), [expected('Projeto','#2d6c4d'), expected('Estudo','#7b61ff')]);
});

test('renaming a category to an existing name leaves categories unchanged', () => {
  assert.deepEqual(renameSessionTag(initial, 'Trabalho', ' estudo '), [expected('Trabalho','#2d6c4d'), expected('Estudo','#7b61ff')]);
});

test('a category can be removed and a new hexadecimal color is retained', () => {
  assert.deepEqual(removeSessionTag(initial, 'Estudo'), [expected('Trabalho','#2d6c4d')]);
  assert.deepEqual(addSessionTag([], 'Leitura', '#D66E58'), [expected('Leitura','#d66e58')]);
});

test('deleting a category clears active session references but preserves historical data', () => {
  const current = { tag: 'Trabalho', tagColor: '#2d6c4d', tagFontColor: '#ffffff', label: 'Foco' };
  const result = clearDeletedSessionTagReferences(current, 'Trabalho');
  assert.deepEqual(result.selectedTag, '');
  assert.deepEqual(result.current, { tag: '', tagColor: '', tagFontColor: '', label: 'Foco' });
  assert.deepEqual(current, { tag: 'Trabalho', tagColor: '#2d6c4d', tagFontColor: '#ffffff', label: 'Foco' });
});
