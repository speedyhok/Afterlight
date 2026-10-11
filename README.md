# AFTERLIGHT — Source Campaign v0.22.0

AFTERLIGHT is a decision-driven survival narrative about Vesper, a city kept alive beneath a sky that never brightens. The canonical project is the React + TypeScript + Vite source code. It includes a playable five-act campaign, six outcome paths, five bounded resources, character standing, evidence and confirmed truths, district conditions, delayed consequences, local saving, the City Status dossier, and story-dependent Live City Feed states, illustrated character portraits with expression changes, context-aware dialogue beats in major scenes, relationship-gated investigation options, delayed evidence consequences, an opt-in Web Audio soundscape, and event-aware audio cues.

## Run locally

Requirements: Node.js 20+ and npm.

```bash
npm install
npm run dev
```

Create and preview a production build:

```bash
npm run build
npm run preview
```

The production Vite build is configured for the GitHub Pages project URL `/Afterlight/`. Local development remains served from `/`.

## Campaign currently implemented

### Act I — The Last Warm District

A controlled mainline runs from the failing grid through the hospital, ration records, maintenance logs, missing-person census, and Night Watch climax. Blackout, grid-reroute, and character/crisis branches change resources, relationships, and evidence while converging on the Line 9 discovery.

### Act II — A City Divided

Investigate or seal Line 9, encounter the northern traveller, follow archive, contingency, black-box, Jorel cargo, and hidden-depot records where eligible, then reach a public hearing and winter vote. Different decisions alter standing, evidence, costs, and optional scenes. The vote opens the ridge route; it does not by itself prove Jorel survived.

### Act III — The Signal Beneath the Ice

Prepare the expedition, choose the ridge route, survive a possible whiteout, recover data from weather station K-17, and make contact with Hearth-9. Station and settlement records confirm Jorel was alive and assigned to the outer relay 36 hours before contact. If the player preserved and investigated the Line 9 path, they can answer Jorel's maintenance code and confirm he is still transmitting. This does not establish his exact current location or guarantee a physical reunion.

### Act IV — The Architecture of Night

Reach the hidden Northworks facility, face Mara's old override, review Nadia's archive, choose an authenticated or manual relay lock, and coordinate work between Vesper and Hearth-9. Orbital telemetry and the veil model connect the First Night to DAWNLINE's autonomous security rules. Mirror calibration and a test pulse determine whether the narrow light corridor is safe. A failed test can still reach the political vote if the shutdown contains the damage.

### Act V — Afterlight

Choose a final coalition, decide whether to extract Jorel, request a search, or keep the outer relay staffed, then commit to one of six campaign outcomes. The First Morning requires a successful test pulse, signed settlement compact, human interlock, shared-control truths, sufficient reserves, and engineering coalition. The other endings preserve artificial dawn, transfer authority to a civilian assembly, impose permanent security control, evacuate beyond the ridge, or trigger the catastrophic Last Light outcome.

## Project structure

- `src/App.tsx` — interface, one-click decision flow, Live City Feed, status, history, settings, ending screens.
- `src/index.css` — responsive visual system, atmospheric scene, resource meters, decision reactions, character panels, and reduced-motion rules.
- `src/game/types.ts` — campaign and resource types.
- `src/game/events.ts` — structured event content and decision options.
- `src/game/engine.ts` — event selection, state transitions, delayed effects, endings, and save/load.
- `src/game/storyState.ts` — character relationships, evidence, truths, districts, and save normalization.
- `src/game/cityScene.ts` — state-to-scene presentation mapping.
- `src/game/audio.ts` — lazy-initialized Web Audio ambience, radio/decision cues, and cue classification.
- `src/game/characterBeats.ts` — presentation-only dialogue beats and relationship-reactive expression selection.
- `src/components/CharacterPortrait.tsx` — original SVG character portrait illustrations reused in scenes, the dossier, and endings.
- `docs/STORY_BIBLE.md` — canon, characters, reveal order, and endings.
- `docs/STORY_DEPENDENCY_MAP.md` and `docs/story-event-map.json` — event prerequisites and campaign structure.

## Validation

