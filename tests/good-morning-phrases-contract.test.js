import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('the home screen has a fixed good-morning greeting near its title',()=>{
  assert.match(html,/<h1>Vivencie o seu tempo<\/h1><p id="good-morning-phrase"/);
  assert.match(app,/function renderGoodMorning\(\).*greeting\.textContent=/);
});

test('only motivational phrases are editable in the rhythm screen',()=>{
  assert.match(html,/<h2>Frases motivacionais<\/h2>/);
  assert.doesNotMatch(html,/Frases de bom dia[^<]*<[^>]*(add-phrase-form|phrases-list)/);
  assert.match(app,/savedMotivational=.*filter\(phrase=>!GOOD_MORNING_PHRASES\.includes\(phrase\)\)/);
});
