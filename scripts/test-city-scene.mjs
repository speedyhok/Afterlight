import assert from 'node:assert/strict';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const root = path.resolve(import.meta.dirname, '..');
const temp = os.tmpdir() + path.sep + `afterlight-city-scene-${process.pid}`;
try {
  execFileSync('tsc', [
    '--target', 'ES2020', '--module', 'commonjs', '--outDir', temp,
    '--skipLibCheck', '--lib', 'ES2022,DOM',
    path.join(root, 'src/game/types.ts'),
    path.join(root, 'src/game/storyState.ts'),
    path.join(root, 'src/game/events.ts'),
    path.join(root, 'src/game/engine.ts'),
    path.join(root, 'src/game/cityScene.ts'),
  ], { stdio: 'pipe' });

  const require = createRequire(import.meta.url);
  const { createNewGame } = require(path.join(temp, 'engine.js'));
  const { getCityScenePresentation, getCityResourcePressures } = require(path.join(temp, 'cityScene.js'));
  const base = createNewGame();

  assert.equal(getCityScenePresentation(base).mood, 'default', 'new campaign starts under the long night');

  const blackout = structuredClone(base);
  blackout.stats = { population: 70, energy: 18, food: 72, order: 70, technology: 60 };
  assert.equal(getCityScenePresentation(blackout).mood, 'blackout', 'low energy changes the visible city mood');

  const unrest = structuredClone(base);
  unrest.stats = { population: 70, energy: 75, food: 70, order: 22, technology: 60 };
  assert.equal(getCityScenePresentation(unrest).mood, 'unrest', 'low public order changes the visible city mood');

  const greenhouse = structuredClone(base);
  greenhouse.flags = ['greenhouse-network-live'];
  assert.equal(getCityScenePresentation(greenhouse).mood, 'greenhouse', 'greenhouse recovery is represented in the city');

  const transientLight = structuredClone(base);
  transientLight.flags = ['dawn-reached'];
  assert.equal(getCityScenePresentation(transientLight).mood, 'light-seam', 'early unstable light is not shown as full dawn');
  const confirmedDawn = structuredClone(base);
  confirmedDawn.flags = ['ending-first-morning'];
  assert.equal(getCityScenePresentation(confirmedDawn).mood, 'dawn', 'only the confirmed First Morning ending shows full dawn');

  assert.deepEqual(getCityResourcePressures({ population: 80, energy: 80, food: 80, order: 80, technology: 80 }), [], 'healthy reserves add no pressure overlays');
  assert.deepEqual(getCityResourcePressures({ population: 24, energy: 20, food: 65, order: 18, technology: 68 }), ['order', 'energy'], 'the two lowest pressured reserves are emphasized');
  assert.deepEqual(getCityResourcePressures({ population: 34, energy: 66, food: 22, order: 70, technology: 23 }), ['food', 'technology'], 'food and technology pressure can be emphasized together');

  const app = fs.readFileSync(path.join(root, 'src/App.tsx'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'src/index.css'), 'utf8');
  for (const token of ['detail-blackout', 'detail-fracture', 'detail-smoke', 'detail-unrest', 'detail-greenhouse', 'detail-signal', 'detail-light-event', 'detail-expedition']) {
    assert(app.includes(token), `missing city visual layer ${token}`);
  }
  for (const token of ['city-scene-details', 'city-warning-blink', 'city-smoke-rise', 'prefers-reduced-motion', 'reduced-motion']) {
    assert(css.includes(token), `missing city animation/accessibility style ${token}`);
  }
  console.log('City scene validation passed: story moods, reserve-pressure overlays, transient light seam, confirmed dawn gate, and reduced-motion styling.');
} finally {
  try { fs.rmSync(temp, { recursive: true, force: true }); } catch {}
}
