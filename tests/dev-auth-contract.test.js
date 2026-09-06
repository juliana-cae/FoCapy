import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const main=readFileSync(new URL('../android/app/src/main/java/com/focusgrove/plus/MainActivity.java',import.meta.url),'utf8');
const pluginPath=new URL('../android/app/src/main/java/com/focusgrove/plus/DevAuthPlugin.java',import.meta.url);

test('the entire developer section stays hidden unless device authentication succeeds',()=>{
  assert.match(html,/<section(?=[^>]*id="dev-settings")(?=[^>]*class="dev-settings")(?=[^>]*hidden)[^>]*>/);
  assert.doesNotMatch(html,/id="dev-unlock"/);
  assert.match(app,/addEventListener\('pointerdown',startDevUnlock\)/);
  assert.match(app,/addEventListener\('pointerup',cancelDevUnlock\)/);
  assert.match(app,/authenticateDevAccess/);
  assert.match(app,/\$\('dev-settings'\)\.hidden=!enabled/);
  assert.match(main,/registerPlugin\(DevAuthPlugin\.class\)/);
  assert.match(readFileSync(pluginPath,'utf8'),/@CapacitorPlugin\(name = "DevAuth"\)/);
  assert.doesNotMatch(app,/password|senha|credential/i);
});
