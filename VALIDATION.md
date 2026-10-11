# AFTERLIGHT v0.22.0 — Validation

## Campaign regression coverage

Run all source campaign checks with:

```bash
npm run test:campaign
```

This validates the story dependency map, Act I mainline and branch convergence, Act II investigation/sealed-signal routes, Act III expedition and survival evidence, Act IV relay lock and safe/unsafe test pulse branches, all six Act V ending conditions including the coordinated-reset gate, character references, city presentation, delayed consequences, optional audio, save migration, and decision-resource magnitude rules.

## Decision-feedback implementation

v0.17 adds transient reactions driven by the existing decision history and resource deltas. It does not change resource arithmetic, event selection, story prerequisites, or ending conditions. Resource tiles briefly signal positive or negative changes; the city scene shows a restrained matching flash; the incoming event and choices enter with a short transition. The reaction ends automatically and does not replay when navigating away and back. Both the system reduced-motion preference and the in-game reduced-motion toggle disable these animations.

## Baseline evidence and current limitations

- The v0.16 baseline campaign checks passed before the v0.17 and v0.18 presentation work. The v0.18 campaign suite was rerun after adding the character layer. The v0.19 campaign suite also includes city-scene mood, reserve-pressure, and confirmed-dawn checks.
- `npm run test:campaign` runs 12 validation commands: story-map validation, all five act-level test suites, character-beat references, city-scene state and dawn gates, evidence/delayed consequences, audio behavior, versioned-save migration/restricted-storage checks, and the full 241-choice resource-magnitude guard.
- The strict TypeScript check for the core game modules passed, and `src/App.tsx` plus `src/main.tsx` passed TypeScript syntax transpilation. The full production build has **not** been verified: React, React DOM, Lucide React, Vite, and their type declarations are absent. The dependency install timed out, and an offline install confirmed the required packages are not cached. Do not treat this as a successful production build.
- The live GitHub repository/workflow could not be inspected through the connected repository tool in this session; GitHub returned 404 for `speedyhok/Afterlight`. The source's production Vite base is set to `/Afterlight/` for the repository's project Pages path, but the remote deployment workflow still needs to be checked in GitHub.
- Browser-level visual testing is still required on desktop and mobile. The automated story tests do not simulate a full graphical playthrough.

## Character presentation implementation

v0.18 adds six original inline-SVG character portrait illustrations for Mara Venn, Ilya Sen, Soren Vale, Elias Rook, Nadia Quill, and Jorel Sen. The portraits support distinct expressions selected per scene, with relationship standing able to shift some expressions toward guarded or more trusting reactions. A new presentation-only table adds authored dialogue and channel labels to 89 mapped story and ending scenes, with character art reused in the story dossier and ending epilogues. It does not add event prerequisites, mutate story flags, change any decision deltas, or alter ending resolution.

The new `npm run test:characters` check verifies that every character-beat mapping points to a real event, has dialogue/channel text, and covers all six recurring characters. This is code-level validation; browser-level visual testing and the full Vite production build are still outstanding because dependencies are not installed in this environment.


## v0.19.0 — Living city scene

- Added an independent SVG detail layer to render state-specific visual cues for blackout, mirror fracture, industrial smoke, civic unrest, district recovery, greenhouses, signal detection, expedition weather, test pulses, and the final dawn corridor.
- Added low-reserve scene accents for Population, Energy, Food, Public Order, and Technology; at most the two lowest qualifying resources are shown, avoiding excess visual noise. These are presentation-only and never mutate game state.
- Corrected the distinction between the transient `dawn-reached` flag (unstable light seam) and the confirmed `ending-first-morning` state (full dawn).
- Added `scripts/test-city-scene.mjs`, included in `npm run test:campaign`.
- Campaign regression, story map, character beat, and city scene checks all passed in this environment. The full Vite production build and real-browser visual inspection remain unverified because React/Vite packages were not installed for this source snapshot.


## v0.20.0 — Evidence-gated decisions and delayed consequences

