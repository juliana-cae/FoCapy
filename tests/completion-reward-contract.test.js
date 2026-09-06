import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('completion dialog unwraps the awarded inventory item and identifies it clearly',()=>{
  assert.match(app,/function showCompletionDialog\(rewardResult\)/);
  assert.match(app,/const item=rewardResult\?\.item/);
  assert.match(app,/Você ganhou: \$\{item\.icon\} \$\{item\.name\}/);
  assert.match(app,/Item \$\{item\.rarity\}/);
  assert.doesNotMatch(app,/Ganhou um\(a\) \$\{reward\.icon\} \$\{reward\.name\}/);
});
