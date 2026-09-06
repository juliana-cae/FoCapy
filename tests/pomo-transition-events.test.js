import test from 'node:test';
import assert from 'node:assert/strict';
import { advancePomoSession } from '../src/core.js';

const focusSession=(overrides={})=>({
  pomoPhase:'focus', pomoCycle:1, pomoCycles:2,
  pomoFocusMinutes:1, pomoBreakMinutes:1,
  phaseTotalSeconds:60, phaseElapsedSeconds:0,
  ...overrides,
});

test('an active focus tick has no Pomodoro audio transition',()=>{
  const result=advancePomoSession(focusSession());
  assert.equal(result.transition,null);
  assert.equal(result.session.pomoPhase,'focus');
});

test('only the exact focus-to-rest boundary emits rest-start',()=>{
  const result=advancePomoSession(focusSession({phaseElapsedSeconds:59}));
  assert.equal(result.transition,'rest-start');
  assert.equal(result.session.pomoPhase,'break');
});

test('only the exact rest-to-next-focus boundary emits rest-end',()=>{
  const result=advancePomoSession(focusSession({pomoPhase:'break',phaseElapsedSeconds:59,phaseTotalSeconds:60}));
  assert.equal(result.transition,'rest-end');
  assert.equal(result.session.pomoPhase,'focus');
  assert.equal(result.session.pomoCycle,2);
});

test('the final rest ending emits rest-end once before the session completes',()=>{
  const result=advancePomoSession(focusSession({pomoPhase:'break',pomoCycle:2,phaseElapsedSeconds:59,phaseTotalSeconds:60}));
  assert.equal(result.transition,'rest-end');
  assert.equal(result.completed,true);
});

test('manual pausing has no transition because it does not advance a Pomodoro phase',()=>{
  const paused=focusSession({status:'paused'});
  assert.equal(paused.pomoPhase,'focus');
  assert.equal(paused.phaseElapsedSeconds,0);
});
