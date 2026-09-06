import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('the focus session tag is an interactive control for changing the current session tag', () => {
  assert.match(html, /<button id="session-category"[^>]*type="button"/);
  assert.match(app, /function openSessionTagPicker\(/);
  assert.match(app, /session-category-picker/);
  assert.match(app, /state\.current\.tag=tag/);
  assert.match(app, /state\.current\.tagColor=definition\?\.color/);
  assert.match(app, /state\.current\.tagFontColor=definition\?\.fontColor\|\|''/);
  assert.match(app, /const tag=session\?\.tag!==undefined\?session\.tag:state\.selectedTag\|\|''/);
  assert.match(app, /button\.replaceWith\(select\)/);
  assert.match(app, /select\.focus\(\);select\.showPicker\?\.\(\)/);
  assert.match(app, /select\.onblur=restore/);
  assert.match(app, /new Option\(state\.language==='en'\?'No category':'Sem categoria',''\)/);
});

test('the locked-screen dashboard is positioned lower on the page', () => {
  assert.match(css, /html\[lang="en"\]\.session-active-lock \.timer-card\{transform:translateY\(18px\)\}/);
});
