import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {normalizeSessionTags, addSessionTag, updateSessionTagFontColor} from '../src/core.js';

const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const css=readFileSync(new URL('../src/app.css',import.meta.url),'utf8');

test('tags persist a separate font color with a safe default',()=>{
  const tags=normalizeSessionTags([{name:'Estudo',color:'#123456'}]);
  assert.equal(tags[0].color,'#123456');
  assert.equal(tags[0].fontColor,'#15382e');
  assert.equal(addSessionTag([], 'Casa', '#abcdef', '#ffffff')[0].fontColor,'#ffffff');
});

test('tag font color can be updated independently from the background',()=>{
  const tags=updateSessionTagFontColor([{name:'Estudo',color:'#123456',fontColor:'#000000'}],'Estudo','#ffffff');
  assert.deepEqual(tags,[{name:'Estudo',color:'#123456',fontColor:'#ffffff'}]);
});

test('both tag creation areas and the shared editor expose font color selection',()=>{
  assert.match(html,/id="new-tag-font-color"/);
  assert.match(html,/id="new-task-category-font-color"/);
  assert.match(app,/tag-font-color/);
  assert.match(app,/fontColor/);
});

test('tag font color is applied consistently to dashboard, task badges and statistics',()=>{
  assert.match(app,/category\.style\.color=fontColor/);
  assert.match(app,/badge\.style\.color=task\.tagFontColor/);
  assert.match(app,/category\.style\.color=series\?\.fontColor/);
});

test('session category management renders outlined category boxes with a colored active state',()=>{
  assert.match(app,/select\.className='tag-select-button tag-category-option'/);
  assert.match(app,/title\.style\.color=item\.fontColor/);
  assert.match(app,/select\.style\.background=state\.selectedTag===item\.name\?item\.color:'transparent'/);
  assert.match(app,/select\.setAttribute\('aria-pressed',String\(state\.selectedTag===item\.name\)\)/);
  assert.match(css,/\.tag-category-option\{[^}]*border:1px solid/);
  assert.match(css,/\.tag-category-option\[aria-pressed="true"\]\{[^}]*background/);
});
