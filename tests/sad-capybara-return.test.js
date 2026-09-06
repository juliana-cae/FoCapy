import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('returning after the shield pauses focus shows the supplied sad capybara notice', () => {
  assert.equal(existsSync(new URL('../assets/capybara-sad.png', import.meta.url)), true);
  assert.match(html, /id="shield-paused-dialog"/);
  assert.match(html, /assets\/capybara-sad\.png/);
  assert.match(app, /function showShieldPausedNotice\(/);
  assert.match(app, /showShieldPausedNotice\(\);state\.shieldPaused=false/);
  assert.match(css, /\.shield-paused-dialog img/);
});
