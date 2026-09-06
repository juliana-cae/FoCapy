import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');
test('English greeting and account erasure are explicit app behaviors',()=>{
 assert.match(app,/greeting\.textContent=`“\$\{translateValue\(greetingForDay\(\)\)\}”`/);
 assert.match(html,/id="delete-account"/);
 assert.match(app,/function deleteAccount\(\)/);
 assert.match(app,/localStorage\.removeItem\(STORE_KEY\)/);
});
test('English shielded dashboard receives a subtle lower offset',()=>{
 assert.match(css,/html\[lang="en"\]\.session-active-lock[\s\S]{0,160}translateY\(8px\)/);
});
