import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createSession, progressFor, finishSession, dailyProgress, formatSeconds,
  phraseForElapsed, addPhrase, updatePhrase, VEGETATION, createInventory, awardVegetation,
  monthKey, rolloverMonthlyState, migrateLegacyInventory, advancePomoSession,
  COMPLETION_IMAGE_FILES, pickCompletionImage, mergeDefaultPhrases, nextSeasonCountdown,
  GOOD_MORNING_PHRASES, greetingForDay,
  DEFAULT_SESSION_CATEGORIES, mergeDefaultSessionCategories,
} from '../src/core.js';

test('new inspirational defaults are added without overwriting saved phrases', () => { const merged=mergeDefaultPhrases(['Minha frase'],['Minha frase','Respire, e sinta que chegou.','Tudo passa.']); assert.deepEqual(merged,['Minha frase','Respire, e sinta que chegou.','Tudo passa.']); });

test('completion picker includes every saved celebration image and supports random selection', () => { assert.equal(COMPLETION_IMAGE_FILES.length,51); assert.equal(new Set(COMPLETION_IMAGE_FILES).size,51); assert.equal(pickCompletionImage(()=>0),COMPLETION_IMAGE_FILES[0]); assert.equal(pickCompletionImage(()=>.999999),COMPLETION_IMAGE_FILES.at(-1)); });

test('a new focus session starts with requested duration', () => { const session=createSession({minutes:25,label:'Ler'}); assert.equal(session.totalSeconds,1500); assert.equal(session.elapsedSeconds,0); assert.equal(session.label,'Ler'); assert.equal(session.status,'ready'); });
test('session progress is clamped between zero and one', () => { assert.equal(progressFor({elapsedSeconds:0,totalSeconds:60}),0); assert.equal(progressFor({elapsedSeconds:30,totalSeconds:60}),.5); assert.equal(progressFor({elapsedSeconds:99,totalSeconds:60}),1); });
test('finishing a session awards focus minutes and grows the grove', () => { const completed=finishSession(createSession({minutes:25,label:'Estudar'})); assert.equal(completed.status,'completed'); assert.equal(completed.focusMinutes,25); assert.equal(completed.growthStage,'tree'); });
test('daily progress counts only completed sessions on selected day', () => { const sessions=[{status:'completed',completedAt:'2026-09-06T10:00:00.000Z',focusMinutes:25},{status:'completed',completedAt:'2026-09-06T14:00:00.000Z',focusMinutes:10},{status:'abandoned',completedAt:'2026-09-06T16:00:00.000Z',focusMinutes:30},{status:'completed',completedAt:'2026-09-05T10:00:00.000Z',focusMinutes:40}]; assert.deepEqual(dailyProgress(sessions,'2026-09-06',60),{focused:35,goal:60,percent:58}); });
test('seconds format into zero-padded mm:ss', () => { assert.equal(formatSeconds(1500),'25:00'); assert.equal(formatSeconds(65),'01:05'); });
test('morning greetings are developer-owned and stay separate from editable motivational phrases',()=>{
  assert.deepEqual(GOOD_MORNING_PHRASES,['Respire, e sinta que chegou.','Quanto tempo existe em cinco minutos de silêncio?','Tudo passa.']);
  assert.equal(greetingForDay(new Date(2026,8,6)),'Respire, e sinta que chegou.');
  assert.equal(greetingForDay(new Date(2026,8,7)),'Quanto tempo existe em cinco minutos de silêncio?');
});

