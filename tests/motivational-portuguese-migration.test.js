import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');

test('Portuguese boot migrates only FoCapy motivational defaults saved in English',async()=>{
 const dom=new JSDOM(html,{url:'http://localhost/'}),{window}=dom;
 for(const dialog of window.document.querySelectorAll('dialog')){dialog.showModal=function(){this.open=true};dialog.close=function(){this.open=false}}
 window.localStorage.setItem('focapy-state-v2',JSON.stringify({language:'pt-BR',languageChosen:true,phrases:['Start small. The important thing is to start.','Breathe. One thing at a time.','Protect your attention like a garden.','Keep my personal phrase']}));
 Object.assign(globalThis,{window,document:window.document,localStorage:window.localStorage,HTMLElement:window.HTMLElement,Event:window.Event,Node:window.Node,Option:window.Option,Audio:class{addEventListener(){} play(){return Promise.resolve()} pause(){}},indexedDB:{open(){throw new Error('not needed')}},setInterval:()=>0,clearInterval:()=>{}});
 await import(`../src/app.js?motivational-pt=${Date.now()}-${Math.random()}`);
 const phrases=[...window.document.querySelectorAll('#phrases-list .phrase-edit')].map(node=>node.textContent);
 assert.deepEqual(phrases,['“Comece pequeno. O importante é começar.”','“Respire. Uma coisa por vez.”','“Proteja sua atenção como um jardim.”','“Keep my personal phrase”']);
 assert.deepEqual(JSON.parse(window.localStorage.getItem('focapy-state-v2')).phrases,['Comece pequeno. O importante é começar.','Respire. Uma coisa por vez.','Proteja sua atenção como um jardim.','Keep my personal phrase']);
});
