import test from 'node:test';
import assert from 'node:assert/strict';
import { hexToRgb, rgbToHex, rgbToCmyk } from '../src/core.js';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('tag color conversions keep hexadecimal, RGB and CMYK values consistent', () => {
  assert.deepEqual(hexToRgb('#2d6c4d'), { r: 45, g: 108, b: 77 });
  assert.equal(rgbToHex(45, 108, 77), '#2D6C4D');
  assert.deepEqual(rgbToCmyk(255, 0, 0), { c: 0, m: 100, y: 100, k: 0 });
});

test('tag color controls use a compact color-dialog menu with picker, hue, preview and RGB/CMYK/Hex fields', () => {
  assert.match(html, /id="tag-color-dialog"/);
  assert.match(app, /function openTagColorMenu\(/);
  assert.match(app, /function syncTagColorMenu\(/);
  assert.match(app, /function setTagColorFromRgb\(/);
  assert.match(css, /\.color-plane/);
  assert.match(css, /\.hue-slider/);
  assert.match(css, /\.color-preview/);
});