Run the story map and all act-level campaign regression checks:

```bash
npm run test:campaign
```

Individual checks are also available: `npm run validate:story`, `npm run test:act-one`, `npm run test:act-two`, `npm run test:act-three`, `npm run test:act-four`, `npm run test:act-five`, `npm run test:characters`, `npm run test:city-scene`, `npm run test:decision-depth`, and `npm run test:audio`.

The machine-readable story map is a planning contract, not a claim that all 123 nodes are individually playable. The current map includes 83 implemented event records, six implemented ending outcomes, and 34 planned optional nodes. All five acts have playable sequences through a campaign ending.

Resources remain bounded to 0–100. Decisions resolve on the first click and autosave locally after each choice. Energy and food upkeep remains active, so neglecting supplies can still cause a legitimate failure before a story climax.

## v0.19 city presentation

- Story-reactive city detail overlays: blackouts, mirror fractures, industrial smoke, civil unrest, greenhouse recovery, signal anomalies, expedition weather, pulse events, and the unstable early light seam.
- Reserve-pressure overlays highlight up to two most critical resources at once.
- The transient `dawn-reached` story flag shows an unstable light seam; the full dawn city scene is reserved for the confirmed `ending-first-morning` outcome.


## v0.20 decision depth

- Added evidence- and relationship-gated choices to the ration manifest, Mara's black-box investigation, Jorel's transfer trail, and the joint veil analysis. These options appear only when the relevant evidence and character standing have been earned.
- Suppressing the ration manifest schedules a later leak and a public-order cost; the leak also exposes a hidden clerk deposition. Building a community audit network instead costs immediate supplies and calm, then can earn corroboration on a later cycle.
- A trusted replay of the black-box clock edge can produce the nine-hour latency table after independent readings return. A third-party veil replication can likewise arrive later with peer-reviewed evidence and the confirmed maintained-veil truth.
- The delayed corroboration or manifest leak opens different, route-specific testimony choices at the Act II public hearing. This makes the result affect a later decision instead of ending as a notification.
- Added `npm run test:decision-depth` to validate relationship/evidence gates, later hearing unlocks, and prove that delayed effects are queued, resolved, and removed from the pending list.


## v0.21 audio and cinematic polish

- Added opt-in, synthesized ambience: distant wind and the low-frequency hum of Vesper's power systems.
- Added one-shot decision cues, emergency alarms, radio/static cues for signal-related scenes, a distinct failure tone, and an ascending chime for the confirmed First Morning ending.
- Audio is off by default and is never started on page load. The Web Audio context is created or resumed only after a user interaction; preferences and master volume are stored locally. No external audio files or network requests are needed.
- Added independent ambience and event-cue switches plus a master-volume slider to Settings. Unsupported browsers safely remain silent.
- Added scene/event arrival motion and a subtle radio-channel indicator pulse. These visual transitions respect both the operating-system reduced-motion preference and the in-game reduced-motion setting. Audio controls remain separate from motion settings.
- Added `npm run test:audio` to validate cue selection and verify that creating the audio director is inert until sound is explicitly requested.


## v0.22.0 — Release hardening

- Wrapped saves in an explicit schema-versioned envelope while continuing to read and migrate legacy bare GameState saves under the existing storage key. This preserves existing campaign progress rather than forcing a reset.
- Hardened load normalization for malformed history entries, pending effects, story-effect payloads, missing event IDs, stats, and ending fields. A future unsupported schema is rejected safely instead of being misread as a legacy state.
- Made preference storage defensive: settings continue to work in memory if browser storage is unavailable or throws.
- Added persistence regression tests for legacy-save migration, envelope round-tripping, invalid/future save rejection, bounded resources, and restricted-storage behavior.
- The full production build/browser release check remains pending unless dependencies can be installed and an actual browser session is available.
- An automated guard validates every event-choice delta against the permitted nonzero magnitudes; the integrated route tests carry real Act IV resources through Act V to a completed ending.

- Decision resource impacts follow the allowed magnitudes ±10, ±15, ±20, ±25, ±30, and ±50. `npm run test:decision-magnitudes` guards the full event catalog.
