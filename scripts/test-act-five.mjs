import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const root=path.resolve(import.meta.dirname,'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'afterlight-act-five-'));
try {
  execFileSync('tsc',['--target','ES2020','--module','commonjs','--outDir',temp,'--skipLibCheck','--lib','ES2022,DOM',path.join(root,'src/game/types.ts'),path.join(root,'src/game/storyState.ts'),path.join(root,'src/game/events.ts'),path.join(root,'src/game/engine.ts'),path.join(root,'src/game/cityScene.ts')],{stdio:'pipe'});
  const require=createRequire(import.meta.url);
  const {EVENTS,EVENT_BY_ID}=require(path.join(temp,'events.js'));
  const {createNewGame,resolveChoice,isChoiceAvailable}=require(path.join(temp,'engine.js'));
  const {getCityScenePresentation}=require(path.join(temp,'cityScene.js'));
  const ids=['act-five-briefing','act-five-commitments','act-five-jorel-dispatch','act-five-final-operation'];
  for(const id of ids) assert(EVENT_BY_ID[id],`missing ${id}`);
  const cases=[
    {ending:'ending-first-morning',brief:'final-brief-coordinated',commit:'commit-engineering-coalition',dispatch:'final-jorel-extraction',status:'won',title:'The First Morning',mood:'dawn'},
    {ending:'ending-eternal-city',brief:'final-brief-preserve',commit:'commit-civic-coalition',dispatch:'final-jorel-hold',status:'won',title:'The Eternal City',mood:'final'},
    {ending:'ending-peoples-dawn',brief:'final-brief-preserve',commit:'commit-civic-coalition',dispatch:'final-jorel-hold',status:'won',title:'The People’s Dawn',mood:'recovery'},
    {ending:'ending-iron-winter',brief:'final-brief-preserve',commit:'commit-security-chain',dispatch:'final-jorel-hold',status:'won',title:'The Iron Winter',mood:'unrest'},
    {ending:'ending-beyond-ridge',brief:'final-brief-evacuate',commit:'commit-evacuation-convoy',dispatch:'final-jorel-hold',status:'won',title:'Beyond the Ridge',mood:'ridge'},
    {ending:'ending-last-light',brief:'final-brief-coordinated',commit:'commit-security-chain',dispatch:'final-jorel-hold',status:'lost',title:'The Last Light',mood:'testfailure'},
  ];
  for(const c of cases){
    let s=createNewGame();
    s.day=45; s.stats={population:82,energy:82,food:82,order:78,technology:72};
    s.flags=['act-one-complete','act-two-complete','act-three-complete','act-four-opened','act-four-complete','act-five-opened','test-pulse-succeeded','settlement-compact-signed','human-interlock-understood','calibration-safe','jorel-current-signal-confirmed','jorel-maintenance-channel-open'];
    s.seenEvents=['outer-relay-briefing','act-four-council','dawnline-access','mara-override-confession','quill-full-archive','relay-lock-authenticated','jorel-reunion','gantry-workshop','orbital-telemetry','veil-model','mirror-calibration','first-test-pulse','test-pulse-success','act4-final-vote'];
    s.story.chapter=5;
    s.story.truths=['safe-reset-requires-coordination','both-cities-control-protocol','safe-reset-tested-once','human-override-required','jorel-current-signal-confirmed','jorel-survived'];
    s.story.evidence=['human-interlock-procedure','settlement-compact-signatures','jorel-maintenance-code','jorel-live-roster-entry'];
    s.currentEventId='act-five-briefing';
    s=resolveChoice(s,EVENT_BY_ID['act-five-briefing'],c.brief);
    assert.equal(s.currentEventId,'act-five-commitments',`${c.ending}: briefing -> commitments`);
    s=resolveChoice(s,EVENT_BY_ID[s.currentEventId],c.commit);
    assert.equal(s.currentEventId,'act-five-jorel-dispatch',`${c.ending}: commitments -> dispatch`);
    s=resolveChoice(s,EVENT_BY_ID[s.currentEventId],c.dispatch);
    assert.equal(s.currentEventId,'act-five-final-operation',`${c.ending}: dispatch -> final operation`);
    const final=EVENT_BY_ID[s.currentEventId].choices.find(x=>x.id===c.ending);
    assert(final,`missing ending choice ${c.ending}`);
    assert(isChoiceAvailable(s,final),`ending choice ${c.ending} should be available for its route`);
    s=resolveChoice(s,EVENT_BY_ID[s.currentEventId],c.ending);
    assert.equal(s.status,c.status,`${c.ending} status`);
    assert.equal(s.endingTitle,c.title,`${c.ending} title`);
    assert.equal(getCityScenePresentation(s).mood,c.mood,`${c.ending} scene mood`);
    assert(s.flags.includes('act-five-complete'));
    for(const [key,value] of Object.entries(s.stats)) assert(value>=0&&value<=100,`${c.ending} ${key} outside bounds: ${value}`);
    if(c.ending==='ending-first-morning') assert(s.flags.includes('jorel-rescued'),'authenticated Jorel rescue should be reflected');
    if(c.ending==='ending-last-light') assert(s.endingText.startsWith('The command reaches DAWNLINE'));
  }
  // Without the safety conditions, the First Morning option must be hidden.
  let unsafe=createNewGame();
  unsafe.day=45; unsafe.stats={population:70,energy:70,food:70,order:70,technology:60};
  unsafe.flags=['act-one-complete','act-two-complete','act-three-complete','act-four-opened','act-four-complete','act-five-opened'];
  unsafe.seenEvents=['act4-final-vote','act-five-briefing','act-five-commitments','act-five-jorel-dispatch'];
  unsafe.story.chapter=5; unsafe.currentEventId='act-five-final-operation';
  assert(!isChoiceAvailable(unsafe,EVENT_BY_ID['act-five-final-operation'].choices.find(x=>x.id==='ending-first-morning')),'unsafe reset must be gated');
  assert(EVENTS.length===new Set(EVENTS.map(x=>x.id)).size,'duplicate event ids');
  console.log(JSON.stringify({ok:true,actFiveEvents:ids.length,totalEvents:EVENTS.length,endings:cases.map(c=>({id:c.ending,title:c.title,status:c.status})),unsafeResetGated:true},null,2));
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
