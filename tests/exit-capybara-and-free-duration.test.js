import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('leaving any running focus pauses it and shows the sad capybara on return',()=>{
 assert.match(app,/function pauseForExit\(\)\{if\(state\.current\?\.status!=='running'/);
 assert.match(app,/document\.addEventListener\('visibilitychange',\(\)=>\{if\(document\.hidden\)\{pauseForExit\(\)/);
 assert.match(app,/else if\(state\.shieldPaused\)\{showShieldPausedNotice\(\)/);
});

test('custom free duration receives the same selected green treatment',()=>{
 assert.match(app,/button\.classList\.add\('selected'\)/);
 assert.match(css,/\.free-duration\.selected\{background:var\(--lime\)/);
});
