import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('app boot registers primary interactions without throwing',async()=>{
  const dom=new JSDOM(html,{url:'http://localhost/'});
  const {window}=dom;
  for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
  Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('IndexedDB access is not required for boot')}},setInterval:()=>0,clearInterval:()=>{}});
  await import(`../src/app.js?boot=${Date.now()}`);
  const start=window.document.getElementById('start-button');
  const tasks=window.document.querySelector('[data-screen="tasks"]');
  assert.equal(typeof start.onclick,'function');
  assert.equal(typeof tasks.onclick,'function');
  tasks.click();
  assert.ok(window.document.getElementById('tasks').classList.contains('active'));
  start.click();
  assert.equal(start.textContent,'Pausar');
});