- Added `Choice.requiresRelationship`, evaluated alongside the existing flag, evidence, truth, and resource requirements. Hidden choices are not rendered unless all prerequisites are met.
- Added four conditional investigation options: community chain of custody, trusted black-box clock replay, Jorel transfer cross-check, and third-party veil replication. They require specific evidence and/or character standing; they do not alter the story's main event sequence.
- The choice to suppress the original ration manifest now schedules a delayed leak with a later public-order cost and a hidden clerk deposition. The community-audit path instead schedules later corroboration, evidence, and a public-order recovery.
- The black-box replay can add the nine-hour latency evidence after a delayed independent clock correlation. The third-party veil review can add peer-reviewed evidence and the maintained-veil truth after the review completes.
- Delayed ration-audit outcomes are carried into the Act II public hearing: corroborated community testimony and an authenticated leak are distinct conditional choices with different resource and relationship costs.
- `scripts/test-decision-depth.mjs` verifies relationship/evidence gates, later hearing unlocks, and checks that delayed effects execute on their due cycle, update flags/evidence, and leave the pending queue. `npm run test:campaign` passes all nine validation groups, including this suite.
- The full Vite production build and browser UI testing remain unverified in this source environment because the React/Vite dependency install timed out. Do not treat source-level tests as a substitute for checking the production bundle in a dependency-enabled environment.


## v0.21.0 — Audio and cinematic polish

- Added `src/game/audio.ts`, a generated Web Audio ambience/cue layer. It does not request external assets. Audio remains off by default; the AudioContext is lazily created/resumed following a player interaction, allowing browser autoplay restrictions to be respected.
- City ambience (filtered wind plus low engine hum), decision feedback tones, radio static/chimes for signal-related scenes, emergency alarms, ending failure tones, and an ascending First Morning chime can be toggled independently through Settings. A local master-volume setting applies to ambience and cues.
- Audio preferences and volume use localStorage, but no audio plays at initialization. On a browser that suspends contexts across visits, the saved choice resumes on the first user interaction. Browsers without Web Audio fail silently.
- Added scene/event arrival transitions and a restrained radio indicator animation; reduced-motion styling disables these animations.
- Added `scripts/test-audio.mjs` to test cue prioritization, resource delta classification, lazy audio initialization, no-op cues, and safe behavior without browser audio APIs.
- `npm run test:campaign` passes, including the new audio suite. Strict TypeScript checks pass for the game modules, and React/TSX files pass transpilation syntax checks. The full Vite production build and browser-based audio playback remain unverified because React/Vite dependencies are not installed in this environment; install dependencies and verify playback/build in a browser before release.


## v0.22.0 — Save and release hardening

- Saves are written as `{ schemaVersion: 2, state }` under the established `afterlight-save-v01` key. Legacy bare-state saves remain readable and are migrated to the envelope after successful load.
- Load validation bounds resource values, reconstructs missing narrative state from available history, drops malformed history/pending entries, repairs missing current event IDs, and safely rejects unsupported future schema versions.
- Preference reads/writes/removals are wrapped so disabled browser storage cannot crash the interface.
- Added `scripts/test-persistence.mjs` to exercise legacy migration, versioned round trips, corrupt/future saves, and unavailable storage.

- The dependency install attempt timed out and did not leave a usable `node_modules` tree. `npm run build` was attempted but stopped at missing React, Lucide, Vite, and type packages; the production bundle is not verified in this environment.
- A `.gitignore` now excludes dependencies, build output, local caches, editor files, and logs. `docs/RELEASE_CHECKLIST.md` lists the remaining dependency/build/browser checks and explains that a lockfile must be generated and committed when npm registry access is available.

- Normalized 93 legacy ±5 immediate decision resource changes to ±10 while preserving direction; removed redundant Energy costs from the council compact, final vote, and automatic safety-abort choices after full-route testing showed those costs could cause premature failure. Added `scripts/test-decision-magnitudes.mjs`, which verifies 241 choices use only permitted nonzero resource deltas. The complete campaign suite passes after these balance corrections, including an integrated Act IV → Act V path that carries actual resources into and completes The First Morning.
