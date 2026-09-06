import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('selected category is rendered as a filled color badge beside intention', () => {
  assert.match(app, /category\.style\.background=/);
  assert.match(css, /\.session-category\{[^}]*border-radius:99px/);
  assert.match(css, /\.session-category\{[^}]*color:#fff/);
});

test('category statistics include a donut and color-matched summary rows', () => {
  assert.match(html, /id="category-donut"/);
  assert.match(html, /id="category-donut-summary"/);
  assert.match(app, /function renderCategoryDonut\(/);
});
