import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const app=readFileSync(new URL('../src/app.js',import.meta.url),'utf8');

test('English mode has a comprehensive static and dynamic UI translation layer',()=>{
 assert.match(app,/const STATIC_UI_EN=/);
 assert.match(app,/function translateStaticUI\(/);
 for(const phrase of ['Lista de tarefas','Escolha o ritmo','Criar tarefa agora','PREFERÊNCIAS','Som de conclusão','Nenhuma tarefa criada ainda.']) assert.match(app,new RegExp(`['\"]${phrase.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}['\"]`));
 assert.match(app,/translateStaticUI\(\)/);
});
