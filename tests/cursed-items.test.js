import test from 'node:test';
import assert from 'node:assert/strict';
import { VEGETATION, awardVegetation } from '../src/core.js';

test('requested items are in their declared categories', () => {
  const item = id => VEGETATION.find(entry => entry.id === id);
  assert.deepEqual(item('peideta'), { id: 'peideta', name: 'Peideta', icon: '😜', rarity: 'lendário', minMinutes: 90 });
  assert.deepEqual(item('varinha-magica'), { id: 'varinha-magica', name: 'Varinha mágica', icon: '🪄', rarity: 'incomum', minMinutes: 20 });
  assert.deepEqual(item('lacinho-brega'), { id: 'lacinho-brega', name: 'Lacinho brega', icon: '🎀', rarity: 'raro', minMinutes: 45 });
  assert.deepEqual(item('flor-de-lotus'), { id: 'flor-de-lotus', name: 'Flor de lótus', icon: '🪷', rarity: 'comum', minMinutes: 1 });
  assert.deepEqual(item('palmeira-amaldicoada'), { id: 'palmeira-amaldicoada', name: 'Palmeira', icon: '🌴', rarity: 'amaldiçoado', minMinutes: 1 });
});

test('the cursed Palmeira has a fixed 0.5% independent reward roll', () => {
  assert.equal(awardVegetation({}, 1, () => .004).item.id, 'palmeira-amaldicoada');
  assert.notEqual(awardVegetation({}, 180, () => .005).item.id, 'palmeira-amaldicoada');
  assert.equal(awardVegetation({}, 15, [0.005, .9]).item.rarity, 'comum');
});
