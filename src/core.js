export const VEGETATION = [
  { id: 'clover', name: 'Trevo-luz', icon: '☘', rarity: 'comum', minMinutes: 1 },
  { id: 'grass', name: 'Graminha', icon: '〰', rarity: 'comum', minMinutes: 1 },
  { id: 'daisy', name: 'Margarida', icon: '✿', rarity: 'comum', minMinutes: 5 },
  { id: 'fern', name: 'Samambaia', icon: '♨', rarity: 'comum', minMinutes: 10 },
  { id: 'moss', name: 'Musgo macio', icon: '❧', rarity: 'comum', minMinutes: 15 },
  { id: 'lavender', name: 'Lavanda', icon: '✾', rarity: 'incomum', minMinutes: 20 },
  { id: 'sunflower', name: 'Girassol', icon: '✺', rarity: 'incomum', minMinutes: 25 },
  { id: 'bamboo', name: 'Bambu', icon: '♮', rarity: 'incomum', minMinutes: 25 },
  { id: 'cattail', name: 'Taboa', icon: '♒', rarity: 'incomum', minMinutes: 30 },
  { id: 'lily', name: 'Lírio d’água', icon: '✤', rarity: 'incomum', minMinutes: 35 },
  { id: 'pine', name: 'Pinheirinho', icon: '♠', rarity: 'rara', minMinutes: 40 },
  { id: 'maple', name: 'Bordo dourado', icon: '♣', rarity: 'rara', minMinutes: 45 },
  { id: 'willow', name: 'Salgueiro', icon: '♧', rarity: 'rara', minMinutes: 50 },
  { id: 'cherry', name: 'Cerejeira', icon: '❀', rarity: 'rara', minMinutes: 60 },
  { id: 'moonflower', name: 'Flor-lua', icon: '☾', rarity: 'rara', minMinutes: 75 },
  { id: 'redwood', name: 'Sequoia', icon: '♜', rarity: 'lendária', minMinutes: 90 },
  { id: 'rainbow', name: 'Arco-íris botânico', icon: '✧', rarity: 'lendária', minMinutes: 100 },
  { id: 'crystal', name: 'Cristal verde', icon: '◈', rarity: 'lendária', minMinutes: 120 },
  { id: 'stardust', name: 'Erva estelar', icon: '✦', rarity: 'lendária', minMinutes: 150 },
  { id: 'ancient', name: 'Árvore ancestral', icon: '♛', rarity: 'lendária', minMinutes: 180 },
];

export function createSession({ minutes, label = 'Foco' }) {
  const safeMinutes = Math.max(1, Math.round(Number(minutes) || 25));
  return { id: `session-${Date.now()}-${Math.random().toString(16).slice(2)}`, label: String(label).trim() || 'Foco', totalSeconds: safeMinutes * 60, elapsedSeconds: 0, status: 'ready', focusMinutes: 0, growthStage: 'seed', createdAt: new Date().toISOString() };
}
export function progressFor({ elapsedSeconds, totalSeconds }) { return !totalSeconds ? 0 : Math.max(0, Math.min(1, elapsedSeconds / totalSeconds)); }
export function finishSession(session, completedAt = new Date().toISOString()) {
  const focusMinutes = Math.round(session.totalSeconds / 60);
  return { ...session, elapsedSeconds: session.totalSeconds, status: 'completed', focusMinutes, growthStage: focusMinutes >= 45 ? 'oak' : focusMinutes >= 25 ? 'tree' : 'sprout', completedAt };
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
export function toggleInventoryItem(inactiveItems = {}, itemId) {
  const next = { ...inactiveItems };
  if (next[itemId]) delete next[itemId];
  else next[itemId] = true;
  return next;
}
export function awardVegetation(inventory = {}, focusMinutes, seed = 0) {
  const minutes = Math.max(1, Number(focusMinutes) || 1);
  const eligible = VEGETATION.filter((item) => item.minMinutes <= minutes);
  const rareEligible = minutes >= 120 ? eligible.filter((item) => item.rarity === 'lendária') : minutes >= 60 ? eligible.filter((item) => ['rara', 'lendária'].includes(item.rarity)) : [];
  const pool = (rareEligible.length ? rareEligible : eligible).length ? (rareEligible.length ? rareEligible : eligible) : [VEGETATION[0]];
  const item = pool[Math.abs(Math.floor(Number(seed) || 0)) % pool.length];
  return { item, inventory: { ...inventory, [item.id]: (inventory[item.id] || 0) + 1 } };
}
