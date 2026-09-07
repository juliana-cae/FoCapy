export const GOOD_MORNING_PHRASES=['Respire, e sinta que chegou.','Quanto tempo existe em cinco minutos de silêncio?','Tudo passa.'];
export function greetingForDay(date = new Date()) { const current=date instanceof Date?date:new Date(date); return GOOD_MORNING_PHRASES[current.getDate()%GOOD_MORNING_PHRASES.length]; }

export function mergeDefaultPhrases(saved=[],defaults=[]){return [...new Set([...(Array.isArray(saved)?saved:[]),...defaults])];}

export const COMPLETION_IMAGE_FILES=['completion-capybara.jpg','completion-chubby-smile.jpg','completion-gentle-portrait.jpg','completion-wink.jpg','completion-proud.jpg','completion-toothy-smile.jpg','completion-cuddles.jpg','completion-pair.jpg','completion-cake.jpg','completion-pink.jpg','completion-greenhouse.jpg','completion-leaf.jpg','completion-thumbs-up.jpg','completion-dont-worry.jpg','completion-beach.jpg','completion-grass.jpg','completion-pool.jpg','completion-eating.jpg','completion-grass-chew.jpg','completion-call.jpg','completion-appreciation.jpg','completion-sunset.jpg','completion-watermelon.jpg','completion-beach-peace.jpg','completion-monkeys.jpg','completion-pink-glasses.jpg','completion-family-swim.jpg','completion-grass-straw.jpg','completion-open-mouth.jpg','completion-pale-yawn.jpg','completion-fence-yawn.jpg','completion-small-yawn.jpg','completion-closeup.jpg','completion-feeding.jpg','completion-rider.jpg','completion-water-side.jpg','completion-pink-cup.jpg','completion-flowers.jpg','completion-basin.jpg','completion-resting.jpg','completion-family.jpg','completion-underwater.jpg','completion-water-portrait.jpg','completion-seaside-drink.jpg','completion-lake-snack.jpg','completion-pair-mud.jpg','completion-pair-rest.jpg','completion-bird.jpg','completion-cat-cuddle.jpg','completion-sunset-lake.jpg','completion-pink-heart-glasses.jpg'];
export const FOCUS_SESSION_IMAGE_FILES=['completion-pool.jpg','completion-eating.jpg','completion-grass-chew.jpg','completion-call.jpg'];
export function pickCompletionImage(random=Math.random){return COMPLETION_IMAGE_FILES[Math.min(COMPLETION_IMAGE_FILES.length-1,Math.floor(random()*COMPLETION_IMAGE_FILES.length))]}
export function completionToneForMinutes(minutes){const value=Math.max(1,Number(minutes)||25);return value>=60?'gongo-3':value>=45?'gongo-2':'gongo-1'}

