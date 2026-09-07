import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

async function boot(language,overrides={}){
  const dom=new JSDOM(html,{url:'http://localhost/'}),{window}=dom;
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  window.localStorage.setItem('focapy-state-v2',JSON.stringify({language,languageChosen:true,tags:[{name:'Home',color:'#d92727'},{name:'Study',color:'#269bd2'}],tasks:[{id:'home',title:'Clean desk',tag:'Home',tagColor:'#d92727'},{id:'study',title:'Read book',tag:'Study',tagColor:'#269bd2'}],sessionTaskIds:['home'],current:language==='pt-BR'?{status:'running',label:'Foco profundo',taskIds:['home'],taskSnapshots:[{id:'home',title:'Clean desk',tag:'Home'}]}:null,phrases:['Comece pequeno. O importante é começar.'],sessions:[{status:'completed',label:'Cronômetro — Foco profundo',focusMinutes:25,completedAt:'2026-09-06T12:00:00.000Z'}],...overrides}));
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('not needed')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?tasks-filter=${language}-${Date.now()}-${Math.random()}`);
  return window;
}

test('category-filtered active tasks show configured colors and completed tasks move to history in both languages',async()=>{
  for(const [language,copy] of [['pt-BR',{phrases:'Frases motivacionais',shield:'protege sua sessão de foco',recent:'Cronômetro — Foco profundo'}],['en',{phrases:'Frases motivacionais|Motivational phrases',shield:'protects your focus session',recent:'Stopwatch — Deep focus'}]]){
    const window=await boot(language),doc=window.document;
    assert.match(doc.body.textContent,new RegExp(copy.phrases));
    assert.match(doc.body.textContent,new RegExp(copy.shield));
    assert.match(doc.getElementById('history-list').textContent,new RegExp(copy.recent));
    doc.querySelector('[data-screen="tasks"]').click();
    const filter=doc.getElementById('task-category-filter');
    assert.ok(filter,language);
    filter.value='Home'; filter.dispatchEvent(new window.Event('change',{bubbles:true}));
    assert.match(doc.getElementById('task-session-list').textContent,/Clean desk/);
    assert.doesNotMatch(doc.getElementById('task-session-list').textContent,/Read book/);
    const badge=doc.querySelector('.task-category-badge');
    assert.equal(badge.textContent,'Home');
    assert.ok(badge.style.backgroundColor,language);
    [...doc.querySelectorAll('#task-session-list button')].find(button=>button.textContent=== (language==='en'?'Complete':'Concluir')).click();
    assert.doesNotMatch(doc.getElementById('task-session-list').textContent,/Clean desk/);
    assert.match(doc.getElementById('completed-task-list').textContent,/Clean desk/);
    assert.deepEqual(JSON.parse(window.localStorage.getItem('focapy-state-v2')).sessionTaskIds,[]);
    if(language==='pt-BR'){
      const saved=JSON.parse(window.localStorage.getItem('focapy-state-v2'));
      assert.deepEqual(saved.current.taskIds,[]);
      assert.deepEqual(saved.current.taskSnapshots,[]);
      assert.doesNotMatch(doc.getElementById('intention-label').textContent,/Clean desk/);
    }
  }
});

test('changing a task through Intenção immediately replaces the active session association',async()=>{
 const window=await boot('pt-BR'),doc=window.document;
 const dialog=doc.getElementById('intention-task-dialog');
 doc.getElementById('intention-label').click();
 assert.equal(dialog.open,true);
 const check=id=>[...doc.querySelectorAll('#intention-task-list input[type="checkbox"]')].find(input=>input.value===id);
 const home=check('home');
 assert.equal(home.checked,true);
 home.checked=false;home.dispatchEvent(new window.Event('change',{bubbles:true}));
 let saved=JSON.parse(window.localStorage.getItem('focapy-state-v2'));
 assert.deepEqual(saved.sessionTaskIds,[]);
 assert.deepEqual(saved.current.taskIds,[]);
 assert.deepEqual(saved.current.taskSnapshots,[]);
 assert.doesNotMatch(doc.getElementById('intention-label').textContent,/Clean desk/);
 const study=check('study');
 study.checked=true;study.dispatchEvent(new window.Event('change',{bubbles:true}));
 saved=JSON.parse(window.localStorage.getItem('focapy-state-v2'));
 assert.deepEqual(saved.sessionTaskIds,['study']);
 assert.deepEqual(saved.current.taskIds,['study']);
 assert.equal(saved.current.taskSnapshots[0].title,'Read book');
 assert.match(doc.getElementById('intention-label').textContent,/Read book/);
});

test('active session tasks override stale saved picker IDs on restoration',async()=>{
 const window=await boot('pt-BR',{sessionTaskIds:[],current:{status:'running',label:'Foco profundo',taskIds:['home'],taskSnapshots:[{id:'home',title:'Clean desk',tag:'Home'}]}}),doc=window.document;
 doc.getElementById('intention-label').click();
 const home=[...doc.querySelectorAll('#intention-task-list input')].find(input=>input.value==='home');
 assert.equal(home.checked,true);
 const saved=JSON.parse(window.localStorage.getItem('focapy-state-v2'));
 assert.deepEqual(saved.sessionTaskIds,['home']);
});
