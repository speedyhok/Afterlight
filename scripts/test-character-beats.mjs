import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-character-check-'));
try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp,
    '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'),
    path.join(root, 'src/game/characterBeats.ts'),
    path.join(root, 'src/game/events.ts'),
  ], { stdio: 'pipe' });

  const require = createRequire(import.meta.url);
  const { EVENTS } = require(path.join(temp, 'events.js'));
  const { getCharacterBeat, moodForStanding } = require(path.join(temp, 'characterBeats.js'));
  const eventIds = new Set(EVENTS.map((event) => event.id));
  const endingKeys = new Set(['ending-first-morning', 'ending-eternal-city', 'ending-peoples-dawn', 'ending-iron-winter', 'ending-beyond-ridge', 'ending-last-light']);
  const source = fs.readFileSync(path.join(root, 'src/game/characterBeats.ts'), 'utf8');
  const mappedIds = [...source.matchAll(/^\s*'([^']+)':\s*\{\s*character:/gm)].map((match) => match[1]);
  const represented = new Set();

  assert.ok(mappedIds.length >= 60, `Expected at least 60 authored character beats, got ${mappedIds.length}`);
  assert.equal(new Set(mappedIds).size, mappedIds.length, 'Character beat event IDs must be unique');
  for (const id of mappedIds) {
    assert.ok(eventIds.has(id) || endingKeys.has(id), `Character beat points to missing event or ending flag: ${id}`);
    const beat = getCharacterBeat(id);
    assert.ok(beat?.line?.trim(), `Character beat ${id} needs dialogue`);
    assert.ok(beat.signal?.trim(), `Character beat ${id} needs a channel label`);
    represented.add(beat.character);
  }
  assert.deepEqual([...represented].sort(), ['elias', 'ilya', 'jorel', 'mara', 'nadia', 'vale']);
  assert.equal(moodForStanding('focused', -50), 'wary', 'very low standing should make a focused character guarded');
  assert.equal(moodForStanding('concerned', 50), 'steady', 'high standing should soften a concerned expression');
  assert.equal(moodForStanding('angry', 50), 'angry', 'relationship standing must not erase a deliberately angry scene expression');
  console.log(`Character beat validation passed: ${mappedIds.length} mapped scenes, ${represented.size} recurring characters, all event references valid.`);
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