export const VEGETATION = [
  { id:'tangerina',name:'Tangerina',icon:'🍊',rarity:'comum',minMinutes:1 }, { id:'meleca-nariz',name:'Meleca de nariz',icon:'🤧',rarity:'comum',minMinutes:1 }, { id:'flor-de-lotus',name:'Flor de lótus',icon:'🪷',rarity:'comum',minMinutes:1 }, { id:'folha-mastigada',name:'Folha mastigada',icon:'🍃',rarity:'comum',minMinutes:5 }, { id:'milho-cozido',name:'Milho cozido',icon:'🌽',rarity:'comum',minMinutes:10 }, { id:'banho-lama',name:'Banho de lama',icon:'🟤',rarity:'comum',minMinutes:15 },
  { id:'boia-patinho',name:'Boia de patinho',icon:'🦆',rarity:'incomum',minMinutes:20 }, { id:'varinha-magica',name:'Varinha mágica',icon:'🪄',rarity:'incomum',minMinutes:20 }, { id:'toalha-quentinha',name:'Toalha quentinha',icon:'🧺',rarity:'incomum',minMinutes:25 }, { id:'chapeu-sol',name:'Chapéu de sol',icon:'👒',rarity:'incomum',minMinutes:25 }, { id:'raminho-hortela',name:'Raminho de hortelã',icon:'🌿',rarity:'incomum',minMinutes:30 }, { id:'biscoito-capivara',name:'Biscoito de capivara',icon:'🍪',rarity:'incomum',minMinutes:35 },
  { id:'agua-termal',name:'Água termal',icon:'♨️',rarity:'raro',minMinutes:40 }, { id:'passarinho-testa',name:'Passarinho na testa',icon:'🐦',rarity:'raro',minMinutes:45 }, { id:'punzinho',name:'Punzinho',icon:'💨',rarity:'raro',minMinutes:45 }, { id:'lacinho-brega',name:'Lacinho brega',icon:'🎀',rarity:'raro',minMinutes:45 }, { id:'melancia-gelada',name:'Melancia gelada',icon:'🍉',rarity:'raro',minMinutes:50 }, { id:'rede-descanso',name:'Rede de descanso',icon:'🪢',rarity:'raro',minMinutes:60 }, { id:'poca-lama',name:'Poça de lama brilhante',icon:'💧',rarity:'raro',minMinutes:75 },
  { id:'banho-chuva',name:'Banho de chuva',icon:'🌧️',rarity:'lendário',minMinutes:90 }, { id:'xixi-vencido',name:'Xixi vencido',icon:'🧪',rarity:'lendário',minMinutes:90 }, { id:'peideta',name:'Peideta',icon:'😜',rarity:'lendário',minMinutes:90 }, { id:'piscina-lama',name:'Piscina de lama',icon:'🏝️',rarity:'lendário',minMinutes:100 }, { id:'coroa-folhas',name:'Coroa de folhas',icon:'👑',rarity:'lendário',minMinutes:120 }, { id:'banquete-frutas',name:'Banquete de frutas',icon:'🍓',rarity:'lendário',minMinutes:150 }, { id:'trono-pedra',name:'Trono de pedra',icon:'🪨',rarity:'lendário',minMinutes:180 },
  { id:'maestre-cabriola',name:'Maestre da Cabriola',icon:'🏆',rarity:'suprema',minMinutes:180 },
  { id:'palmeira-amaldicoada',name:'Palmeira',icon:'🌴',rarity:'amaldiçoado',minMinutes:1 },
];

export function createSession({ minutes, seconds, label = 'Foco' }) {
  const explicitSeconds = Number(seconds);
  const safeSeconds = Number.isFinite(explicitSeconds) && explicitSeconds > 0 ? Math.round(explicitSeconds) : Math.max(1, Math.round(Number(minutes) || 25)) * 60;
  return { id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`, label: String(label).trim() || 'Foco', totalSeconds: safeSeconds, elapsedSeconds: 0, status: 'ready', focusMinutes: 0, growthStage: 'seed', createdAt: new Date().toISOString() };
}
export function createStopwatchSession({ label = 'Cronômetro' } = {}) {
  return { id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`, label: String(label).trim() || 'Cronômetro', totalSeconds: 0, elapsedSeconds: 0, status: 'ready', focusMinutes: 0, growthStage: 'seed', isStopwatch: true, createdAt: new Date().toISOString() };
}
export function progressFor({ elapsedSeconds, totalSeconds }) { return !totalSeconds ? 0 : Math.max(0, Math.min(1, elapsedSeconds / totalSeconds)); }
export function finishSession(session, completedAt = new Date().toISOString()) {
  const measuredSeconds = session.isStopwatch ? Math.max(0, Number(session.elapsedSeconds) || 0) : session.totalSeconds;
  const focusMinutes = Math.max(1, Math.round(measuredSeconds / 60));
  return { ...session, totalSeconds: measuredSeconds, elapsedSeconds: measuredSeconds, status: 'completed', focusMinutes, growthStage: focusMinutes >= 45 ? 'oak' : focusMinutes >= 25 ? 'tree' : 'sprout', completedAt };
}
export function dailyProgress(sessions, day, goal) {
  const focused = sessions.filter((s) => s.status === 'completed' && s.completedAt?.slice(0, 10) === day).reduce((sum, s) => sum + (s.focusMinutes || 0), 0);
  const safeGoal = Math.max(1, Number(goal) || 60);
  return { focused, goal: safeGoal, percent: Math.min(100, Math.round((focused / safeGoal) * 100)) };
}
export function formatSeconds(seconds) { const safe = Math.max(0, Math.floor(Number(seconds) || 0)); return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`; }
export function phraseForElapsed(phrases, elapsedSeconds, intervalSeconds = 35) { const valid = Array.isArray(phrases) ? phrases.filter(Boolean) : []; return valid.length ? valid[Math.floor(Math.max(0, elapsedSeconds) / intervalSeconds) % valid.length] : 'Um passo de cada vez.'; }
export function addPhrase(phrases, phrase) { const value = String(phrase || '').trim(); return value ? [...phrases, value] : [...phrases]; }
export function updatePhrase(phrases, index, phrase) { const value = String(phrase || '').trim(); return !value || index < 0 || index >= phrases.length ? [...phrases] : phrases.map((item, i) => i === index ? value : item); }
export function nextSeasonCountdown(now = new Date()) {
  const current = now instanceof Date ? now : new Date(now);
  const next = new Date(current.getFullYear(), current.getMonth() + 1, 1, 0, 0, 0, 0);
  const remainingMinutes = Math.max(0, Math.floor((next.getTime() - current.getTime()) / 60000));
  return { days: Math.floor(remainingMinutes / 1440), hours: Math.floor((remainingMinutes % 1440) / 60), minutes: remainingMinutes % 60 };
}
export function monthKey(date = new Date()) {
  const value = date instanceof Date ? date : new Date(date);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}`;
}
export function rolloverMonthlyState(state, currentMonth) {
  if (!state?.monthKey || state.monthKey === currentMonth) return state;
  const commitments = Array.isArray(state.commitments) ? state.commitments : [];
  const archived = { title: 'Compromisso', monthKey: state.monthKey, inventory: { ...(state.inventory || {}) }, sessionsCount: Array.isArray(state.sessions) ? state.sessions.length : 0, archivedAt: new Date().toISOString() };
  return { ...state, monthKey: currentMonth, inventory: {}, sessions: [], commitments: [...commitments, archived] };
}

