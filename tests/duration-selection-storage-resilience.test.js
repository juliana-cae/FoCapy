import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

async function boot(language){
  const dom=new JSDOM(html,{url:'http://localhost/'});
  const {window}=dom;
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  window.localStorage.setItem('focapy-state-v2',JSON.stringify({language,languageChosen:true}));
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('not needed')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?duration-resilience=${language}-${Date.now()}-${Math.random()}`);
  const storagePrototype=Object.getPrototypeOf(window.localStorage);
  const originalSetItem=storagePrototype.setItem;
  storagePrototype.setItem=()=>{throw new Error('storage unavailable')};
  return {window,restoreStorage(){storagePrototype.setItem=originalSetItem}};
}

test('duration choice updates immediately in Portuguese and English even when local persistence fails',async()=>{
  for(const language of ['pt-BR','en']){
    const {window,restoreStorage}=await boot(language);
    const duration=[...window.document.querySelectorAll('.duration')].find(button=>button.dataset.minutes==='45');
    duration.click();
    assert.equal(window.document.getElementById('time-display').textContent,'45:00',language);
    assert.ok(duration.classList.contains('selected'),language);
    restoreStorage();
  }
});
