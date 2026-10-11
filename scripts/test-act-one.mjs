import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-act-one-'));
try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp, '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'),
    path.join(root, 'src/game/storyState.ts'),
    path.join(root, 'src/game/events.ts'),
    path.join(root, 'src/game/engine.ts'),
    path.join(root, 'src/game/cityScene.ts'),
  ], { stdio: 'pipe' });

  // Output is CommonJS in a temporary folder, outside the app's ESM package scope.
  const require = createRequire(import.meta.url);
  const engine = require(path.join(temp, 'engine.js'));
  const { EVENT_BY_ID, EVENTS } = require(path.join(temp, 'events.js'));
  const { getCityScenePresentation } = require(path.join(temp, 'cityScene.js'));
  const preferredChoices = {
    'failing-grid': 'engineers',
    'mara-intake': 'brief-openly',
    'hospital-appeal': 'rotate',
    'ration-ledger': 'publish',
    'storehouse-manifest': 'preserve-manifest',
    'ration-audit': 'council-audit',
    'heat-theft': 'repair',
    'quill-archive-request': 'respect-archive',
    'maintenance-shift-log': 'summarise-log',
    'census-of-missing': 'publish-census',
    'night-watch-climax': 'preserve-line9',
    'signal-below': 'expedition',
    'signal-echo': 'decode-forecast',
    'outside-voice': 'question',
    'blackout-aftermath': 'restore-lights',
    'west-temperature-map': 'audit-map',
    'council-evacuation-draft': 'publish-evacuation',
    'ilya-clinic-visit': 'clinic-reserve',
    'frost-witness': 'protect-witness',
    'vale-night-patrol': 'patrol-liaisons',
    'quiet-protest': 'listen',
    'power-broker': 'accept',
    'foundry-fire': 'ventilate',
    'night-garden': 'support',
    'greenhouse-mold': 'study',
    'greenhouse-network': 'link-grow-lamps',
    'mirror-fractures': 'repair-mirrors',
    'plaza-after-sirens': 'hear-assembly',
    'signal-echo': 'decode-forecast',
  };
  const step = (state, max = 1, choiceOverrides = preferredChoices) => {
    for (let i = 0; i < max && state.status === 'playing'; i++) {
      const event = EVENT_BY_ID[state.currentEventId];
      assert.ok(event, `Current event ${state.currentEventId} must exist`);
      const choiceId = choiceOverrides[event.id];
      const choice = event.choices.find((c) => c.id === choiceId) ?? event.choices[0];
      const priorHistory = state.history.length;
      const next = engine.resolveChoice(state, event, choice.id);
      assert.ok(next.history.length === priorHistory + 1, `Choice on ${event.id} must resolve exactly once`);
      for (const [stat, value] of Object.entries(next.stats)) {
        assert.ok(value >= 0 && value <= 100, `${stat} must remain within 0–100 (got ${value})`);
      }
      state = next;
    }
    return state;
  };

  // Mainline path: verify that Act I is a curated campaign and ends at the Line 9 lead.
  let state = engine.createNewGame();
  assert.equal(state.currentEventId, 'failing-grid');
  const mainline = [];
  for (let turn = 0; turn < 25 && !state.flags.includes('act-one-complete') && state.status === 'playing'; turn++) {
    mainline.push(state.currentEventId);
    state = step(state);
  }
  assert.ok(state.flags.includes('act-one-complete'), `Act I should finish; path: ${mainline.join(' -> ')}`);
  assert.ok(state.flags.includes('line-9-route-known'), 'Act I climax must reveal the Line 9 route');
  assert.equal(state.story.chapter, 2, 'Act I climax should advance narrative chapter');
  assert.equal(state.currentEventId, 'signal-below', 'Act II should begin with the Line 9 signal');
  assert.ok(state.story.evidence.includes('line-9-transmitter-pulse'), 'Climax should add Line 9 evidence to story dossier');
  assert.ok(state.story.relationships.mara > 0, 'Mara relationship should reflect Act I choices');
  assert.equal(getCityScenePresentation(state).mood, 'aurora', 'Line 9 route should visibly alter the Live City Feed');
  const core = ['failing-grid', 'mara-intake', 'hospital-appeal', 'ration-ledger', 'storehouse-manifest', 'ration-audit', 'heat-theft', 'quill-archive-request', 'maintenance-shift-log', 'census-of-missing', 'night-watch-climax'];
  let prevIndex = -1;
  for (const id of core) {
    const idx = mainline.indexOf(id);
    assert.ok(idx > prevIndex, `Core beat ${id} should stay in order; observed ${mainline.join(' -> ')}`);
    prevIndex = idx;
  }

  // Consequence path: blackout is followed by its direct aftermath before the core resumes.
  let blackout = engine.createNewGame();
  blackout = engine.resolveChoice(blackout, EVENT_BY_ID['failing-grid'], 'blackout');
  assert.equal(blackout.currentEventId, 'blackout-aftermath', 'Blackout choice must bring its immediate aftermath first');
  blackout = engine.resolveChoice(blackout, EVENT_BY_ID['blackout-aftermath'], 'restore-lights');
  assert.ok(blackout.flags.includes('lights-restored'), 'Restoration choice should be recorded');
  assert.equal(getCityScenePresentation(blackout).mood, 'recovery', 'Restored district should have a recovery scene');
  assert.notEqual(blackout.currentEventId, 'blackout-aftermath', 'Resolved blackout aftermath must not repeat');


  const runAlternateRoute = (openingChoice, overrides, maxTurns = 30) => {
    let routeState = engine.createNewGame();
    routeState = engine.resolveChoice(routeState, EVENT_BY_ID['failing-grid'], openingChoice);
    const path = ['failing-grid'];
    for (let turn = 0; turn < maxTurns && routeState.status === 'playing' && !routeState.flags.includes('act-one-complete'); turn++) {
      const event = EVENT_BY_ID[routeState.currentEventId];
      assert.ok(event, `${openingChoice} route has missing event ${routeState.currentEventId}`);
      path.push(event.id);
      routeState = step(routeState, 1, overrides);
    }
    assert.ok(routeState.flags.includes('act-one-complete'), `${openingChoice} route should reach Act I climax; path: ${path.join(' -> ')}, status: ${routeState.status}`);
    assert.equal(routeState.currentEventId, 'signal-below', `${openingChoice} route should converge at Line 9`);
    return { state: routeState, path };
  };

  // A grid reroute has a distinct political/evidence route but must still converge.
  const rerouteOverrides = {
    ...preferredChoices,
    'failing-grid': 'reroute',
    'mara-intake': 'brief-security',
    'council-evacuation-draft': 'reject-evacuation',
    'west-temperature-map': 'restrict-map',
    'hospital-appeal': 'deny',
    'ration-ledger': 'quiet',
    'storehouse-manifest': 'suppress-manifest',
    'heat-theft': 'legalise',
    'census-of-missing': 'trace-jorel',
  };
  const reroute = runAlternateRoute('reroute', rerouteOverrides);
  assert.ok(reroute.state.flags.includes('grid-rerouted'));
  assert.ok(reroute.state.story.evidence.includes('west-grid-temperature-map'));

  // The blackout route includes several immediate character/crisis scenes and must also converge.
  const blackoutOverrides = {
    ...preferredChoices,
    'failing-grid': 'blackout',
    'blackout-aftermath': 'restore-lights',
    'council-evacuation-draft': 'reject-evacuation',
    'ilya-clinic-visit': 'clinic-reserve',
    'frost-witness': 'let-witness-leave',
    'vale-night-patrol': 'patrol-liaisons',
    'mara-intake': 'brief-openly',
    'west-temperature-map': 'restrict-map',
    'hospital-appeal': 'deny',
    'ration-ledger': 'quiet',
    'storehouse-manifest': 'suppress-manifest',
    'ration-audit': 'council-audit',
    'heat-theft': 'repair',
    'census-of-missing': 'publish-census',
  };
  const blackoutRoute = runAlternateRoute('blackout', blackoutOverrides, 35);
  assert.ok(blackoutRoute.state.flags.includes('lights-restored'));
  assert.ok(blackoutRoute.path.includes('ilya-clinic-visit'));

  // Content completeness and choice structure.
  const actOneIds = [
    'mara-intake', 'west-temperature-map', 'council-evacuation-draft', 'ilya-clinic-visit',
    'vale-night-patrol', 'storehouse-manifest', 'frost-witness', 'quill-archive-request',
    'ration-audit', 'census-of-missing', 'maintenance-shift-log', 'night-watch-climax',
  ];
  for (const id of actOneIds) {
    const event = EVENT_BY_ID[id];
    assert.ok(event, `Act I scene ${id} exists`);
    assert.ok(event.choices.length >= 2, `${id} has at least two choices`);
  }
  assert.ok(EVENTS.length >= 37, `Expected the campaign to include Act I content; found ${EVENTS.length} events`);

  console.log(JSON.stringify({
    ok: true,
    eventCount: EVENTS.length,
    mainline,
    actOneCompleted: true,
    nextChapterEvent: state.currentEventId,
    blackoutFollowUpVerified: true,
    rerouteConverged: true,
    blackoutRouteConverged: true,
    resourceBoundsVerified: true,
  }, null, 2));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
