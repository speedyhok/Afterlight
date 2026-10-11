import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-decision-depth-'));
try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp, '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'), path.join(root, 'src/game/storyState.ts'),
    path.join(root, 'src/game/events.ts'), path.join(root, 'src/game/engine.ts'),
  ], { stdio: 'pipe' });
  const require = createRequire(import.meta.url);
  const engine = require(path.join(temp, 'engine.js'));
  const { EVENT_BY_ID, EVENTS } = require(path.join(temp, 'events.js'));

  const findChoice = (eventId, choiceId) => {
    const event = EVENT_BY_ID[eventId];
    assert.ok(event, `event ${eventId} exists`);
    const choice = event.choices.find((candidate) => candidate.id === choiceId);
    assert.ok(choice, `choice ${eventId}/${choiceId} exists`);
    return { event, choice };
  };

  // Hidden routes require both the right evidence and the relationship standing.
  {
    const { choice } = findChoice('storehouse-manifest', 'community-audit-network');
    const state = engine.createNewGame();
    assert.equal(engine.isChoiceAvailable(state, choice), false, 'community audit stays hidden without ledger evidence');
    state.story.evidence.push('ration-diversion-ledger');
    state.story.relationships.ilya = 4;
    assert.equal(engine.isChoiceAvailable(state, choice), false, 'community audit stays hidden below Ilya trust threshold');
    state.story.relationships.ilya = 5;
    assert.equal(engine.isChoiceAvailable(state, choice), true, 'community audit unlocks with evidence plus Ilya trust');
  }
  {
    const { choice } = findChoice('mara-black-box', 'replay-clock-edge');
    const state = engine.createNewGame();
    state.story.evidence.push('maintenance-routing-anomaly');
    state.story.relationships.mara = 4;
    assert.equal(engine.isChoiceAvailable(state, choice), false, 'clock replay requires Mara trust');
    state.story.relationships.mara = 5;
    assert.equal(engine.isChoiceAvailable(state, choice), true, 'clock replay unlocks with evidence and Mara trust');
  }
  {
    const { choice } = findChoice('jorel-trail', 'cross-check-transfer');
    const state = engine.createNewGame();
    state.story.evidence.push('maintenance-routing-anomaly');
    state.story.relationships.ilya = 8;
    assert.equal(engine.isChoiceAvailable(state, choice), true, 'transfer cross-check unlocks when relationship and evidence qualify');
  }
  {
    const { choice } = findChoice('proof-of-veil', 'third-party-replication');
    const state = engine.createNewGame();
    state.story.evidence.push('weather-station-drive');
    state.story.relationships.elias = 7;
    assert.equal(engine.isChoiceAvailable(state, choice), false, 'third-party replication requires Elias trust');
    state.story.relationships.elias = 8;
    assert.equal(engine.isChoiceAvailable(state, choice), true, 'third-party replication unlocks with data and trust');
  }

  // A delayed result must change the options available at the later public hearing.
  {
    const { choice: communityChoice } = findChoice('public-hearing', 'community-ledger-testimony');
    const { choice: leakChoice } = findChoice('public-hearing', 'authenticate-leaked-manifest');
    const state = engine.createNewGame();
    assert.equal(engine.isChoiceAvailable(state, communityChoice), false, 'community testimony remains hidden before corroboration');
    assert.equal(engine.isChoiceAvailable(state, leakChoice), false, 'leak authentication remains hidden before the copy leaks');
    state.flags.push('community-audit-corroborated');
    state.story.evidence.push('clerk-deposition-hidden', 'audit-chain-of-custody');
    state.story.relationships.ilya = 10;
    assert.equal(engine.isChoiceAvailable(state, communityChoice), true, 'community corroboration unlocks the later hearing option');
    assert.equal(engine.isChoiceAvailable(state, leakChoice), false, 'community path does not expose the suppression-only hearing option');
    state.flags = state.flags.filter((flag) => flag !== 'community-audit-corroborated');
    state.flags.push('manifest-copy-leaked');
    state.story.relationships.ilya = -3;
    assert.equal(engine.isChoiceAvailable(state, leakChoice), true, 'leaked evidence unlocks authentication even when trust is low');
  }

  // The delayed community audit is a real scheduled effect, not only text on a choice.
  {
    const { event } = findChoice('storehouse-manifest', 'community-audit-network');
    const state = engine.createNewGame();
    state.story.evidence.push('ration-diversion-ledger');
    state.story.relationships.ilya = 8;
    state.currentEventId = event.id;
    const opened = engine.resolveChoice(state, event, 'community-audit-network');
    assert(opened.flags.includes('community-audit-network'), 'community audit decision is recorded');
    assert(opened.pending.some((effect) => effect.id === 'storehouse-manifest-community-audit-network-1'), 'delayed corroboration is queued');
    let tick = opened;
    const clockEvent = EVENT_BY_ID['failing-grid'];
    for (let i = 0; i < 2; i++) tick = engine.resolveChoice({ ...tick, currentEventId: clockEvent.id }, clockEvent, 'reroute');
    assert(tick.flags.includes('community-audit-corroborated'), 'delayed corroboration flag fires after its due cycle');
    assert(tick.story.evidence.includes('clerk-deposition-hidden'), 'delayed corroboration adds the witness deposition');
    assert(engine.isChoiceAvailable(tick, EVENT_BY_ID['public-hearing'].choices.find((choice) => choice.id === 'community-ledger-testimony')), 'delayed corroboration unlocks its later public hearing option');
    assert.equal(tick.pending.some((effect) => effect.id === 'storehouse-manifest-community-audit-network-1'), false, 'resolved effect leaves the pending queue');
  }

  // Suppressing the manifest causes a later leak, so the quiet option is not consequence-free.
  {
    const { event } = findChoice('storehouse-manifest', 'suppress-manifest');
    let state = engine.createNewGame();
    state.currentEventId = event.id;
    state = engine.resolveChoice(state, event, 'suppress-manifest');
    assert(state.pending.some((effect) => effect.setFlags?.includes('manifest-copy-leaked')), 'suppression schedules the leak consequence');
    const clockEvent = EVENT_BY_ID['failing-grid'];
    for (let i = 0; i < 2; i++) state = engine.resolveChoice({ ...state, currentEventId: clockEvent.id }, clockEvent, 'reroute');
    assert(state.flags.includes('manifest-copy-leaked'), 'sealed manifest leaks after the delay');
    assert(state.story.evidence.includes('clerk-deposition-hidden'), 'leak produces recoverable evidence');
    assert(engine.isChoiceAvailable(state, EVENT_BY_ID['public-hearing'].choices.find((choice) => choice.id === 'authenticate-leaked-manifest')), 'delayed leak unlocks its later authentication option');
  }

  assert.equal(EVENTS.length, new Set(EVENTS.map((event) => event.id)).size, 'event IDs remain unique');
  console.log(JSON.stringify({ ok: true, relationshipAndEvidenceGates: true, delayedConsequencesVerified: true, hiddenRoutes: ['community-audit-network', 'replay-clock-edge', 'cross-check-transfer', 'third-party-replication', 'community-ledger-testimony', 'authenticate-leaked-manifest'], delayedConsequences: ['community-audit-corroborated', 'manifest-copy-leaked'], totalEvents: EVENTS.length }, null, 2));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