test('phrases rotate every 35 seconds', () => { const phrases=['Comece pequeno.','Respire e continue.','Uma coisa por vez.']; assert.equal(phraseForElapsed(phrases,0),'Comece pequeno.'); assert.equal(phraseForElapsed(phrases,35),'Respire e continue.'); assert.equal(phraseForElapsed(phrases,105),'Comece pequeno.'); });
test('phrases can be added and edited immutably', () => { const initial=['Foque no próximo passo.']; const withNew=addPhrase(initial,'Você consegue.'); assert.deepEqual(withNew,['Foque no próximo passo.','Você consegue.']); assert.deepEqual(updatePhrase(withNew,1,'Siga com calma.'),['Foque no próximo passo.','Siga com calma.']); assert.deepEqual(initial,['Foque no próximo passo.']); });
test('the Focapy catalog contains twenty-eight distinct capybara-universe items', () => { const byName=new Map(VEGETATION.map(item=>[item.name,item])); assert.equal(VEGETATION.length,28); assert.equal(new Set(VEGETATION.map(item=>item.id)).size,28); assert.deepEqual([...byName.keys()].filter(name=>['Tangerina','Água termal','Meleca de nariz','Passarinho na testa'].includes(name)).length,4); assert.equal(byName.get('Tangerina').icon,'🍊'); assert.equal(byName.get('Água termal').icon,'♨️'); assert.equal(byName.get('Meleca de nariz').icon,'🤧'); assert.equal(byName.get('Passarinho na testa').icon,'🐦'); });
test('longer sessions award rarer vegetation and inventory has no cap', () => { let inventory=createInventory(); const short=awardVegetation(inventory,10,7); assert.equal(short.item.rarity,'comum'); const long=awardVegetation(short.inventory,120,7); assert.ok(['raro','lendário'].includes(long.item.rarity)); inventory=long.inventory; for(let index=0;index<100;index+=1) inventory=awardVegetation(inventory,25,index).inventory; assert.ok(Object.values(inventory).reduce((sum,count)=>sum+count,0)>=102); });
test('Pomodoro switches to pause after focus and rewards only after the final pause', () => { const session={pomoPhase:'focus',pomoCycle:1,pomoCycles:2,pomoFocusMinutes:1,pomoBreakMinutes:1,phaseTotalSeconds:60,phaseElapsedSeconds:59}; const afterFocus=advancePomoSession(session); assert.equal(afterFocus.completed,false); assert.equal(afterFocus.session.pomoPhase,'break'); assert.equal(afterFocus.session.pomoCycle,1); const afterFirstPause=advancePomoSession({...afterFocus.session,phaseElapsedSeconds:59}); assert.equal(afterFirstPause.completed,false); assert.equal(afterFirstPause.session.pomoPhase,'focus'); assert.equal(afterFirstPause.session.pomoCycle,2); const afterFinalFocus=advancePomoSession({...afterFirstPause.session,phaseElapsedSeconds:59}); assert.equal(afterFinalFocus.completed,false); assert.equal(afterFinalFocus.session.pomoPhase,'break'); const afterFinalPause=advancePomoSession({...afterFinalFocus.session,phaseElapsedSeconds:59}); assert.equal(afterFinalPause.completed,true); });
test('legacy plant inventory migrates to capybara items without losing quantities', () => { assert.deepEqual(migrateLegacyInventory({clover:3,redwood:1,tangerina:2}),{tangerina:5,'banho-chuva':1}); });
test('month rollover archives the previous landscape as Compromisso and starts a clean month', () => { const state={monthKey:'2026-08',inventory:{clover:3,redwood:1},sessions:[{id:'s1'}],commitments:[]}; const rolled=rolloverMonthlyState(state,'2026-09'); assert.equal(rolled.monthKey,'2026-09'); assert.deepEqual(rolled.inventory,{}); assert.equal(rolled.commitments.length,1); assert.equal(rolled.commitments[0].title,'Compromisso'); assert.equal(rolled.commitments[0].monthKey,'2026-08'); assert.deepEqual(rolled.commitments[0].inventory,{clover:3,redwood:1}); assert.equal(rolled.commitments[0].sessionsCount,1); });
test('same month does not archive or erase current plants', () => { const state={monthKey:'2026-09',inventory:{daisy:2},sessions:[],commitments:[]}; assert.deepEqual(rolloverMonthlyState(state,'2026-09'),state); });
test('default session categories preserve the six requested names and colors', () => {
  assert.deepEqual(DEFAULT_SESSION_CATEGORIES.map(({ name, color }) => ({ name, color })), [
    { name: 'Tarefas domésticas', color: '#8e44ad' },
    { name: 'Aula/reunião', color: '#e67e22' },
    { name: 'Profissional/obrigações', color: '#c0392b' },
    { name: 'Auto cuidado', color: '#e84393' },
    { name: 'Estudo', color: '#27ae60' },
    { name: 'Hobbies', color: '#2980b9' },
  ]);
});

test('default categories merge with existing custom categories without duplicates', () => {
  const merged = mergeDefaultSessionCategories([{ name: 'Estudo', color: '#111111' }, { name: 'Leitura', color: '#123456' }]);
  assert.equal(merged.length, 7);
  assert.equal(merged.find(tag => tag.name === 'Estudo').color, '#111111');
  assert.equal(merged.find(tag => tag.name === 'Leitura').color, '#123456');
});

test('next season countdown uses the following local month boundary', () => { assert.deepEqual(nextSeasonCountdown(new Date(2026,8,30,23,0,0)),{days:0,hours:1,minutes:0}); assert.deepEqual(nextSeasonCountdown(new Date(2026,11,31,23,59,0)),{days:0,hours:0,minutes:1}); });
