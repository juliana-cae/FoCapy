import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('rhythm composer identifies the field as Frase Motivacional',()=>{
  assert.match(html,/id="new-phrase"[^>]*placeholder="Frase Motivacional"/);
});

test('existing motivational phrases open an inline text editor',()=>{
  assert.match(app,/function editMotivationalPhrase\(phrase,index,display\)/);
  assert.match(app,/input\.type='text'/);
  assert.match(app,/updatePhrase\(state\.phrases,index,value\)/);
  assert.match(app,/edit\.onclick=\(\)=>editMotivationalPhrase\(phrase,i,edit\)/);
});
