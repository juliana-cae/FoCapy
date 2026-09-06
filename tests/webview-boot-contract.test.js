import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('the WebView entrypoint has no unresolved npm module imports',()=>{
  assert.doesNotMatch(app,/^\s*import\s+.+?\s+from\s+['"]@capacitor\//m);
  assert.match(app,/window\.Capacitor\?\.Plugins\?\.LocalNotifications/);
});
