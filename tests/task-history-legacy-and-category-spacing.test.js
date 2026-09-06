import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

async function bootLegacyHistory(){
  const dom=new JSDOM(html,{url:'http://localhost/'}),{window}=dom;
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  window.localStorage.setItem('focapy-state-v2',JSON.stringify({language:'pt-BR',languageChosen:true,tags:[{name:'Estudo',color:'#269bd2'}],tasks:[{id:'study',title:'Revisar matéria',tag:'Estudo',tagColor:'#269bd2',done:true}],sessions:[{id:'legacy-session',status:'completed',label:'Foco',focusMinutes:30,completedAt:'2026-09-06T12:00:00.000Z',taskIds:['study']}]}));
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('not needed')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?legacy-task-history=${Date.now()}-${Math.random()}`);
  window.document.querySelector('[data-screen="tasks"]').click();
  return window;
}

test('legacy completed focus with task IDs is migrated into a filterable and deletable history record',async()=>{
  const window=await bootLegacyHistory(),doc=window.document;
  const category=doc.getElementById('task-history-tag-filter');
  category.value='Estudo';category.dispatchEvent(new window.Event('change',{bubbles:true}));
  assert.match(doc.getElementById('task-history-list').textContent,/Revisar matéria/);
  doc.querySelector('.task-history-delete').click();
  const stored=JSON.parse(window.localStorage.getItem('focapy-state-v2'));
  assert.deepEqual(stored.sessions[0].taskSnapshots,[]);
  assert.deepEqual(stored.sessions[0].taskIds,[]);
});

test('task category creation has real mobile spacing rather than a scaled-down panel',()=>{
  const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');
  assert.doesNotMatch(css,/\.task-category-card\{[^}]*transform:scale/);
  assert.match(css,/\.task-category-card #task-category-creator\{[^}]*padding:18px/);
  assert.match(css,/\.task-category-card #task-category-creator \.tag-create\{[^}]*gap:12px/);
});
