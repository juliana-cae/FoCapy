import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('translation never installs a global mutation observer that can rewrite interactive controls',()=>{
 assert.doesNotMatch(app,/new MutationObserver\(/);
 assert.doesNotMatch(app,/startTranslationObserver\(/);
});
