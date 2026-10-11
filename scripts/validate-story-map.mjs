import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const mapPath = path.join(root, 'docs', 'story-event-map.json');
const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-map-check-'));
try {
  execFileSync('tsc', ['--target','ES2020','--module','commonjs','--outDir',temp,'--skipLibCheck','--lib','ES2022,DOM',
    path.join(root,'src/game/types.ts'), path.join(root,'src/game/storyState.ts'), path.join(root,'src/game/events.ts')], {stdio:'pipe'});
  const require = createRequire(import.meta.url);
  const { EVENTS } = require(path.join(temp,'events.js'));
  const sourceIds = new Set(EVENTS.map((event) => event.id));
  const nodeIds = map.nodes.map((node) => node.id);
  const nodeIdSet = new Set(nodeIds);
  const implementedIds = new Set(map.nodes.filter((node) => node.status === 'implemented').map((node) => node.id));
  const implementedEndingIds = new Set(map.nodes.filter((node) => node.status === 'implemented ending').map((node) => node.id));

  assert.equal(EVENTS.length, sourceIds.size, 'source event IDs must be unique');
  assert.equal(nodeIds.length, map.campaignTargetEvents, 'campaignTargetEvents must match node count');
  assert.equal(nodeIdSet.size, nodeIds.length, 'story node ids must be unique');
  assert.deepEqual([...sourceIds].sort(), [...implementedIds].sort(), 'map implemented IDs must match actual src/game/events.ts event IDs');
  assert.equal(map.nodes.filter((node) => ['ending-first-morning','ending-eternal-city','ending-peoples-dawn','ending-iron-winter','ending-beyond-ridge','ending-last-light'].includes(node.id) && node.status === 'implemented ending').length, 6, 'all six resolved endings must be marked implemented ending outcomes');
  assert.equal(map.nodes.filter((node) => node.status === 'planned' || node.status === 'planned ending').length, map.nodes.length - implementedIds.size - implementedEndingIds.size, 'planned-node count must match implementation status');

  const actOneImplemented = new Set(map.nodes.filter((node) => node.act === 1 && node.status === 'implemented').map((node) => node.id));
  for (const id of ['failing-grid','mara-intake','hospital-appeal','ration-ledger','storehouse-manifest','ration-audit','census-of-missing','maintenance-shift-log','night-watch-climax']) {
    assert.ok(actOneImplemented.has(id), `Act I scene ${id} must be marked implemented`);
  }
  const actTwoImplemented = new Set(map.nodes.filter((node) => node.act === 2 && node.status === 'implemented').map((node) => node.id));
  for (const id of ['signal-below','outside-voice','northern-visitor-interview','mara-black-box','hidden-depot-access','public-hearing','winter-vote']) {
    assert.ok(actTwoImplemented.has(id), `Act II scene ${id} must be marked implemented`);
  }
  const actThreeImplemented = new Set(map.nodes.filter((node) => node.act === 3 && node.status === 'implemented').map((node) => node.id));
  for (const id of ['ridge-map','expedition-prep','ridge-crossing','ridge-whiteout','weather-station','ridge-settlement','jorel-evacuation-record','act-three-outlook']) {
    assert.ok(actThreeImplemented.has(id), `Act III scene ${id} must be marked implemented`);
  }
  const actFourImplemented = new Set(map.nodes.filter((node) => node.act === 4 && node.status === 'implemented').map((node) => node.id));
  for (const id of ['outer-relay-briefing','act-four-council','dawnline-access','mara-override-confession','quill-full-archive','relay-lock-authenticated','relay-lock-manual','jorel-reunion','jorel-search-plan','gantry-workshop','orbital-telemetry','veil-model','mirror-calibration','first-test-pulse','grid-rebuild','second-test-window','test-pulse-success','test-pulse-failure','act4-final-vote']) {
    assert.ok(actFourImplemented.has(id), `Act IV scene ${id} must be marked implemented`);
  }
  const actFiveImplemented = new Set(map.nodes.filter((node) => node.act === 5 && node.status === 'implemented').map((node) => node.id));
  for (const id of ['act-five-briefing','act-five-commitments','act-five-jorel-dispatch','act-five-final-operation']) assert.ok(actFiveImplemented.has(id), `Act V scene ${id} must be marked implemented`);

  for (const node of map.nodes) {
    assert.ok(node.id && node.title && node.actTitle && node.trigger && node.decisionSpace && node.connections && node.liveCityFeed, `node ${node.id} is incomplete`);
  }
  for (const edge of map.edges) {
    assert.ok(nodeIdSet.has(edge.from), `edge starts at unknown node ${edge.from}`);
    assert.ok(nodeIdSet.has(edge.to), `edge ends at unknown node ${edge.to}`);
    assert.ok(edge.condition, `edge ${edge.from} -> ${edge.to} needs a condition`);
  }
  assert.ok(map.acts.length === 5, 'campaign must contain five acts');
  const plannedCount = map.nodes.filter((node) => node.status === 'planned' || node.status === 'planned ending').length;
  console.log(`Story map valid: ${map.nodes.length} unique nodes (${implementedIds.size} implemented event records, ${implementedEndingIds.size} implemented ending outcomes, ${plannedCount} planned), ${map.edges.length} dependency edges, ${map.acts.length} acts; source has ${EVENTS.length} event records.`);
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
