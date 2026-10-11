import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-map-sync-'));
try {
  execFileSync('tsc', ['--target','ES2020','--module','commonjs','--outDir',temp,'--skipLibCheck','--lib','ES2022,DOM',
    path.join(root,'src/game/types.ts'), path.join(root,'src/game/storyState.ts'), path.join(root,'src/game/events.ts')], {stdio:'pipe'});
  const require = createRequire(import.meta.url);
  const { EVENTS } = require(path.join(temp,'events.js'));
  const sourceEvents = new Map(EVENTS.map((event) => [event.id, event]));
  if (sourceEvents.size !== EVENTS.length) throw new Error('Duplicate event IDs found in source.');
  const actOneIds = new Set(['failing-grid','mara-intake','hospital-appeal','ration-ledger','storehouse-manifest','ration-audit','heat-theft','quill-archive-request','maintenance-shift-log','census-of-missing','night-watch-climax','blackout-aftermath','mirror-fractures','plaza-after-sirens','greenhouse-network','west-temperature-map','council-evacuation-draft','ilya-clinic-visit','frost-witness','vale-night-patrol','quiet-protest','power-broker','foundry-fire','night-garden','greenhouse-mold']);
  const actTwoIds = new Set(['signal-below','signal-echo','outside-voice','northern-visitor-interview','quill-vault-access','vale-contingency-list','mara-black-box','jorel-trail','hidden-depot-access','ledger-second-copy','public-hearing','winter-vote']);
  const actThreeIds = new Set(['ridge-map','expedition-prep','ridge-crossing','ridge-whiteout','weather-station','jorel-evacuation-record','ridge-settlement','remote-mirror','third-signal-clue','dawnline-archive-fragment','proof-of-veil','ridge-envoy','cross-settlement-compact','act-three-outlook']);
  const actFourIds = new Set(['outer-relay-briefing','act-four-council','dawnline-access','mara-override-confession','quill-full-archive','relay-lock-authenticated','relay-lock-manual','jorel-reunion','jorel-search-plan','gantry-workshop','orbital-telemetry','veil-model','mirror-calibration','first-test-pulse','grid-rebuild','second-test-window','test-pulse-success','test-pulse-failure','act4-final-vote']);
  const actFiveIds = new Set(['act-five-briefing','act-five-commitments','act-five-jorel-dispatch','act-five-final-operation']);
  const actFor = (id) => actOneIds.has(id) ? 1 : actTwoIds.has(id) ? 2 : actThreeIds.has(id) ? 3 : actFourIds.has(id) ? 4 : actFiveIds.has(id) ? 5 : null;

  const mapPath = path.join(root,'docs/story-event-map.json');
  const map = JSON.parse(fs.readFileSync(mapPath,'utf8'));
  const nodeById = new Map(map.nodes.map((node) => [node.id,node]));
  const actTitles = {1:'The Last Warm District',2:'A City Divided',3:'The Signal Beneath the Ice',4:'The Architecture of Night',5:'Afterlight'};
  const metadata = {
    'ridge-whiteout': {act:3,trigger:'The ridge route is exposed or reserve levels indicate a serious weather risk.',decisionSpace:'Burn an emergency beacon, press downhill, or shelter and wait.',connections:'Consumes or preserves supplies; changes whether the expedition reaches the station safely.',liveCityFeed:'The city feed shows an unstable beacon trace and the field team crossing a whiteout.'},
    'act-three-outlook': {act:3,trigger:'The required Act III main route has resolved; optional clues are retained when earned.',decisionSpace:'Prioritise a personal rescue, a shared safety compact, or tracing the autonomous command chain.',connections:'Sets the priority that opens Act IV and preserves evidence, settlement ties, and Jorel conditions.',liveCityFeed:'The view shifts from the ridge contact to the outer relay coordinates.'},
    'outer-relay-briefing': {act:4,trigger:'Act III climax is complete.',decisionSpace:'Choose whether rescue, the inter-city protocol, or the command trace leads Act IV.',connections:'Opens Act IV and creates the first operations-board commitment.',liveCityFeed:'The relay map overlays the city scene; a human lock is now the operational obstacle.'},
    'act-four-council': {act:4,trigger:'The Act IV operations briefing is resolved.',decisionSpace:'Public mandate, temporary technical authority, or a binding two-city compact.',connections:'Sets political legitimacy, working relationships, shared control evidence, and emergency supplies.',liveCityFeed:'The scene moves to Vesper’s joint civic chamber and the Dawnline control sublevel.'},
    'relay-lock-authenticated': {act:4,trigger:'Jorel’s maintenance code is present in the persistent evidence record.',decisionSpace:'Authenticate jointly with a Hearth-9 witness or misuse the code as root authority.',connections:'Establishes a human interlock or raises the DAWNLINE security alert.',liveCityFeed:'The facility changes to the human-lock state; an unauthorised attempt can trigger a breach warning.'},
    'relay-lock-manual': {act:4,trigger:'Jorel’s maintenance code is absent or Line 9 was sealed.',decisionSpace:'Request Hearth-9’s witness or force a mechanical bypass.',connections:'Can create a witnessed lock procedure or leave the relay in an unstable condition.',liveCityFeed:'The lock remains physically visible; a forced bypass creates a persistent hazard.'},
    'jorel-search-plan': {act:4,trigger:'No confirmed current Jorel signal is available after the manual lock procedure.',decisionSpace:'Authorise a search, ask Hearth-9 to authenticate a maintenance window, or restrict the operation.',connections:'Keeps Jorel’s fate open while advancing the shared safety work.',liveCityFeed:'The live signal caption changes to an unconfirmed location and an open rescue request.'},
    'second-test-window': {act:4,trigger:'The first pulse was deferred and the reserve/rebuild scene has resolved.',decisionSpace:'Run a second controlled test or abort the pulse and preserve the local system.',connections:'Re-evaluates the actual safety state, determining success or safe failure before the final vote.',liveCityFeed:'The artificial sun enters a second, timed calibration window.'},
    'act-five-briefing': {act:5,trigger:'The Act IV final vote records the chosen strategy.',decisionSpace:'Prepare the coordinated reset, reinforce the local artificial dawn, or open the protected evacuation route.',connections:'Establishes the final operation plan, but the coalition, Jorel dispatch, and outcome still depend on decisions.',liveCityFeed:'The final operations room shows the next autonomous closure window approaching.'},
    'act-five-commitments': {act:5,trigger:'Act V briefing has resolved and the final closure window is approaching.',decisionSpace:'Commit to an engineering coalition, civilian witnesses, unified security command, or evacuation convoy.',connections:'The chosen coalition gates the endings; character relationships record who was trusted or excluded.',liveCityFeed:'The city feed shows crews assembling, public witnesses gathering, security cordons, or evacuation transport.'},
    'act-five-jorel-dispatch': {act:5,trigger:'The final coalition is chosen; current signal evidence governs rescue availability.',decisionSpace:'Extract Jorel using an authenticated live channel, request a search, or keep the relay staffed.',connections:'Adds a personal consequence to the finale without claiming a rescue that the evidence cannot support.',liveCityFeed:'The outer-relay signal, rescue roster and convoy status alter the feed caption.'},
    'act-five-final-operation': {act:5,trigger:'Final coalition and Jorel dispatch are recorded.',decisionSpace:'Choose one of six distinct campaign endings, with safe reset gated on the tested pulse, compact, human interlock, engineering coalition and shared-control evidence.',connections:'Resolves the campaign immediately; ending title, result text, and city scene follow the recorded outcome.',liveCityFeed:'Natural dawn, local artificial light, civilian recovery, authoritarian order, northern evacuation, or catastrophic shutdown.'},
  };

  for (const node of map.nodes) {
    if (sourceEvents.has(node.id)) {
      node.status = 'implemented';
      node.plannedBuild = null;
      const act = actFor(node.id);
      if (act !== null) { node.act = act; node.actTitle = actTitles[act]; }
    } else if (node.status === 'implemented') {
      node.status = 'planned';
      node.plannedBuild = node.plannedBuild ?? 'Future story expansion';
    }
  }

  for (const [id,event] of sourceEvents) {
    if (nodeById.has(id)) continue;
    const meta = metadata[id];
    if (!meta) throw new Error(`No story-map metadata for newly implemented event ${id}`);
    const eventAct = actFor(id) ?? meta.act;
    const node = {
      id,
      title: event.title,
      act: eventAct,
      actTitle: actTitles[eventAct],
      status: 'implemented',
      trigger: meta.trigger,
      decisionSpace: meta.decisionSpace,
      connections: meta.connections,
      liveCityFeed: meta.liveCityFeed,
      plannedBuild: null,
    };
    map.nodes.push(node);
    nodeById.set(id,node);
  }

  for (const endingId of ['ending-first-morning','ending-eternal-city','ending-peoples-dawn','ending-iron-winter','ending-beyond-ridge','ending-last-light']) {
    const node = nodeById.get(endingId);
    if (!node) throw new Error(`Missing ending blueprint node ${endingId}`);
    node.status = 'implemented ending';
    node.plannedBuild = null;
  }

  const edgeSpecs = [
    ['ridge-crossing','ridge-whiteout','The route is exposed, a beacon kit is carried, or reserves are low'],
    ['ridge-whiteout','weather-station','The crew reaches shelter or follows the beacon through the storm'],
    ['cross-settlement-compact','act-three-outlook','The settlement contact route resolves; a compact may be signed or deferred'],
    ['proof-of-veil','act-three-outlook','Independent evidence has been gathered; optional proof may be incomplete'],
    ['act-three-outlook','outer-relay-briefing','Act III priority choice opens Act IV'],
    ['outer-relay-briefing','act-four-council','Operations briefing resolved'],
    ['act-four-council','dawnline-access','The governance mandate selects how the facility is entered'],
    ['dawnline-access','mara-override-confession','Facility records identify Mara’s old override'],
    ['mara-override-confession','quill-full-archive','Mara’s record is checked against the First Night archive'],
    ['quill-full-archive','relay-lock-authenticated','Jorel’s maintenance code is present'],
    ['quill-full-archive','relay-lock-manual','The maintenance code is unavailable or Line 9 was sealed'],
    ['relay-lock-authenticated','jorel-reunion','A current Jorel signal or maintenance channel exists'],
    ['relay-lock-manual','jorel-search-plan','The current signal was not confirmed'],
    ['jorel-reunion','gantry-workshop','Contact path resolved; joint engineering can begin'],
    ['jorel-search-plan','gantry-workshop','Search plan recorded; joint engineering can begin'],
    ['gantry-workshop','orbital-telemetry','The team chooses a repair build, contractor, or deferred work'],
    ['orbital-telemetry','veil-model','A DAWNLINE response is isolated, decoded, or published'],
    ['veil-model','mirror-calibration','At least a provisional safety model exists'],
    ['mirror-calibration','first-test-pulse','Calibration result selects a prepared or approximate test'],
    ['first-test-pulse','grid-rebuild','The first test is deferred rather than immediately attempted'],
    ['grid-rebuild','second-test-window','Reserve/rebuild decision resolves'],
    ['first-test-pulse','test-pulse-success','An immediate pulse is attempted with all safety predicates met'],
    ['first-test-pulse','test-pulse-failure','An immediate pulse is attempted without a sufficient safety margin'],
    ['second-test-window','test-pulse-success','The second window meets the safety predicates'],
    ['second-test-window','test-pulse-failure','The second window does not meet the safety predicates'],
    ['test-pulse-success','act4-final-vote','Measured light corridor is recorded'],
    ['test-pulse-failure','act4-final-vote','Failure telemetry and fallback plan are recorded'],
    ['act4-final-vote','act-five-briefing','The final Act IV strategy vote is recorded'],
    ['act-five-briefing','act-five-commitments','The opening plan leads to a final coalition choice'],
    ['act-five-commitments','act-five-jorel-dispatch','The coalition decision sets the terms for the final human stakes'],
    ['act-five-jorel-dispatch','act-five-final-operation','The personal rescue decision precedes the irreversible finale'],
    ['act-five-final-operation','ending-first-morning','All scientific, human-interlock, settlement and coalition safety gates pass'],
    ['act-five-final-operation','ending-eternal-city','The player preserves local artificial light instead of issuing the planetary reset'],
    ['act-five-final-operation','ending-peoples-dawn','A civilian recovery coalition is committed'],
    ['act-five-final-operation','ending-iron-winter','A unified security command is committed'],
    ['act-five-final-operation','ending-beyond-ridge','An evacuation convoy is committed'],
    ['act-five-final-operation','ending-last-light','The player forces an unverified hard reset'],
  ];
  const edgeKeys = new Set(map.edges.map((e) => `${e.from}\u0000${e.to}\u0000${e.condition}`));
  for (const [from,to,condition] of edgeSpecs) {
    if (!nodeById.has(from) || !nodeById.has(to)) throw new Error(`Dependency references unknown node: ${from} -> ${to}`);
    const key = `${from}\u0000${to}\u0000${condition}`;
    if (!edgeKeys.has(key)) { map.edges.push({from,to,condition}); edgeKeys.add(key); }
  }

  map.canonRevision = '2.0';
  map.campaignTargetEvents = map.nodes.length;
  map.acts[2].actReveal = 'Hearth-9 survives beyond the ridge; records place Jorel at the outer relay, and DAWNLINE’s active safety cycle is independently corroborated.';
  map.acts[3].actReveal = 'Mara’s override saved a local heat loop during the emergency. DAWNLINE requires a witnessed human interlock and a coordinated test before any reset can be considered.';
  map.acts[4].actReveal = 'Vesper’s final coalition, Jorel’s rescue decision, and the accumulated evidence determine whether humanity restores natural sunlight, preserves artificial dawn, rebuilds under civilian or security rule, evacuates north, or suffers a catastrophic shutdown.';
  fs.writeFileSync(mapPath, JSON.stringify(map,null,2)+'\n');
  const implementedEndingCount = map.nodes.filter((node) => node.status === 'implemented ending').length;
  const plannedCount = map.nodes.filter((node) => node.status === 'planned' || node.status === 'planned ending').length;
  console.log(`Story map synced: ${map.nodes.length} nodes, ${sourceEvents.size} implemented event records, ${implementedEndingCount} implemented ending outcomes, ${plannedCount} planned nodes, ${map.edges.length} dependency edges.`);
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
