import test from 'node:test';
import assert from 'node:assert/strict';
import { awardVegetation } from '../src/core.js';

const rarityFor=(minutes,roll)=>awardVegetation({},minutes,roll).item.rarity;

test('low effort never awards legendary or rare items',()=>{
  for(const roll of [0,.2,.5,.8,.999999]) assert.equal(rarityFor(15,roll),'comum');
});

test('medium effort opens better rewards without legendary items',()=>{
  const rarities=new Set([0,.4,.7,.999999].map(roll=>rarityFor(45,roll)));
  assert.deepEqual([...rarities].sort(),['incomum','raro']);
});

test('high effort excludes common items and varies between rare and legendary rewards',()=>{
  const rarities=new Set([0,.2,.7,.999999].map(roll=>rarityFor(120,roll)));
  assert.deepEqual([...rarities].sort(),['lendário','raro']);
});

test('the weighted roll makes legendary rewards more likely as high effort increases',()=>{
  assert.equal(rarityFor(90,.5),'raro');
  assert.equal(rarityFor(180,.5),'lendário');
});
