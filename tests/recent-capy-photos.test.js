import test from 'node:test';
import assert from 'node:assert/strict';
import { COMPLETION_IMAGE_FILES, FOCUS_SESSION_IMAGE_FILES } from '../src/core.js';
import { existsSync, readFileSync } from 'node:fs';

const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');

const recent = ['completion-pool.jpg','completion-eating.jpg','completion-grass-chew.jpg','completion-call.jpg'];

test('recent capybara photos are bundled for random completion and focus sessions', () => {
  for (const file of recent) {
    assert.ok(COMPLETION_IMAGE_FILES.includes(file));
    assert.ok(FOCUS_SESSION_IMAGE_FILES.includes(file));
    assert.equal(existsSync(new URL(`../assets/${file}`, import.meta.url)), true);
  }
  assert.match(app, /FOCUS_SESSION_IMAGE_FILES/);
  assert.match(app, /focusImage/);
});
