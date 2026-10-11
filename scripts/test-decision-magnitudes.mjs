import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-delta-rules-'));
try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp,
    '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'), path.join(root, 'src/game/events.ts'),
    path.join(root, 'src/game/storyState.ts'), path.join(root, 'src/game/engine.ts'),
  ], { stdio: 'pipe' });
  const require = createRequire(import.meta.url);
  const { EVENTS } = require(path.join(temp, 'events.js'));
  const approved = new Set([10, 15, 20, 25, 30, 50, -10, -15, -20, -25, -30, -50]);
  const exceptions = [];
  let choicesChecked = 0;
  for (const event of EVENTS) {
    for (const choice of event.choices) {
      choicesChecked += 1;
      for (const [resource, value] of Object.entries(choice.deltas ?? {})) {
        if (typeof value === 'number' && value !== 0 && !approved.has(value)) exceptions.push(`${event.id}/${choice.id}: ${resource} ${value}`);
      }
    }
  }
  assert.deepEqual(exceptions, [], `resource impact magnitudes must follow the game rule:\n${exceptions.join('\n')}`);
  console.log(JSON.stringify({ ok: true, choicesChecked, allowedResourceMagnitudesOnly: true }, null, 2));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