export function createInventory() { return {}; }
export function migrateLegacyInventory(inventory = {}) {
  const legacyIds = { clover:'tangerina', grass:'meleca-nariz', daisy:'folha-mastigada', fern:'milho-cozido', moss:'banho-lama', lavender:'boia-patinho', sunflower:'toalha-quentinha', bamboo:'chapeu-sol', cattail:'raminho-hortela', lily:'biscoito-capivara', pine:'agua-termal', maple:'passarinho-testa', willow:'melancia-gelada', cherry:'rede-descanso', moonflower:'poca-lama', redwood:'banho-chuva', rainbow:'piscina-lama', crystal:'coroa-folhas', stardust:'banquete-frutas', ancient:'trono-pedra' };
  return Object.entries(inventory).reduce((next,[id,count])=>{const quantity=Number(count)||0;if(quantity>0){const target=legacyIds[id]||id;next[target]=(next[target]||0)+quantity}return next},{});
}
export function advancePomoSession(session) {
  const current = { ...session, phaseElapsedSeconds: (Number(session.phaseElapsedSeconds) || 0) + 1 };
  if (current.phaseElapsedSeconds < current.phaseTotalSeconds) return { session: current, completed: false, transition: null };
  const startFocus = (cycle) => ({ ...current, pomoPhase: 'focus', pomoCycle: cycle, phaseElapsedSeconds: 0, phaseTotalSeconds: current.pomoFocusMinutes * 60 });
  if (current.pomoPhase === 'focus' && current.pomoBreakMinutes > 0) return { session: { ...current, pomoPhase: 'break', phaseElapsedSeconds: 0, phaseTotalSeconds: current.pomoBreakMinutes * 60 }, completed: false, transition: 'rest-start' };
  if (current.pomoCycle < current.pomoCycles) return { session: startFocus(current.pomoCycle + 1), completed: false, transition: current.pomoPhase === 'break' ? 'rest-end' : null };
  return { session: current, completed: true, transition: current.pomoPhase === 'break' ? 'rest-end' : null };
}
function rewardRoll(source = Math.random) {
  const raw=typeof source==='function'?source():source;
  const value=Number(raw);
  if (!Number.isFinite(value)) return Math.random();
  return value>=0&&value<1 ? value : Math.abs(Math.sin(value*12.9898)*43758.5453)%1;
}
function rewardRarityForEffort(minutes, roll) {
  if (minutes < 20) return 'comum';
  if (minutes < 45) return roll < .65 ? 'comum' : 'incomum';
  if (minutes < 60) return roll < .60 ? 'incomum' : 'raro';
  if (minutes < 90) return 'raro';
  if (minutes >= 180 && roll >= .95) return 'suprema';
  const legendaryChance=Math.min(.70,.20+((minutes-90)/90)*.50);
  return roll < 1-legendaryChance ? 'raro' : 'lendário';
}
function rewardRolls(source = Math.random) {
  if (Array.isArray(source)) return [rewardRoll(source[0]), rewardRoll(source[1] ?? source[0])];
  if (typeof source === 'function') return [rewardRoll(source), rewardRoll(source)];
  return [1, rewardRoll(source)];
}
export function awardVegetation(inventory = {}, focusMinutes, random = Math.random) {
  const minutes = Math.max(1, Number(focusMinutes) || 1);
  const [cursedRoll, roll] = rewardRolls(random);
  const cursed = VEGETATION.find(item => item.rarity === 'amaldiçoado');
  if (cursed && cursedRoll < .005) return { item: cursed, inventory: { ...inventory, [cursed.id]: (inventory[cursed.id] || 0) + 1 } };
  const rarity=rewardRarityForEffort(minutes,roll);
  const pool=VEGETATION.filter(item=>item.rarity===rarity&&item.minMinutes<=minutes);
  const eligible=pool.length?pool:VEGETATION.filter(item=>item.minMinutes<=minutes);
  const item=eligible[Math.min(eligible.length-1,Math.floor(((roll*.61803398875+.5)%1)*eligible.length))]||VEGETATION[0];
  return { item, inventory: { ...inventory, [item.id]: (inventory[item.id] || 0) + 1 } };
}

