import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-act-two-'));
try {
  execFileSync('tsc', ['--target','ES2020','--module','commonjs','--outDir',temp,'--skipLibCheck','--lib','ES2022,DOM',
    path.join(root,'src/game/types.ts'),path.join(root,'src/game/storyState.ts'),path.join(root,'src/game/events.ts'),path.join(root,'src/game/engine.ts'),path.join(root,'src/game/cityScene.ts')], { stdio: 'pipe' });
  const require = createRequire(import.meta.url);
  const engine = require(path.join(temp,'engine.js'));
  const { EVENT_BY_ID, EVENTS } = require(path.join(temp,'events.js'));
  const { getCityScenePresentation } = require(path.join(temp,'cityScene.js'));
  const picks = {
    'failing-grid':'engineers','mara-intake':'brief-openly','hospital-appeal':'rotate','ration-ledger':'publish',
    'storehouse-manifest':'follow-courier','ration-audit':'council-audit','heat-theft':'repair',
    'quill-archive-request':'respect-archive','maintenance-shift-log':'summarise-log','census-of-missing':'publish-census',
    'night-watch-climax':'preserve-line9','signal-below':'expedition','signal-echo':'decode-forecast',
    'outside-voice':'question','northern-visitor-interview':'trust-traveller','quill-vault-access':'archive-public-witness',
    'vale-contingency-list':'retain-contingency','mara-black-box':'preserve-black-box','jorel-trail':'trace-jorel-north',
    'hidden-depot-access':'public-warrant-depot','ledger-second-copy':'protect-courier','public-hearing':'hearing-technical',
    'winter-vote':'vote-security','ridge-map':'survey-ridge',
    'blackout-aftermath':'restore-lights','west-temperature-map':'audit-map','council-evacuation-draft':'publish-evacuation',
    'ilya-clinic-visit':'clinic-reserve','frost-witness':'protect-witness','vale-night-patrol':'patrol-liaisons',
    'quiet-protest':'listen','power-broker':'accept','foundry-fire':'ventilate','night-garden':'support',
    'greenhouse-mold':'study','greenhouse-network':'link-grow-lamps','mirror-fractures':'repair-mirrors','plaza-after-sirens':'plaza-assembly',
  };
  function resolveOne(state) {
    const event = EVENT_BY_ID[state.currentEventId];
    assert.ok(event, `missing event ${state.currentEventId}`);
    const preferred = picks[event.id];
    const choice = event.choices.find((x) => x.id === preferred) ?? event.choices[0];
    const next = engine.resolveChoice(state,event,choice.id);
    assert.equal(next.history.length,state.history.length+1,`choice should resolve once: ${event.id}`);
    for (const [key,value] of Object.entries(next.stats)) assert.ok(value >= 0 && value <= 100,`${key}=${value}`);
    return next;
  }
  function runCampaign(signalChoice='expedition', travellerChoice='question') {
    let state = engine.createNewGame();
    const path = [];
    for (let i=0;i<35 && !state.flags.includes('act-one-complete') && state.status==='playing';i++) { path.push(state.currentEventId); state=resolveOne(state); }
    assert.ok(state.flags.includes('act-one-complete'),'Act I should complete');
    assert.equal(state.currentEventId,'signal-below');
    picks['signal-below']=signalChoice;
    picks['outside-voice']=travellerChoice;
    for (let i=0;i<25 && !state.flags.includes('act-two-complete') && state.status==='playing';i++) { path.push(state.currentEventId); state=resolveOne(state); }
    assert.ok(state.flags.includes('act-two-complete'),`Act II should complete; status=${state.status}, day=${state.day}, current=${state.currentEventId}, stats=${JSON.stringify(state.stats)}, visited ${path.join(' -> ')}`);
    assert.equal(state.story.chapter,3);
    assert.equal(state.currentEventId,'ridge-map','Act II should hand directly into the northern-route opening');
    assert.ok(path.includes('jorel-trail'));
    assert.ok(path.includes('public-hearing'));
    assert.ok(path.includes('winter-vote'));
    assert.ok(state.story.evidence.includes('ridge-coordinate-schedule'));
    assert.equal(getCityScenePresentation(state).mood,'ridge');
    state=resolveOne(state);
    assert.ok(state.flags.includes('act-three-opened'));
    assert.equal(getCityScenePresentation(state).mood,'ridge');
    return {state,path};
  }
  const full = runCampaign('expedition','question');
  const sealed = runCampaign('seal','refuse');
  for (const id of ['northern-visitor-interview','quill-vault-access','vale-contingency-list','mara-black-box','jorel-trail','hidden-depot-access','ledger-second-copy','public-hearing','winter-vote','ridge-map']) assert.ok(EVENT_BY_ID[id],`missing event ${id}`);
  console.log(JSON.stringify({ok:true,events:EVENTS.length,actTwoEvents:10,investigationRoute:full.path.filter((id)=>id.startsWith('signal')||id.includes('jorel')||id.includes('depot')||id.includes('hearing')||id.includes('vote')),sealedSignalBranch:sealed.path.slice(-12),chapter:full.state.story.chapter,actTwoComplete:true,ridgeFeed:getCityScenePresentation(full.state).mood},null,2));
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
