import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

async function boot(){
  const dom=new JSDOM(html,{url:'http://localhost/'}),{window}=dom;
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  window.localStorage.setItem('focapy-state-v2',JSON.stringify({language:'pt-BR',languageChosen:true,tags:[{name:'Peideta',color:'#d92727'},{name:'Estudo',color:'#269bd2'}],tasks:[{id:'a',title:'Planejar',tag:'Peideta',tagColor:'#d92727'},{id:'b',title:'Ler',tag:'Estudo',tagColor:'#269bd2'}],sessions:[{id:'s1',status:'completed',label:'Foco',focusMinutes:25,completedAt:'2026-09-06T12:00:00.000Z',taskIds:['a'],taskSnapshots:[{id:'a',title:'Planejar',tag:'Peideta',tagColor:'#d92727'}]},{id:'s2',status:'completed',label:'Foco',focusMinutes:45,completedAt:'2026-09-07T12:00:00.000Z',taskIds:['b'],taskSnapshots:[{id:'b',title:'Ler',tag:'Estudo',tagColor:'#269bd2'}]}]}));
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('not needed')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?task-category-history=${Date.now()}-${Math.random()}`);
  return window;
}

test('a task category is a direct button that opens its own category editor',async()=>{
 const window=await boot(),doc=window.document;
 doc.querySelector('[data-screen="tasks"]').click();
 const row=[...doc.querySelectorAll('#task-session-list .task-row')].find(item=>item.textContent.includes('Planejar'));
 assert.ok(row);
 assert.equal(row.querySelector('.task-category-badge').tagName,'BUTTON');
 assert.equal(row.querySelector('select'),null);
 row.querySelector('.task-category-badge').click();
 const picker=row.querySelector('select');
 assert.ok(picker);
 picker.value='Estudo';picker.dispatchEvent(new window.Event('change',{bubbles:true}));
 assert.equal([...doc.querySelectorAll('#task-session-list .task-row')].find(item=>item.textContent.includes('Planejar')).querySelector('.task-category-badge').textContent,'Estudo');
});

test('history category filter limits task choices and deleting a row removes only that historical record',async()=>{
 const window=await boot(),doc=window.document;
 doc.querySelector('[data-screen="tasks"]').click();
 const category=doc.getElementById('task-history-tag-filter');
 category.value='Estudo';category.dispatchEvent(new window.Event('change',{bubbles:true}));
 const task=doc.getElementById('task-history-filter');
 task.value='b';task.dispatchEvent(new window.Event('change',{bubbles:true}));
 category.value='Peideta';category.dispatchEvent(new window.Event('change',{bubbles:true}));
 assert.deepEqual([...doc.getElementById('task-history-filter').options].map(option=>option.textContent),['Todas as tarefas','Planejar']);
 assert.match(doc.getElementById('task-history-list').textContent,/Planejar/);
 assert.doesNotMatch(doc.getElementById('task-history-list').textContent,/Ler/);
 doc.querySelector('.task-history-delete').click();
 assert.doesNotMatch(doc.getElementById('task-history-list').textContent,/Planejar/);
 assert.equal(JSON.parse(window.localStorage.getItem('focapy-state-v2')).sessions[0].taskSnapshots.length,0);
 assert.equal(JSON.parse(window.localStorage.getItem('focapy-state-v2')).sessions[1].taskSnapshots[0].title,'Ler');
});

test('task category card is thirty percent larger than its original compact size',()=>{
 const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');
 assert.match(css,/\.task-category-card\{[^}]*transform:scale\(\.91\)/);
});