export const DEFAULT_SESSION_CATEGORIES = [
  { name: 'Tarefas domésticas', color: '#8e44ad', fontColor: '#ffffff' },
  { name: 'Aula/reunião', color: '#e67e22', fontColor: '#15382e' },
  { name: 'Profissional/obrigações', color: '#c0392b', fontColor: '#ffffff' },
  { name: 'Auto cuidado', color: '#e84393', fontColor: '#ffffff' },
  { name: 'Estudo', color: '#27ae60', fontColor: '#ffffff' },
  { name: 'Hobbies', color: '#2980b9', fontColor: '#ffffff' },
];

export function mergeDefaultSessionCategories(tags = []) {
  const existing = normalizeSessionTags(tags);
  const defaults = DEFAULT_SESSION_CATEGORIES.map(tag => ({ ...tag }));
  const mergedDefaults = defaults.map(defaultTag => existing.find(tag => tag.name.toLocaleLowerCase() === defaultTag.name.toLocaleLowerCase()) || defaultTag);
  return [...mergedDefaults, ...existing.filter(tag => !defaults.some(defaultTag => defaultTag.name.toLocaleLowerCase() === tag.name.toLocaleLowerCase()))];
}

export const DEFAULT_TAG_COLOR = '#2d6c4d';
export const DEFAULT_TAG_FONT_COLOR = '#15382e';
function normalizeTagColor(color, fallback = DEFAULT_TAG_COLOR) { return /^#[0-9a-f]{6}$/i.test(String(color || '')) ? String(color).toLowerCase() : fallback; }
export function hexToRgb(hex = DEFAULT_TAG_COLOR) { const normalized = normalizeTagColor(hex); return { r: parseInt(normalized.slice(1, 3), 16), g: parseInt(normalized.slice(3, 5), 16), b: parseInt(normalized.slice(5, 7), 16) }; }
export function rgbToHex(r = 0, g = 0, b = 0) { return `#${[r, g, b].map(value => Math.max(0, Math.min(255, Math.round(Number(value) || 0))).toString(16).padStart(2, '0')).join('').toUpperCase()}`; }
export function rgbToCmyk(r = 0, g = 0, b = 0) { const [red, green, blue] = [r, g, b].map(value => Math.max(0, Math.min(255, Number(value) || 0)) / 255); const k = 1 - Math.max(red, green, blue); if (k === 1) return { c: 0, m: 0, y: 0, k: 100 }; return { c: Math.round((1 - red - k) / (1 - k) * 100), m: Math.round((1 - green - k) / (1 - k) * 100), y: Math.round((1 - blue - k) / (1 - k) * 100), k: Math.round(k * 100) }; }
export function normalizeTasks(tasks = []) { const normalized=(Array.isArray(tasks)?tasks:[]).reduce((result,task,index)=>{const title=String(task?.title??task??'').trim().replace(/\s+/g,' ').slice(0,100);if(!title)return result;const item={id:String(task?.id||`task-${index+1}`),title,done:Boolean(task?.done),...(task?.completedAt?{completedAt:String(task.completedAt)}:{})};if(String(task?.tag||'').trim()){item.tag=String(task.tag).trim().slice(0,32);item.tagColor=normalizeTagColor(task?.tagColor);item.tagFontColor=normalizeTagColor(task?.tagFontColor,DEFAULT_TAG_FONT_COLOR)}if(task?.categoryId)item.categoryId=String(task.categoryId);if(task?.parentTaskId)item.parentTaskId=String(task.parentTaskId);if(Number.isFinite(Number(task?.order)))item.order=Number(task.order);if(['low','normal','high','urgent'].includes(task?.priority))item.priority=task.priority;result.push(item);return result},[]);const ids=new Set(normalized.map(task=>task.id));return normalized.map(task=>{let parentId=task.parentTaskId,seen=new Set([task.id]);while(parentId&&ids.has(parentId)&&!seen.has(parentId)){seen.add(parentId);parentId=normalized.find(item=>item.id===parentId)?.parentTaskId}return task.parentTaskId&&ids.has(task.parentTaskId)&&!seen.has(parentId)?task:{...task,parentTaskId:undefined}}).map(({parentTaskId,...task})=>parentTaskId?{...task,parentTaskId}:task); }
export function addTask(tasks = [], title = '', tag = '', tagColor = DEFAULT_TAG_COLOR, tagFontColor = DEFAULT_TAG_FONT_COLOR, priority = DEFAULT_TASK_PRIORITY, categoryId = '', parentTaskId = '') { const normalized = normalizeTasks(tasks); return normalizeTasks([...normalized, { id: `task-${Date.now()}-${normalized.length + 1}`, title, tag, tagColor, tagFontColor, priority, categoryId, parentTaskId, order: normalized.length, done: false }]); }
export function sessionCategoryForTask(task = {}) {
  const tag = String(task?.tag || '').trim();
  if (!tag) return { tag: '', tagColor: '', tagFontColor: '' };
  return { tag, tagColor: normalizeTagColor(task?.tagColor), tagFontColor: normalizeTagColor(task?.tagFontColor, DEFAULT_TAG_FONT_COLOR) };
}

export function taskIdsForSession(tasks = [], ids = []) { const known = new Set(normalizeTasks(tasks).map(task => task.id)); return [...new Set((Array.isArray(ids) ? ids : []).map(String))].filter(id => known.has(id)); }
export function taskSnapshotsForSession(tasks=[],ids=[]){const selected=new Set(taskIdsForSession(tasks,ids));return normalizeTasks(tasks).filter(task=>selected.has(task.id)).map(({id,title,tag,tagColor,tagFontColor})=>({id,title,tag,tagColor,tagFontColor}));}
export function sessionTaskAssociation(tasks=[],ids=[]){const taskIds=taskIdsForSession(tasks,ids);return {taskIds,taskSnapshots:taskSnapshotsForSession(tasks,taskIds)};}
export function removeTaskFromCompletedSessions(sessions=[],taskId=''){const id=String(taskId);return (Array.isArray(sessions)?sessions:[]).map(session=>{const originalIds=Array.isArray(session?.taskIds)?session.taskIds.map(String):[];const originalSnapshots=Array.isArray(session?.taskSnapshots)?session.taskSnapshots:[];const taskIds=originalIds.filter(item=>item!==id);const taskSnapshots=originalSnapshots.filter(item=>String(item?.id)!==id);const hadAssociation=originalIds.includes(id)||originalSnapshots.some(item=>String(item?.id)===id);const shouldExclude=session?.status==='completed'&&hadAssociation&&!taskIds.length&&!taskSnapshots.length;return {...session,taskIds,taskSnapshots,...(shouldExclude||session?.statisticsExcluded?{statisticsExcluded:true}:{})};});}
export function taskHistoryForFilter(sessions=[],taskId='',tag=''){const key=String(taskId||''),category=String(tag||'');return (Array.isArray(sessions)?sessions:[]).filter(session=>session?.status==='completed'&&Array.isArray(session.taskSnapshots)&&(!key||session.taskSnapshots.some(task=>task.id===key))&&(!category||session.tag===category||session.taskSnapshots.some(task=>task.tag===category)));}
export function completeTasksForSession(tasks = [], ids = []) { const selected=new Set(taskIdsForSession(tasks,ids)); return normalizeTasks(tasks).map(task=>selected.has(task.id)?{...task,done:true,completedAt:new Date().toISOString()}:task); }
export function normalizeSessionTags(tags = []) {
  const seen = new Set();
  return (Array.isArray(tags) ? tags : []).reduce((result, tag) => {
    const name = String(typeof tag === 'object' && tag ? tag.name : tag || '').trim().slice(0, 32);
    const key = name.toLocaleLowerCase();
    if (name && !seen.has(key)) { seen.add(key); result.push({ name, color: normalizeTagColor(tag?.color), fontColor: normalizeTagColor(tag?.fontColor, DEFAULT_TAG_FONT_COLOR) }); }
    return result;
  }, []);
}
export function addSessionTag(tags = [], name = '', color = DEFAULT_TAG_COLOR, fontColor = DEFAULT_TAG_FONT_COLOR) { return normalizeSessionTags([...normalizeSessionTags(tags), { name, color, fontColor }]); }
export function updateSessionTagColor(tags = [], name = '', color = DEFAULT_TAG_COLOR) {
  const key = String(name || '').trim().toLocaleLowerCase();
  return normalizeSessionTags(tags).map(tag => tag.name.toLocaleLowerCase() === key ? { ...tag, color: normalizeTagColor(color) } : tag);
}
export function updateSessionTagFontColor(tags = [], name = '', fontColor = DEFAULT_TAG_FONT_COLOR) { const key = String(name || '').trim().toLocaleLowerCase(); return normalizeSessionTags(tags).map(tag => tag.name.toLocaleLowerCase() === key ? { ...tag, fontColor: normalizeTagColor(fontColor, DEFAULT_TAG_FONT_COLOR) } : tag); }
export function renameSessionTag(tags = [], name = '', nextName = '') {
  const normalized = normalizeSessionTags(tags); const key = String(name || '').trim().toLocaleLowerCase();
  const replacement = String(nextName || '').trim().slice(0, 32); const replacementKey = replacement.toLocaleLowerCase();
  if (!key || !replacement || !normalized.some(tag => tag.name.toLocaleLowerCase() === key) || normalized.some(tag => tag.name.toLocaleLowerCase() === replacementKey && tag.name.toLocaleLowerCase() !== key)) return normalized;
  return normalized.map(tag => tag.name.toLocaleLowerCase() === key ? { ...tag, name: replacement } : tag);
}
export function clearDeletedSessionTagReferences(current = null, deletedName = '') {
  const key = String(deletedName || '').trim().toLocaleLowerCase();
  const active = current && typeof current === 'object' ? { ...current } : current;
  if (!key || !active || String(active.tag || '').trim().toLocaleLowerCase() !== key) return { current: active, selectedTag: undefined };
  return { current: { ...active, tag: '', tagColor: '', tagFontColor: '' }, selectedTag: '' };
}

export function removeSessionTag(tags = [], name = '') {
  const key = String(name || '').trim().toLocaleLowerCase();
  return normalizeSessionTags(tags).filter(tag => tag.name.toLocaleLowerCase() !== key);
}
function isoDay(date) { return date.toISOString().slice(0, 10); }
function weekStart(date) { const copy = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())); const day = (copy.getUTCDay() + 6) % 7; copy.setUTCDate(copy.getUTCDate() - day); return copy; }
function shiftDays(date, days) { const copy = new Date(date); copy.setUTCDate(copy.getUTCDate() + days); return copy; }
function seriesDefinition(period, now) {
  const current = now instanceof Date ? now : new Date(now);
  if (period === 'weekly') { const end = weekStart(current); return Array.from({ length: 8 }, (_, i) => { const date = shiftDays(end, (i - 7) * 7); return { key: isoDay(date), label: `Sem. ${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`, match: value => isoDay(weekStart(value)) === isoDay(date) }; }); }
  if (period === 'monthly') { return Array.from({ length: 12 }, (_, i) => { const date = new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth() - 11 + i, 1)); const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`; return { key, label: date.toLocaleDateString('pt-BR', { month: 'short', timeZone: 'UTC' }).replace('.', ''), match: value => `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, '0')}` === key }; }); }
  if (period === 'annual') { return Array.from({ length: 5 }, (_, i) => { const year = current.getUTCFullYear() - 4 + i; return { key: String(year), label: String(year), match: value => value.getUTCFullYear() === year }; }); }
  return Array.from({ length: 7 }, (_, i) => { const date = shiftDays(new Date(Date.UTC(current.getUTCFullYear(), current.getUTCMonth(), current.getUTCDate())), i - 6); const key = isoDay(date); return { key, label: date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' }).replace('.', ''), match: value => isoDay(value) === key }; });
}
export function statisticsForPeriod(sessions = [], period = 'daily', now = new Date()) {
  const definition=seriesDefinition(period,now),series=definition.map(entry=>({key:entry.key,label:entry.label,minutes:0})),tagMap=new Map();let totalMinutes=0,totalSessions=0;
  (Array.isArray(sessions)?sessions:[]).filter(session=>session?.status==='completed'&&!session.statisticsExcluded&&session.completedAt).forEach(session=>{const date=new Date(session.completedAt);if(Number.isNaN(date.getTime()))return;const index=definition.findIndex(entry=>entry.match(date));if(index<0)return;const minutes=Math.max(0,Number(session.focusMinutes)||0),tag=String(session.tag||'Sem tag').trim()||'Sem tag',color=normalizeTagColor(session.tagColor),fontColor=normalizeTagColor(session.tagFontColor,DEFAULT_TAG_FONT_COLOR);series[index].minutes+=minutes;totalMinutes+=minutes;totalSessions+=1;const current=tagMap.get(tag)||{tag,color,fontColor,minutes:0,sessions:0,points:Array(definition.length).fill(0)};current.minutes+=minutes;current.sessions+=1;current.points[index]+=minutes;tagMap.set(tag,current)});
  const tags=[...tagMap.values()].sort((a,b)=>b.minutes-a.minutes||a.tag.localeCompare(b.tag,'pt-BR'));
  const categories=tags.map(({tag,color,fontColor,points})=>({tag,color,fontColor,points}));
  return {period,series,totalMinutes,totalSessions,tags:tags.map(({tag,minutes,sessions})=>({tag,minutes,sessions})),categorySeries:categories};
}

export function taskStatisticsForPeriod(tasks = [], period = 'daily', now = new Date()) {
  const definition=seriesDefinition(period,now),priorities=['urgent','high','normal','low'].map(priority=>({priority,completed:0,open:0})),priorityMap=new Map(priorities.map(item=>[item.priority,item])),categoryMap=new Map();let completedTotal=0,openTotal=0,subtasksTotal=0,subtasksDone=0;
  normalizeTasks(tasks).forEach(task=>{const priority=priorityMap.get(task.priority)||priorityMap.get(DEFAULT_TASK_PRIORITY),categoryKey=String(task.categoryId||task.tag||'uncategorized'),categoryName=String(task.tag||'Sem categoria'),category=categoryMap.get(categoryKey)||{key:categoryKey,name:categoryName,completed:0,open:0};if(task.parentTaskId){subtasksTotal+=1;if(task.done)subtasksDone+=1}if(!task.done){openTotal+=1;priority.open+=1;category.open+=1;categoryMap.set(categoryKey,category);return}const completedAt=new Date(task.completedAt||'');if(Number.isNaN(completedAt.getTime())||!definition.some(entry=>entry.match(completedAt)))return;completedTotal+=1;priority.completed+=1;category.completed+=1;categoryMap.set(categoryKey,category)});
  return {period,completedTotal,openTotal,subtasksTotal,subtasksDone,priorities,categories:[...categoryMap.values()].filter(item=>item.completed||item.open).sort((a,b)=>b.completed-a.completed||b.open-a.open||a.name.localeCompare(b.name,'pt-BR'))};
}

export const TASK_PRIORITIES = { urgent: { label: 'Urgente e importante', color: '#e74c3c' }, high: { label: 'Não urgente e importante', color: '#f39c12' }, normal: { label: 'Urgente e não importante', color: '#3498db' }, low: { label: 'Não urgente e não importante', color: '#d9f7be' } };
export const DEFAULT_TASK_PRIORITY = 'normal';
export function normalizeCategoryTree(tags = []) { const source=Array.isArray(tags)?tags:[], names=new Set(), ids=new Set(); const raw=source.map((tag,index)=>{const name=String(typeof tag==='object'&&tag?tag.name:tag||'').trim().slice(0,32),key=name.toLocaleLowerCase();if(!name||names.has(key))return null;names.add(key);let id=String(tag?.id||('category-'+(index+1))).trim()||('category-'+(index+1));while(ids.has(id))id=id+'-'+(index+1);ids.add(id);return {...normalizeSessionTags([tag])[0],id,parentId:String(tag?.parentId||''),order:Number.isFinite(Number(tag?.order))?Number(tag.order):index}}).filter(Boolean);const valid=new Set(raw.map(tag=>tag.id));raw.forEach(tag=>{if(!valid.has(tag.parentId)||tag.parentId===tag.id)tag.parentId=''});const children=new Map();raw.forEach(tag=>{const list=children.get(tag.parentId)||[];list.push(tag);children.set(tag.parentId,list)});const ordered=[],visit=parent=>{(children.get(parent)||[]).sort((a,b)=>a.order-b.order||a.name.localeCompare(b.name,'pt-BR')).forEach(tag=>{ordered.push(tag);visit(tag.id)})};visit('');raw.filter(tag=>!ordered.includes(tag)).forEach(tag=>ordered.push(tag));return ordered.map((tag,order)=>({...tag,order})) }
export function categoryOptions(tags = []) { const normalized=normalizeCategoryTree(tags),byId=new Map(normalized.map(tag=>[tag.id,tag]));return normalized.map(tag=>{let depth=0,parent=tag;while(parent.parentId&&depth<20){depth++;parent=byId.get(parent.parentId)||{parentId:''}}return {...tag,depth}}) }
export function reorderCategories(tags = [], id = '', direction = 0) { const normalized=normalizeCategoryTree(tags),index=normalized.findIndex(tag=>tag.id===String(id));if(index<0||!direction)return normalized;const siblings=normalized.filter(tag=>tag.parentId===normalized[index].parentId),si=siblings.findIndex(tag=>tag.id===normalized[index].id),target=siblings[si+Number(direction)];if(!target)return normalized;const ti=normalized.findIndex(tag=>tag.id===target.id);[normalized[index].order,normalized[ti].order]=[normalized[ti].order,normalized[index].order];return normalizeCategoryTree(normalized) }
export function reorderTasks(tasks = [], id = '', direction = 0) { const normalized=normalizeTasks(tasks),index=normalized.findIndex(task=>task.id===String(id)),target=index+Number(direction);if(index<0||target<0||target>=normalized.length)return normalized;[normalized[index],normalized[target]]=[normalized[target],normalized[index]];return normalized.map((task,order)=>({...task,order})) }
function orderedTreeMove(items, draggedId, targetId, placement, parentKey, normalize) { const ordered=normalize(items), dragged=ordered.find(item=>item.id===String(draggedId)), target=ordered.find(item=>item.id===String(targetId)); if (!dragged || !target || dragged.id===target.id || !['before','after','inside'].includes(placement)) return ordered; const isDescendant=id=>{let current=ordered.find(item=>item.id===id);const seen=new Set();while(current?.[parentKey]&&!seen.has(current.id)){if(current[parentKey]===dragged.id)return true;seen.add(current.id);current=ordered.find(item=>item.id===current[parentKey]);}return false}; if(isDescendant(target.id))return ordered; const blockIds=new Set(ordered.filter(item=>item.id===dragged.id||isDescendant(item.id)).map(item=>item.id)); const remaining=ordered.filter(item=>!blockIds.has(item.id)); const targetIndex=remaining.findIndex(item=>item.id===target.id); if(targetIndex<0)return ordered; const targetSubtreeEnd=(()=>{let index=targetIndex+1;while(index<remaining.length&&(()=>{let current=remaining[index],seen=new Set();while(current?.[parentKey]&&!seen.has(current.id)){if(current[parentKey]===target.id)return true;seen.add(current.id);current=remaining.find(item=>item.id===current[parentKey]);}return false})())index+=1;return index})(); const nextParent=placement==='inside'?target.id:(target[parentKey]||''); const block=ordered.filter(item=>blockIds.has(item.id)).map(item=>item.id===dragged.id?{...item,[parentKey]:nextParent}:item); const insertAt=placement==='before'?targetIndex:placement==='after'?targetSubtreeEnd:targetSubtreeEnd; const moved=[...remaining.slice(0,insertAt),...block,...remaining.slice(insertAt)].map((item,order)=>({...item,order})); return normalize(moved); }
export function moveCategory(tags = [], draggedId = '', targetId = '', placement = 'before') { return orderedTreeMove(tags,draggedId,targetId,placement,'parentId',normalizeCategoryTree); }
export function moveTask(tasks = [], draggedId = '', targetId = '', placement = 'before') { return orderedTreeMove(tasks,draggedId,targetId,placement,'parentTaskId',normalizeTasks); }
