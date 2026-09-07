import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { VEGETATION, awardVegetation } from '../src/core.js';

const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('inventory includes Punzinho as rare and Xixi vencido as legendary',()=>{
  const byId=new Map(VEGETATION.map(item=>[item.id,item]));
  assert.equal(VEGETATION.length,28);
  assert.deepEqual(byId.get('punzinho'),{id:'punzinho',name:'Punzinho',icon:'💨',rarity:'raro',minMinutes:45});
  assert.deepEqual(byId.get('xixi-vencido'),{id:'xixi-vencido',name:'Xixi vencido',icon:'🧪',rarity:'lendário',minMinutes:90});
  assert.equal(awardVegetation({},45,.999999).item.rarity,'raro');
  assert.equal(awardVegetation({},120,.999999).item.rarity,'lendário');
});

test('bottom navigation is hidden rather than merely disabled during an active focus session',()=>{
  assert.match(css,/\.session-active \.bottom-nav\{display:none\}/);
  assert.match(css,/\.timer-card\.is-stopwatch \.timer-actions\{margin-top:2px;gap:26px;transform:translateY\(-8px\)\}/);
  assert.match(css,/\.timer-card\.is-stopwatch \.stopwatch-finish-button\{margin-top:10px;transform:translateY\(-8px\)/);
});
