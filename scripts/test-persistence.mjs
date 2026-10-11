import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-persistence-'));
const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
const values = new Map();
const storage = {
  getItem(key) { return values.has(key) ? values.get(key) : null; },
  setItem(key, value) { values.set(key, String(value)); },
  removeItem(key) { values.delete(key); },
};
Object.defineProperty(globalThis, 'localStorage', { configurable: true, writable: true, value: storage });

try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp,
    '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'), path.join(root, 'src/game/storyState.ts'),
    path.join(root, 'src/game/events.ts'), path.join(root, 'src/game/engine.ts'),
    path.join(root, 'src/game/preferences.ts'),
  ], { stdio: 'pipe' });

  const require = createRequire(import.meta.url);
  const engine = require(path.join(temp, 'engine.js'));
  const preferences = require(path.join(temp, 'preferences.js'));
  const { STORAGE_KEY, SAVE_SCHEMA_VERSION } = engine;

  // New saves use a versioned envelope and survive a complete read/write round trip.
  values.clear();
  const fresh = engine.createNewGame();
  assert.equal(engine.saveGame(fresh), true);
  const envelope = JSON.parse(values.get(STORAGE_KEY));
  assert.equal(envelope.schemaVersion, SAVE_SCHEMA_VERSION);
  assert.equal(envelope.state.currentEventId, 'failing-grid');
  const loaded = engine.loadGame();
  assert.equal(loaded.day, fresh.day);
  assert.equal(loaded.stats.energy, fresh.stats.energy);
  assert.equal(loaded.story.relationships.mara, 0);

  // Legacy bare GameState save: absent narrative state is rebuilt from available history and flags.
  values.clear();
  const legacy = engine.createNewGame();
  delete legacy.story;
  legacy.day = 4;
  legacy.stats.energy = 140;
  legacy.flags = ['signal-decoded'];
  legacy.history = [{
    day: 1, eventId: 'failing-grid', eventTitle: 'Grid',
    choiceLabel: 'Bring the engineers together', deltas: { energy: 10 },
  }, { day: 'bad', eventId: 42 }];
  legacy.pending = [{
    id: 'legacy-delay', dueDay: 6, deltas: { order: 15 }, message: 'A delayed report arrived.',
    setFlags: ['delayed-report-arrived'],
    storyEffects: { relationships: { ilya: 20, invalidCharacter: 100 }, meetCharacters: ['mara', 'invalidCharacter'], discoverEvidence: ['delayed-report'] },
  }, { id: null, dueDay: 'bad', message: 'Malformed entry', deltas: {} }];
  values.set(STORAGE_KEY, JSON.stringify(legacy));
  const migrated = engine.loadGame();
  assert.ok(migrated, 'legacy save migrates');
  assert.equal(migrated.day, 4);
  assert.equal(migrated.stats.energy, 100, 'resources are clamped on load');
  assert.ok(migrated.story.evidence.includes('dawnline-schedule'), 'legacy flags recover known evidence');
  assert.equal(migrated.history.length, 1, 'malformed history entries are dropped');
  assert.equal(migrated.pending.length, 1, 'valid pending consequences survive migration while malformed ones are dropped');
  assert.equal(migrated.pending[0].storyEffects.meetCharacters.includes('invalidCharacter'), false, 'invalid character references are removed');
  assert.equal(JSON.parse(values.get(STORAGE_KEY)).schemaVersion, SAVE_SCHEMA_VERSION, 'legacy save rewritten as envelope');

  // Unsupported future saves and corrupt JSON are rejected without throwing.
  values.set(STORAGE_KEY, JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION + 1, state: fresh }));
  assert.equal(engine.loadGame(), null);
  values.set(STORAGE_KEY, '{not json');
  assert.equal(engine.loadGame(), null);

  // Defensive preference wrappers tolerate browser storage that throws or is unavailable.
  assert.equal(preferences.setLocalPreference('test', 'true'), true);
  assert.equal(preferences.getLocalPreference('test'), 'true');
  assert.equal(preferences.removeLocalPreference('test'), true);
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('storage blocked'); } });
  assert.equal(preferences.getLocalPreference('x'), null);
  assert.equal(preferences.setLocalPreference('x', 'y'), false);
  assert.equal(preferences.removeLocalPreference('x'), false);
  assert.equal(engine.saveGame(fresh), false, 'game save fails safely when storage is blocked');
  assert.equal(engine.loadGame(), null, 'loading fails safely when storage is blocked');

  console.log(JSON.stringify({ ok: true, versionedRoundTrip: true, legacyMigration: true, corruptionHandling: true, restrictedStorageSafe: true }, null, 2));
} finally {
  if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
  else delete globalThis.localStorage;
  fs.rmSync(temp, { recursive: true, force: true });
}
