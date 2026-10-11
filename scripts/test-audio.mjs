import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'afterlight-audio-'));
try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp,
    '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'), path.join(root, 'src/game/audio.ts'),
  ], { stdio: 'pipe' });
  const require = createRequire(import.meta.url);
  const { AfterlightAudio, classifyDecisionCue } = require(path.join(temp, 'audio.js'));

  assert.equal(classifyDecisionCue('grid-allocation', { energy: 15 }, []), 'decision-positive');
  assert.equal(classifyDecisionCue('grid-allocation', { energy: -15 }, []), 'decision-negative');
  assert.equal(classifyDecisionCue('grid-allocation', { energy: 15, order: -10 }, []), 'decision-mixed');
  assert.equal(classifyDecisionCue('line-9-signal', { energy: 0 }, []), 'radio');
  assert.equal(classifyDecisionCue('blackout-emergency', {}, []), 'alarm');
  assert.equal(classifyDecisionCue('final-choice', {}, ['ending-first-morning']), 'dawn');
  assert.equal(classifyDecisionCue('final-choice', {}, ['ending-last-light']), 'failure');
  assert.equal(classifyDecisionCue('quiet-archive', { energy: 0 }, []), 'none');

  // The director must remain inert until an explicit user action requests sound.
  const director = new AfterlightAudio();
  assert.equal(director.isInitialised, false, 'constructor does not create an audio context');
  director.play('none');
  director.setAmbience(false);
  assert.equal(director.isInitialised, false, 'disabled ambience and no-op cues do not initialise audio');
  director.unlock(); // Safe in a non-browser environment.
  assert.equal(director.isInitialised, false, 'unlock safely no-ops when Web Audio is unavailable');

  console.log(JSON.stringify({ ok: true, cueClassification: true, lazyAudioContext: true, unsupportedBrowserSafe: true }, null, 2));
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
