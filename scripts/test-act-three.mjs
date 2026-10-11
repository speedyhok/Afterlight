import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-act-three-'));
try {
  execFileSync('tsc', ['--target','ES2020','--module','commonjs','--outDir',temp,'--skipLibCheck','--lib','ES2022,DOM',
    path.join(root,'src/game/types.ts'),path.join(root,'src/game/storyState.ts'),path.join(root,'src/game/events.ts'),path.join(root,'src/game/engine.ts'),path.join(root,'src/game/cityScene.ts')], { stdio: 'pipe' });
  const require = createRequire(import.meta.url);
  const engine = require(path.join(temp,'engine.js'));
  const { EVENT_BY_ID, EVENTS } = require(path.join(temp,'events.js'));
  const { getCityScenePresentation } = require(path.join(temp,'cityScene.js'));
  const picks = {
    'failing-grid':'engineers','mara-intake':'brief-openly','hospital-appeal':'rotate','ration-ledger':'quiet',
    'storehouse-manifest':'preserve-manifest','ration-audit':'council-audit','heat-theft':'repair',
    'quill-archive-request':'respect-archive','maintenance-shift-log':'summarise-log','census-of-missing':'publish-census',
    'night-watch-climax':'secure-line9','signal-below':'expedition','signal-echo':'broadcast-coordinates',
    'outside-voice':'question','northern-visitor-interview':'trust-traveller','quill-vault-access':'archive-public-witness',
    'vale-contingency-list':'retain-contingency','mara-black-box':'reset-black-box','jorel-trail':'trace-jorel-north',
    'hidden-depot-access':'seal-depot-door','ledger-second-copy':'official-courier-interview','public-hearing':'hearing-technical',
    'winter-vote':'vote-security','ridge-map':'delay-expedition','expedition-prep':'team-security',
    'ridge-crossing':'sheltered-switchbacks','ridge-whiteout':'fire-emergency-beacon','weather-station':'recover-station-drives','ridge-settlement':'hearth9-code-contact',
    'jorel-evacuation-record':'tell-ilya-verified','remote-mirror':'mirror-refuse',
    'third-signal-clue':'answer-jorel-code','dawnline-archive-fragment':'verify-header-with-quill',
    'proof-of-veil':'peer-review-veil','ridge-envoy':'negotiate-envoy-privately',
    'cross-settlement-compact':'sign-reciprocal-compact','act-three-outlook':'trace-outer-relay',
    'outer-relay-briefing':'brief-command-route',
    'blackout-aftermath':'restore-lights','west-temperature-map':'audit-map','council-evacuation-draft':'publish-evacuation',
    'ilya-clinic-visit':'clinic-reserve','frost-witness':'protect-witness','vale-night-patrol':'patrol-liaisons',
    'quiet-protest':'listen','power-broker':'accept','foundry-fire':'ventilate','night-garden':'support',
    'greenhouse-mold':'study','greenhouse-network':'link-grow-lamps','mirror-fractures':'repair-mirrors','plaza-after-sirens':'plaza-assembly',
  };
  function playOne(state, log) {
    const event = EVENT_BY_ID[state.currentEventId];
    assert.ok(event, `missing event ${state.currentEventId}; path=${log.join(' -> ')}`);
    log.push(event.id);
    const wanted = picks[event.id];
    const choice = event.choices.find((x) => x.id === wanted) ?? event.choices[0];
    assert.ok(choice, `${event.id} has no choice`);
    const next = engine.resolveChoice(state, event, choice.id);
    assert.equal(next.history.length, state.history.length + 1, `choice should apply once: ${event.id}`);
    for (const [key, value] of Object.entries(next.stats)) assert.ok(value >= 0 && value <= 100, `${event.id} ${key}=${value}`);
    return next;
  }
  function runCampaign({signal='expedition', crossing='follow-signal-window', contact='hearth9-code-contact', jorel='tell-ilya-verified'}={}) {
    let state = engine.createNewGame();
    const log = [];
    for (let i=0; i<45 && !state.flags.includes('act-one-complete') && state.status==='playing'; i++) state=playOne(state,log);
    assert.ok(state.flags.includes('act-one-complete'), 'Act I completed');
    picks['signal-below'] = signal;
    for (let i=0; i<35 && !state.flags.includes('act-two-complete') && state.status==='playing'; i++) state=playOne(state,log);
    assert.ok(state.flags.includes('act-two-complete'), `Act II completed; ${state.status} day ${state.day}, ${state.currentEventId}, ${JSON.stringify(state.stats)}, path=${log.join(' -> ')}`);
    assert.equal(state.currentEventId, 'ridge-map');
    picks['ridge-crossing'] = crossing;
    picks['ridge-settlement'] = contact;
    picks['jorel-evacuation-record'] = jorel;
    for (let i=0; i<35 && !state.flags.includes('act-three-complete') && state.status==='playing'; i++) state=playOne(state,log);
    assert.ok(state.flags.includes('act-three-complete'), `Act III completed; ${state.status} day ${state.day}, ${state.currentEventId}, ${JSON.stringify(state.stats)}, path=${log.join(' -> ')}`);
    assert.equal(state.story.chapter,4);
    assert.equal(state.currentEventId,'outer-relay-briefing','Act III hands off to Act IV');
    for (const id of ['ridge-map','expedition-prep','ridge-crossing','weather-station','ridge-settlement','jorel-evacuation-record','act-three-outlook']) assert.ok(log.includes(id), `missing Act III event ${id}`);
    assert.ok(state.story.truths.includes('ridge-settlement-survived'));
    assert.ok(state.story.truths.includes('jorel-survived'));
    assert.ok(state.story.evidence.includes('jorel-live-roster-entry'));
    if (signal === 'expedition') {
      assert.ok(log.includes('third-signal-clue'));
      assert.ok(state.story.truths.includes('jorel-current-signal-confirmed'));
    } else assert.ok(!log.includes('third-signal-clue'), 'sealed signal should not force a reply through Line 9');
    assert.equal(getCityScenePresentation(state).mood,'jorel');
    state=playOne(state,log);
    assert.ok(state.flags.includes('act-four-opened'));
    return { state, log };
  }
  const main = runCampaign();
  const sealedSignal = runCampaign({signal:'seal', crossing:'sheltered-switchbacks', contact:'hearth9-covert-approach', jorel:'seal-jorel-location'});
  const required = ['expedition-prep','ridge-crossing','ridge-whiteout','weather-station','jorel-evacuation-record','ridge-settlement','remote-mirror','third-signal-clue','dawnline-archive-fragment','proof-of-veil','ridge-envoy','cross-settlement-compact','act-three-outlook','outer-relay-briefing'];
  for (const id of required) assert.ok(EVENT_BY_ID[id], `event missing: ${id}`);
  console.log(JSON.stringify({ok:true,eventCount:EVENTS.length,actThreeRoute:main.log.filter(id=>required.includes(id)||id==='ridge-map'),sealedSignalRoute:sealedSignal.log.filter(id=>required.includes(id)||id==='ridge-map'),chapter:main.state.story.chapter,jorelAliveTruth:main.state.story.truths.includes('jorel-survived'),currentSignalTruth:main.state.story.truths.includes('jorel-current-signal-confirmed'),scene:getCityScenePresentation(main.state).mood},null,2));
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
