import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const portugueseUiCopy=['SESSÃO DE HOJE','Vivencie o seu tempo','Intenção','Começar foco','Escolha o ritmo','Livre','Cronômetro','Configurar','Categorias','Blindado','Som ambiente','Adicionar som','Lista de tarefas','Histórico de tarefas','Estatísticas','Tarefas','Preferências','Meta diária','Salvar meta','Limpar dados locais','Frases motivacionais','Meta alcançada. Seu vale agradece.','Próxima temporada em','Descanso ·','Ciclos restantes ·','Pausar','Recomeçar','Encerrar e ganhar'];

test('English boot translates interface copy and preserves start interaction',async()=>{
  const dom=new JSDOM(html,{url:'http://localhost/'});
  const {window}=dom;
  window.localStorage.setItem('focapy-state-v2',JSON.stringify({language:'en',languageChosen:true}));
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('IndexedDB access is not required for boot')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?english=${Date.now()}`);
  const visibleCopy=[...window.document.querySelectorAll('button,h1,h2,h3,p,label,small,option')].filter(node=>!node.closest('[hidden]')).map(node=>node.textContent.trim());
  for(const phrase of portugueseUiCopy) assert.ok(!visibleCopy.includes(phrase),`Portuguese UI copy remains: ${phrase}`);
  const start=window.document.getElementById('start-button');
  assert.equal(start.textContent,'Start focus');
  start.click();
  assert.equal(start.textContent,'Pause');
  window.document.querySelector('[data-screen="tasks"]').click();
  assert.ok(window.document.getElementById('tasks').classList.contains('active'));
});
