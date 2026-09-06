import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('Pomo hides the free rhythm choices and uses the app green-cream palette', () => {
  assert.match(html, /id="rhythm-choices"/);
  assert.match(app, /\$\('rhythm-choices'\)\.hidden=state\.sessionType==='pomo'/);
  assert.match(css, /#rhythm-choices\[hidden\]\{display:none!important\}/);
  assert.match(css, /\.pomo-options\{[^}]*background:var\(--cream\)/);
  assert.doesNotMatch(css, /\.pomo-options\{[^}]*#f4e5dc/);
});
