import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('Portuguese boot restores every primary screen heading after an English session',async()=>{
  const dom=new JSDOM(html,{url:'http://localhost/'});
  const {window}=dom;
  window.localStorage.setItem('focapy-state-v2',JSON.stringify({language:'pt-BR',languageChosen:true}));
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('IndexedDB access is not required for boot')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?portuguese=${Date.now()}`);
  const copy=selector=>window.document.querySelector(selector).textContent.trim();
  const select=window.document.getElementById('language-select');
  select.value='en';select.dispatchEvent(new window.Event('change'));
  select.value='pt-BR';select.dispatchEvent(new window.Event('change'));
  assert.equal(copy('#focus .eyebrow'),'SESSÃO DE HOJE');
  assert.equal(copy('#focus h1'),'Vivencie o seu tempo');
  assert.equal(copy('#grove .eyebrow'),'INVENTÁRIO');
  assert.equal(copy('#grove h1'),'O que você conquistou com seu foco');
  assert.equal(copy('#gardens .eyebrow'),'MEMÓRIA DA COLEÇÃO');
  assert.equal(copy('#gardens h1'),'Coleção');
  assert.equal(copy('#progress .eyebrow'),'RITMO');
  assert.equal(copy('#progress h1'),'Consistência, não pressão.');
});
