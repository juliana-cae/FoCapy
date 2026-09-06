import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { VEGETATION, awardVegetation } from '../src/core.js';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

test('Coleção replaces Jardins in the navigation and screen', () => {
  assert.match(html, /data-screen="gardens">▦<small>Coleção<\/small>/);
  assert.match(html, /<h1>Coleção<\/h1>/);
});

test('earned inventory items have no activation or deactivation controls', () => {
  assert.doesNotMatch(app, /item-toggle|toggleInventoryItem|inactiveItems\[item\.id\]/);
  assert.doesNotMatch(html, /Ativar item|Desativar item/);
});

test('Maestre da Cabriola is supreme and requires exceptional focus', () => {
  const item = VEGETATION.find(entry => entry.id === 'maestre-cabriola');
  assert.deepEqual(item, { id: 'maestre-cabriola', name: 'Maestre da Cabriola', icon: '🏆', rarity: 'suprema', minMinutes: 180 });
  assert.equal(awardVegetation({}, 180, [1, .99]).item.rarity, 'suprema');
  assert.notEqual(awardVegetation({}, 179, [1, .99]).item.rarity, 'suprema');
});

test('manual Pause releases focus protection because only running sessions activate it', () => {
  assert.match(app, /const running=state\.current\?\.status==='running'/);
  assert.match(app, /state\.current\.status='paused';clearInterval\(state\.timer\);state\.timer=null;toggleSound\(false\).*?syncFocusProtection\(\);renderTimer\(\)/);
});
