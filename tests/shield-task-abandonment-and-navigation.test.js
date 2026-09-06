import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('activating Blindado explains that screen pinning must be enabled in settings',()=>{
  assert.match(app,/strict-toggle.*onchange/);
  assert.match(app,/Fixar tela.*Configurações|fixação de tela.*configurações/i);
});

test('intention task selection associates immediately without an Associar tarefas button',()=>{
  assert.doesNotMatch(html,/id="apply-intention-tasks"/);
  assert.match(app,/check\.onchange=\(\)=>/);
  assert.match(app,/state\.sessionTaskIds=taskIdsForSession/);
});

test('abandoning a focus session clears it without completion reward or completion sound',()=>{
  assert.match(html,/id="reset-button"[^>]*>Abandonar/);
  assert.match(app,/function abandonSession\(/);
  assert.match(app,/abandonSession/);
  assert.doesNotMatch(app,/function resetSession\(\).*completeSession\(\)/);
});

test('stopwatch dashboard exposes Abandonar below the existing controls',()=>{
  assert.match(html,/id="reset-button"[^>]*>Abandonar/);
  assert.match(app,/stopwatch.*Abandonar|Abandonar.*stopwatch/i);
});

test('bottom navigation follows Foco, Tarefa, Inventário, Coleção, Estatística, Ritmo',()=>{
  const nav=html.slice(html.indexOf('<nav class="bottom-nav">'),html.indexOf('</nav>',html.indexOf('<nav class="bottom-nav">')));
  const screens=[...nav.matchAll(/data-screen="([^"]+)"/g)].map(match=>match[1]);
  assert.deepEqual(screens,['focus','tasks','grove','gardens','statistics','progress']);
});
