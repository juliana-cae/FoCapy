import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const app = readFileSync(new URL('../src/app.js', import.meta.url), 'utf8');
const css = readFileSync(new URL('../src/app.css', import.meta.url), 'utf8');

test('only Foco displays free rhythm choices while Pomo and Cronômetro use their own controls', () => {
  assert.match(html, /id="rhythm-choices"/);
  assert.match(app, /\$\('rhythm-choices'\)\.hidden=state\.sessionType!=='foco'/);
  assert.match(css, /#rhythm-choices\[hidden\]\{display:none!important\}/);
  assert.match(css, /\.pomo-options\{[^}]*background:linear-gradient\(/);
  assert.doesNotMatch(css, /\.pomo-options\{[^}]*#f4e5dc/);
  assert.doesNotMatch(html, /pomo-summary|a frase muda a cada 35 segundos|rotação de 35 s/);
  assert.match(html, /id="time-display"[\s\S]*id="pomo-options"[\s\S]*id="pomo-running-info"/);
  assert.match(html, /id="focus-dashboard"[\s\S]*id="pomo-options"/);
  assert.equal((html.match(/id="pomo-options"/g)||[]).length, 1);
  assert.ok(html.indexOf('id="pomo-options"') < html.indexOf('id="focus-below-dashboard"'));
  assert.match(app, /duration-editor-pad/);
  assert.match(app, /data-duration-key="[:0-9]"/);
  assert.match(app, /inputMode='none'/);
  assert.match(app, /Shielded mode activated/);
  assert.match(app, /If you want true protection/);
  assert.match(app, /panel\.hidden=!active\|\|Boolean\(state\.current\)/);
  assert.match(app,/const pomoRunning=state\.sessionType==='pomo'&&Boolean\(c\.pomoPhase\)/);
  assert.match(app,/if\(!pomoRunning\)\{\$\('pomo-break-info'\)\.textContent=''/);
  assert.doesNotMatch(app, /PAUSA · CICLO|FOCO · CICLO/);
});
