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
  assert.match(css, /\.pomo-options\{[^}]*background:var\(--cream\)/);
  assert.doesNotMatch(css, /\.pomo-options\{[^}]*#f4e5dc/);
  assert.doesNotMatch(html, /pomo-summary|a frase muda a cada 35 segundos|rotação de 35 s/);
  assert.match(html, /id="time-display"[\s\S]*id="pomo-running-info"/);
  assert.match(app,/translateValue\('Ciclos restantes ·'\)/);
  assert.doesNotMatch(app, /PAUSA · CICLO|FOCO · CICLO/);
});
