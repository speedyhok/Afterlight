import { EVENTS, EVENT_BY_ID } from './events';
import type { CharacterId, Deltas, DistrictCondition, DistrictId, GameEvent, GameState, HistoryEntry, StatKey, Stats, StoryEffects } from './types';
import { applyStoryEffects, createInitialStoryState, normalizeStoryState } from './storyState';

export const STORAGE_KEY = 'afterlight-save-v01';
export const SAVE_SCHEMA_VERSION = 2;
export const STAT_KEYS: StatKey[] = ['population', 'energy', 'food', 'order', 'technology'];
export const STAT_LABELS: Record<StatKey, string> = {
  population: 'Population', energy: 'Energy', food: 'Food', order: 'Public order', technology: 'Technology',
};

export function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function applyDeltas(stats: Stats, deltas: Deltas): Stats {
  const next = { ...stats };
  for (const key of STAT_KEYS) next[key] = clamp(next[key] + (deltas[key] ?? 0));
  return next;
}

export function formatDelta(value: number | undefined): string {
  if (!value) return '—';
  return `${value > 0 ? '+' : ''}${value}`;
}

const ACT_ONE_SEQUENCE = [
  'failing-grid',
  'mara-intake',
  'hospital-appeal',
  'ration-ledger',
  'storehouse-manifest',
  'ration-audit',
  'heat-theft',
  'quill-archive-request',
  'maintenance-shift-log',
  'census-of-missing',
  'night-watch-climax',
] as const;

const ACT_ONE_URGENT_INTERRUPT_IDS = new Set(['blackout-aftermath', 'mirror-fractures', 'plaza-after-sirens', 'greenhouse-network', 'west-temperature-map']);
const ACT_ONE_INTERRUPT_IDS = [
  'blackout-aftermath', 'mirror-fractures', 'plaza-after-sirens', 'greenhouse-network', 'west-temperature-map',
  'council-evacuation-draft', 'ilya-clinic-visit', 'frost-witness', 'vale-night-patrol',
  'quiet-protest', 'power-broker', 'foundry-fire', 'night-garden', 'greenhouse-mold',
] as const;

function eventRequirementsMet(state: GameState, event: GameEvent): boolean {
  if (event.minDay && state.day < event.minDay) return false;
  if (event.minTechnology !== undefined && state.stats.technology < event.minTechnology) return false;
  if (event.maxTechnology !== undefined && state.stats.technology > event.maxTechnology) return false;
  if (event.requiresFlags?.some((flag) => !state.flags.includes(flag))) return false;
  if (event.requiresAnyFlags?.length && !event.requiresAnyFlags.some((flag) => state.flags.includes(flag))) return false;
  if (event.requiresEvidence?.some((evidence) => !(state.story?.evidence ?? []).includes(evidence))) return false;
  if (event.requiresTruths?.some((truth) => !(state.story?.truths ?? []).includes(truth))) return false;
  if (event.requiresRelationship?.some(({ character, min, max }) => {
    const standing = state.story?.relationships?.[character] ?? 0;
    return (min !== undefined && standing < min) || (max !== undefined && standing > max);
  })) return false;
  if (event.excludesFlags?.some((flag) => state.flags.includes(flag))) return false;
  if (event.once && state.seenEvents.includes(event.id)) return false;
  return true;
}

function actOneInterruptTriggered(state: GameState, eventId: string): boolean {
  const flags = new Set(state.flags);
  switch (eventId) {
    case 'west-temperature-map':
      return flags.has('blackout-policy') || flags.has('grid-rerouted');
    case 'council-evacuation-draft':
      return state.day >= 3 && (state.stats.energy <= 35 || ['blackout-policy', 'blackout-extended', 'evacuation-alert'].some((flag) => flags.has(flag)));
    case 'ilya-clinic-visit':
      return ['blackout-policy', 'blackout-extended', 'hospital-denied', 'shelter-raided'].some((flag) => flags.has(flag));
    case 'frost-witness':
      return flags.has('blackout-extended') || state.stats.order <= 40 || flags.has('unrest-alert');
    case 'vale-night-patrol':
      return state.day >= 4 && (state.stats.order <= 55 || ['security-first', 'blackout-extended', 'unrest-alert'].some((flag) => flags.has(flag)));
    case 'quiet-protest':
      return state.day >= 4 && (state.stats.order <= 45 || ['clerk-punished', 'blackout-extended', 'shelter-raided'].some((flag) => flags.has(flag)));
    case 'power-broker':
      return state.day >= 4 && (state.stats.technology <= 25 || state.stats.energy <= 30);
    case 'foundry-fire':
      return state.day >= 5 && state.stats.energy <= 35;
    case 'night-garden':
      return state.day >= 5 && (state.stats.food <= 25 || state.stats.order <= 30);
    case 'greenhouse-mold':
      return flags.has('garden-funded') || flags.has('garden-closed') || flags.has('seed-vault-saved');
    default:
      // Consequence events with explicit flag gates (blackout, damaged mirrors, plaza, greenhouse network).
      return true;
  }
}

function getActOneNextEvent(state: GameState): GameEvent | undefined {
  if ((state.story?.chapter ?? 1) !== 1 || state.flags.includes('act-one-complete')) return undefined;

  // Consequences and conditional scenes interrupt the core sequence when their cause occurs.
  const interrupt = ACT_ONE_INTERRUPT_IDS
    .map((id) => EVENT_BY_ID[id])
    .filter((event): event is GameEvent => Boolean(event))
    .filter((event) => eventRequirementsMet(state, event) && actOneInterruptTriggered(state, event.id))
    .filter((event) => ACT_ONE_URGENT_INTERRUPT_IDS.has(event.id) || state.day <= 8)
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0))[0];
  if (interrupt) return interrupt;

  for (const id of ACT_ONE_SEQUENCE) {
    if (state.seenEvents.includes(id)) continue;
    const event = EVENT_BY_ID[id];
    if (!event) continue;
    // A blocked dependency means an earlier required beat has not resolved; do not skip ahead.
    if (!eventRequirementsMet(state, event)) return undefined;
    return event;
  }
  return undefined;
}

function getGenericAvailableEvents(state: GameState): GameEvent[] {
  const recent = new Set(state.history.slice(-3).map((entry) => entry.eventId));
  // Never let a chapter-specific scene leak back into the generic pool after its narrative window closes.
  const chapterEvents = new Set<string>([
    ...ACT_ONE_SEQUENCE, ...ACT_ONE_INTERRUPT_IDS, ...ACT_TWO_SEQUENCE, ...ACT_THREE_OPTIONAL_IDS,
    'signal-below', 'signal-echo', 'ridge-map', 'expedition-prep', 'ridge-crossing', 'ridge-whiteout',
    'weather-station', 'jorel-evacuation-record', 'ridge-settlement', 'act-three-outlook', 'outer-relay-briefing',
    'act-four-council', 'dawnline-access', 'mara-override-confession', 'quill-full-archive', 'relay-lock-authenticated', 'relay-lock-manual',
    'jorel-reunion', 'jorel-search-plan', 'gantry-workshop', 'orbital-telemetry', 'veil-model', 'mirror-calibration', 'first-test-pulse',
    'grid-rebuild', 'second-test-window', 'test-pulse-success', 'test-pulse-failure', 'act4-final-vote', 'act-five-briefing',
    'act-five-commitments', 'act-five-jorel-dispatch', 'act-five-final-operation',
  ]);
  const available = EVENTS.filter((event) => {
    if (chapterEvents.has(event.id)) return false;
    if (event.id === state.currentEventId && EVENTS.length > 1) return false;
    if (!eventRequirementsMet(state, event)) return false;
    if (recent.has(event.id) && EVENTS.some((candidate) => candidate.id !== event.id && !candidate.once)) return false;
    return true;
  });
  return available.length ? available : EVENTS.filter((event) => !chapterEvents.has(event.id) && (!event.once || !state.seenEvents.includes(event.id)));
}

const ACT_TWO_SEQUENCE = [
  'outside-voice',
  'northern-visitor-interview',
  'quill-vault-access',
  'vale-contingency-list',
  'mara-black-box',
  'jorel-trail',
  'hidden-depot-access',
  'ledger-second-copy',
  'public-hearing',
  'winter-vote',
] as const;
const ACT_TWO_OPTIONAL = new Set<string>([
  'northern-visitor-interview', 'quill-vault-access', 'vale-contingency-list',
  'mara-black-box', 'hidden-depot-access', 'ledger-second-copy',
]);

function actTwoOptionalEligible(state: GameState, id: string): boolean {
  const flags = new Set(state.flags);
  const evidence = new Set(state.story?.evidence ?? []);
  switch (id) {
    case 'northern-visitor-interview':
      return flags.has('traveller-questioned') || (flags.has('traveller-admitted') && evidence.has('northern-route-map'));
    case 'quill-vault-access':
      return ['archive-access-approved', 'archive-forced', 'independent-audit', 'council-audit'].some((f) => flags.has(f));
    case 'vale-contingency-list':
      return ['patrol-checkpoints', 'security-first', 'evacuation-alert', 'publish-evacuation', 'delegate-evacuation'].some((f) => flags.has(f));
    case 'mara-black-box':
      return evidence.has('maintenance-routing-anomaly') || ['raw-log-preserved', 'log-summary-published', 'raw-log-security'].some((f) => flags.has(f));
    case 'hidden-depot-access':
      return ['manifest-preserved', 'courier-followed', 'manifest-suppressed', 'jorel-route-traced', 'cargo-tag-audit'].some((f) => flags.has(f)) || evidence.has('ration-depot-manifest') || evidence.has('unlisted-relay-manifest') || evidence.has('restricted-relay-routing');
    case 'ledger-second-copy':
      return flags.has('hidden-depot-entered') || evidence.has('northern-route-map') || evidence.has('depot-dispatch-ledger');
    default: return true;
  }
}

function getActTwoNextEvent(state: GameState): GameEvent | undefined {
  if ((state.story?.chapter ?? 1) !== 2 || !state.flags.includes('act-one-complete') || state.flags.includes('act-two-complete')) return undefined;

  // The transmitter is investigated or deliberately abandoned before the political consequences unfold.
  if (!state.seenEvents.includes('signal-below')) return EVENT_BY_ID['signal-below'];
  if (state.flags.includes('signal-investigated') && !state.flags.includes('signal-cut') && !state.flags.includes('signal-decoded') && !state.seenEvents.includes('signal-echo')) {
    const echo = EVENT_BY_ID['signal-echo'];
    if (echo && eventRequirementsMet(state, echo)) return echo;
  }

  for (const id of ACT_TWO_SEQUENCE) {
    if (state.seenEvents.includes(id)) continue;
    const event = EVENT_BY_ID[id];
    if (!event) continue;
    if (ACT_TWO_OPTIONAL.has(id) && !actTwoOptionalEligible(state, id)) continue;
    if (!eventRequirementsMet(state, event)) {
      if (ACT_TWO_OPTIONAL.has(id)) continue;
      return undefined;
    }
    return event;
  }
  return undefined;
}


const ACT_THREE_OPTIONAL_IDS = [
  'remote-mirror', 'third-signal-clue', 'dawnline-archive-fragment',
  'proof-of-veil', 'ridge-envoy', 'cross-settlement-compact',
] as const;

function hasAnyEvidence(state: GameState, ids: string[]): boolean {
  const evidence = new Set(state.story?.evidence ?? []);
  return ids.some((id) => evidence.has(id));
}

function shouldOfferActThreeOptional(state: GameState, id: string): boolean {
  const flags = new Set(state.flags);
  const evidence = new Set(state.story?.evidence ?? []);
  switch (id) {
    case 'ridge-whiteout':
      return flags.has('ridge-route-exposed') || flags.has('expedition-light-kit') || state.stats.energy <= 35 || state.stats.food <= 30;
    case 'remote-mirror':
      return ['settlement-contact-public', 'settlement-contact-coded', 'settlement-contact-covert'].some((flag) => flags.has(flag)) &&
        hasAnyEvidence(state, ['prototype-mirror-data', 'atmospheric-window-anomaly', 'weather-station-raw-data', 'weather-station-drive']);
    case 'third-signal-clue':
      return !flags.has('signal-sealed') && !flags.has('signal-cut') &&
        (flags.has('signal-investigated') || flags.has('signal-decoded') || flags.has('signal-shared')) &&
        evidence.has('line-9-transmitter-pulse');
    case 'dawnline-archive-fragment':
      return hasAnyEvidence(state, ['first-night-index', 'dawnline-schedule', 'first-night-transcript-fragment']) &&
        hasAnyEvidence(state, ['weather-station-raw-data', 'weather-station-drive', 'nine-hour-latency-table']);
    case 'proof-of-veil': {
      const independent = ['weather-station-raw-data', 'weather-station-drive', 'atmospheric-window-anomaly', 'dawnline-schedule', 'dawnline-header-fragment', 'remote-mirror-geometry', 'ridge-coordinate-schedule'];
      return independent.filter((item) => evidence.has(item)).length >= 2;
    }
    case 'ridge-envoy':
      return flags.has('settlement-alliance') || flags.has('settlement-contact-public') || flags.has('ridge-route-broadcast') || flags.has('signal-pattern-public');
    case 'cross-settlement-compact': {
      const technicalCount = ['weather-station-raw-data', 'weather-station-drive', 'remote-mirror-geometry', 'dawnline-header-fragment', 'jorel-maintenance-code', 'peer-reviewed-veil-cycle', 'nine-hour-latency-table'].filter((item) => evidence.has(item)).length;
      return flags.has('settlement-alliance') && technicalCount >= 2;
    }
    default:
      return false;
  }
}

function getActThreeNextEvent(state: GameState): GameEvent | undefined {
  if ((state.story?.chapter ?? 1) !== 3 || !state.flags.includes('act-two-complete') || state.flags.includes('act-three-complete')) return undefined;

  // The first Act III scene is the route authorization; the expedition cannot begin before it.
  if (!state.seenEvents.includes('ridge-map')) return EVENT_BY_ID['ridge-map'];

  for (const id of ['expedition-prep', 'ridge-crossing'] as const) {
    if (!state.seenEvents.includes(id)) return EVENT_BY_ID[id];
  }
  if (!state.seenEvents.includes('ridge-whiteout') && shouldOfferActThreeOptional(state, 'ridge-whiteout')) {
    return EVENT_BY_ID['ridge-whiteout'];
  }
  for (const id of ['weather-station', 'ridge-settlement', 'jorel-evacuation-record'] as const) {
    if (!state.seenEvents.includes(id)) return EVENT_BY_ID[id];
  }

  // These evidence-driven scenes are checked at each step. A player who lacks one clue can
  // continue the main route, while new evidence can unlock later scenes without a softlock.
  for (const id of ACT_THREE_OPTIONAL_IDS) {
    if (state.seenEvents.includes(id) || !shouldOfferActThreeOptional(state, id)) continue;
    return EVENT_BY_ID[id];
  }
  if (!state.seenEvents.includes('act-three-outlook')) return EVENT_BY_ID['act-three-outlook'];
  return undefined;
}


const ACT_FOUR_SEQUENCE = ['act-four-council', 'dawnline-access', 'mara-override-confession', 'quill-full-archive'] as const;

const ACT_FIVE_SEQUENCE = ['act-five-commitments', 'act-five-jorel-dispatch', 'act-five-final-operation'] as const;

function getActFiveNextEvent(state: GameState): GameEvent | undefined {
  if ((state.story?.chapter ?? 1) !== 5 || !state.flags.includes('act-four-complete') || state.flags.includes('act-five-complete')) return undefined;
  for (const id of ACT_FIVE_SEQUENCE) {
    if (!state.seenEvents.includes(id)) return EVENT_BY_ID[id];
  }
  return undefined;
}

export function isChoiceAvailable(state: GameState, choice: import('./types').Choice): boolean {
  if (choice.requiresFlags?.some((flag) => !state.flags.includes(flag))) return false;
  if (choice.requiresEvidence?.some((evidence) => !(state.story?.evidence ?? []).includes(evidence))) return false;
  if (choice.requiresTruths?.some((truth) => !(state.story?.truths ?? []).includes(truth))) return false;
  if (choice.requiresRelationship?.some(({ character, min, max }) => {
    const standing = state.story?.relationships?.[character] ?? 0;
    return (min !== undefined && standing < min) || (max !== undefined && standing > max);
  })) return false;
  if (choice.minStats && Object.entries(choice.minStats).some(([key, value]) => state.stats[key as StatKey] < (value ?? 0))) return false;
  return true;
}

function actFourPulseIsSafe(state: GameState): boolean {
  const flags = new Set(state.flags);
  const truths = new Set(state.story?.truths ?? []);
  const fallback = flags.has('grid-redundancy-built') || (flags.has('settlement-compact-signed') && truths.has('safe-reset-requires-coordination'));
  return flags.has('calibration-safe') && fallback && state.stats.technology >= 35 && state.stats.energy >= 20 && !flags.has('relay-lock-unstable');
}

function getActFourNextEvent(state: GameState): GameEvent | undefined {
  if ((state.story?.chapter ?? 1) !== 4 || !state.flags.includes('act-three-complete') || !state.flags.includes('act-four-opened') || state.flags.includes('act-four-complete')) return undefined;
  for (const id of ACT_FOUR_SEQUENCE) {
    if (!state.seenEvents.includes(id)) return EVENT_BY_ID[id];
  }
  if (!state.seenEvents.includes('relay-lock-authenticated') && !state.seenEvents.includes('relay-lock-manual')) {
    const hasCode = (state.story?.evidence ?? []).includes('jorel-maintenance-code');
    return EVENT_BY_ID[hasCode ? 'relay-lock-authenticated' : 'relay-lock-manual'];
  }
  if (!state.seenEvents.includes('jorel-reunion') && !state.seenEvents.includes('jorel-search-plan')) {
    const hasLiveChannel = state.flags.includes('jorel-current-signal-confirmed') || state.flags.includes('jorel-maintenance-channel-open') || (state.story?.truths ?? []).includes('jorel-current-signal-confirmed');
    return EVENT_BY_ID[hasLiveChannel ? 'jorel-reunion' : 'jorel-search-plan'];
  }
  for (const id of ['gantry-workshop', 'orbital-telemetry', 'veil-model', 'mirror-calibration'] as const) {
    if (!state.seenEvents.includes(id)) return EVENT_BY_ID[id];
  }
  if (!state.seenEvents.includes('first-test-pulse')) return EVENT_BY_ID['first-test-pulse'];
  const flags = new Set(state.flags);
  if (flags.has('test-pulse-attempted') && !state.seenEvents.includes('test-pulse-success') && !state.seenEvents.includes('test-pulse-failure')) {
    return EVENT_BY_ID[actFourPulseIsSafe(state) ? 'test-pulse-success' : 'test-pulse-failure'];
  }
  if (flags.has('test-pulse-deferred') && !flags.has('pulse-aborted')) {
    if (!state.seenEvents.includes('grid-rebuild')) return EVENT_BY_ID['grid-rebuild'];
    if (!state.seenEvents.includes('second-test-window')) return EVENT_BY_ID['second-test-window'];
    if (flags.has('test-pulse-attempted') && !state.seenEvents.includes('test-pulse-success') && !state.seenEvents.includes('test-pulse-failure')) {
      return EVENT_BY_ID[actFourPulseIsSafe(state) ? 'test-pulse-success' : 'test-pulse-failure'];
    }
  }
  if (!state.seenEvents.includes('act4-final-vote')) return EVENT_BY_ID['act4-final-vote'];
  return undefined;
}

export function getAvailableEvents(state: GameState): GameEvent[] {
  const chapter = state.story?.chapter ?? 1;
  if (chapter === 1 && !state.flags.includes('act-one-complete')) {
    const next = getActOneNextEvent(state);
    return next ? [next] : [];
  }
  if (chapter === 2 && state.flags.includes('act-one-complete') && !state.flags.includes('act-two-complete')) {
    const next = getActTwoNextEvent(state);
    return next ? [next] : [];
  }
  if (chapter === 3 && state.flags.includes('act-two-complete') && !state.flags.includes('act-three-complete')) {
    const next = getActThreeNextEvent(state);
    return next ? [next] : [];
  }
  if (chapter >= 4 && state.flags.includes('act-three-complete') && !state.seenEvents.includes('outer-relay-briefing')) {
    const opening = EVENT_BY_ID['outer-relay-briefing'];
    if (opening) return [opening];
  }
  if (chapter === 4 && state.flags.includes('act-four-opened') && !state.flags.includes('act-four-complete')) {
    const next = getActFourNextEvent(state);
    return next ? [next] : [];
  }
  if (chapter >= 5 && state.flags.includes('act-four-complete') && !state.seenEvents.includes('act-five-briefing')) {
    const opening = EVENT_BY_ID['act-five-briefing'];
    if (opening) return [opening];
  }
  if (chapter >= 5 && state.flags.includes('act-four-complete') && !state.flags.includes('act-five-complete')) {
    const next = getActFiveNextEvent(state);
    return next ? [next] : [];
  }
  return getGenericAvailableEvents(state);
}

export function selectNextEvent(state: GameState): GameEvent {
  const available = getAvailableEvents(state);
  if (!available.length) return EVENT_BY_ID['night-watch-climax'] ?? EVENT_BY_ID['failing-grid'];
  const prioritized = available.filter((event) => (event.priority ?? 0) > 0).sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
  if (prioritized.length) return prioritized[0];
  const offset = (state.day * 7 + state.history.length * 3) % available.length;
  return available[offset];
}

export function createNewGame(): GameState {
  const base = {
    day: 1,
    stats: { population: 72, energy: 64, food: 61, order: 68, technology: 31 },
    flags: [],
    seenEvents: [],
    history: [],
    pending: [],
    currentEventId: 'failing-grid',
    status: 'playing' as const,
    story: createInitialStoryState(),
  };
  return base;
}

function evaluateEnding(state: GameState): GameState {
  const flags = new Set(state.flags);
  const endings: Record<string, { title: string; text: string; status: 'won' | 'lost' }> = {
    'ending-first-morning': { title: 'The First Morning', status: 'won', text: 'Vesper and Hearth-9 confirm each other’s timing receipts. The human interlock holds. DAWNLINE releases its maintained veil cycle in stages while preserving the protective shield. Natural light reaches the city—not as a miracle, but as a process that can be measured, stopped, and continued.' },
    'ending-eternal-city': { title: 'The Eternal City', status: 'won', text: 'Vesper refuses the planetary command. Its engineers isolate the local artificial dawn and begin a patient programme of repair, food production, and independent research. The sky remains dark, but the city is no longer waiting for one dangerous switch.' },
    'ending-peoples-dawn': { title: 'The People’s Dawn', status: 'won', text: 'The archive and command logs are opened to both cities. Emergency authority expires under a witnessed vote. The network has not been reset tonight; instead, the people establish that no one will make the next planetary decision alone.' },
    'ending-iron-winter': { title: 'The Iron Winter', status: 'won', text: 'The lights stay on. Checkpoints become permanent and the archive is placed under guard. Vale calls it stability; citizens learn to whisper beneath a functioning artificial dawn. Vesper survives, but its safety is purchased with freedom.' },
    'ending-beyond-ridge': { title: 'Beyond the Ridge', status: 'won', text: 'The convoy leaves in staggered groups along the protected ridge route. Not everyone can travel, and Vesper’s skyline recedes behind the storm. Hearth-9 becomes the beginning of a new shared community—or, without a signed compact, a fragile refuge that must decide whether it can afford to receive everyone.' },
    'ending-last-light': { title: 'The Last Light', status: 'lost', text: 'The command reaches DAWNLINE without the required reciprocal witness. The network triggers its protective closure. The artificial sun fractures into isolated beams; the city’s last chance becomes a record of why the safeguards existed.' },
  };
  const endingKey = Object.keys(endings).find((key) => flags.has(key));
  if (endingKey) {
    const ending = endings[endingKey];
    const jorelLine = flags.has('jorel-rescued')
      ? '\n\nJorel returns to Vesper with the outer-relay team. Ilya finally hears his voice without static between them.'
      : flags.has('jorel-rescue-requested')
        ? '\n\nHearth-9 acknowledges the search request. Jorel’s fate remains open, but his name can no longer be erased from the record.'
        : '\n\nJorel remains at the outer relay or beyond its reach. The final record does not invent certainty where the signal could not provide it.';
    return { ...state, status: ending.status, endingTitle: ending.title, endingText: ending.text + jorelLine };
  }

  const failedStat = STAT_KEYS.find((key) => state.stats[key] <= 0);
  if (failedStat || state.stats.population <= 10) {
    const name = failedStat ? STAT_LABELS[failedStat] : 'Population';
    return {
      ...state,
      status: 'lost',
      endingTitle: failedStat === 'energy' ? 'The lights go out' : failedStat === 'food' ? 'The empty stores' : failedStat === 'order' ? 'A city divided' : failedStat === 'technology' ? 'The long decline' : 'The city falls silent',
      endingText: failedStat === 'energy'
        ? 'The heliostat array fell below its minimum operating threshold. One district went dark, then another. The city could not hold the cold back any longer.'
        : failedStat === 'food'
          ? 'The stores have run empty. The city’s systems still function, but there is no reserve left to keep its people alive.'
          : failedStat === 'order'
            ? 'The civic compact has broken. With no shared trust left, the city fragments into isolated blocks.'
            : failedStat === 'technology'
              ? 'The last specialists leave the array for good. Without the knowledge to maintain it, the city’s future dims beyond repair.'
              : `The city's ${name.toLowerCase()} fell below the survival threshold. The remaining systems could no longer protect the population.`,
    };
  }
  return state;
}

export function resolveChoice(state: GameState, event: GameEvent, choiceId: string): GameState {
  if (state.status !== 'playing') return state;
  const choice = event.choices.find((item) => item.id === choiceId);
  if (!choice || !isChoiceAvailable(state, choice)) return state;

  const currentDay = state.day;
  let stats = applyDeltas(state.stats, choice.deltas);
  const flags = new Set(state.flags);
  let story = applyStoryEffects(state.story ?? createInitialStoryState(), choice.storyEffects);
  choice.setFlags?.forEach((flag) => flags.add(flag));
  choice.clearFlags?.forEach((flag) => flags.delete(flag));

  const pending = state.pending.map((effect) => ({ ...effect }));
  if (choice.delay) {
    pending.push({ id: `${event.id}-${choice.id}-${currentDay}`, dueDay: currentDay + choice.delay.turns, deltas: choice.delay.deltas, message: choice.delay.message, setFlags: choice.delay.setFlags, storyEffects: choice.delay.storyEffects });
  }

  const delayedMessages: string[] = [];
  const stillPending = [];
  for (const effect of pending) {
    if (effect.dueDay <= currentDay) {
      stats = applyDeltas(stats, effect.deltas);
      delayedMessages.push(effect.message);
      effect.setFlags?.forEach((flag) => flags.add(flag));
      story = applyStoryEffects(story, effect.storyEffects);
    } else stillPending.push(effect);
  }

  // The city consumes energy and food each cycle. Rounding and clamping are centralized.
  stats = applyDeltas(stats, { energy: -1, food: -1 });
  flags.add(`resolved:${event.id}`);
  if (event.id === 'failing-grid') flags.add('act-one-opened');
  if (stats.energy <= 35) flags.add('evacuation-alert');
  if (stats.order <= 50) flags.add('unrest-alert');
  const entry: HistoryEntry = {
    day: currentDay,
    eventId: event.id,
    eventTitle: event.title,
    choiceLabel: choice.label,
    deltas: choice.deltas,
    note: choice.note,
    delayedMessages: delayedMessages.length ? delayedMessages : undefined,
  };
  const history = [...state.history, entry];
  const seenEvents = event.once ? [...new Set([...state.seenEvents, event.id])] : state.seenEvents;
  const intermediate: GameState = {
    ...state,
    day: currentDay + 1,
    stats,
    flags: [...flags],
    seenEvents,
    history,
    pending: stillPending,
    story,
    lastFeedback: {
      title: choice.label,
      text: [choice.note, ...delayedMessages].filter(Boolean).join(' '),
      deltas: choice.deltas,
    },
  };
  const ended = evaluateEnding(intermediate);
  if (ended.status !== 'playing') return ended;
  return { ...ended, currentEventId: selectNextEvent(ended).id };
}


function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function savedStringList(value: unknown): string[] {
  return Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string'))] : [];
}

function normalizeSavedDeltas(value: unknown): Deltas {
  if (!isRecord(value)) return {};
  const result: Deltas = {};
  for (const key of STAT_KEYS) {
    const amount = value[key];
    if (typeof amount === 'number' && Number.isFinite(amount)) result[key] = Math.round(amount);
  }
  return result;
}

function normalizeSavedStoryEffects(value: unknown): StoryEffects | undefined {
  if (!isRecord(value)) return undefined;
  const characterIds: CharacterId[] = ['mara', 'ilya', 'vale', 'elias', 'nadia', 'jorel'];
  const districtIds: DistrictId[] = ['west', 'lower', 'south', 'north', 'core'];
  const validConditions: DistrictCondition[] = ['stable', 'strained', 'dark', 'recovering', 'sealed'];
  const relationships: Partial<Record<CharacterId, number>> = {};
  if (isRecord(value.relationships)) {
    for (const id of characterIds) {
      const amount = value.relationships[id];
      if (typeof amount === 'number' && Number.isFinite(amount)) relationships[id] = Math.round(amount);
    }
  }
  const districts: Partial<Record<DistrictId, DistrictCondition>> = {};
  if (isRecord(value.districts)) {
    for (const id of districtIds) {
      const condition = value.districts[id];
      if (typeof condition === 'string' && validConditions.includes(condition as DistrictCondition)) districts[id] = condition as DistrictCondition;
    }
  }
  const chapter = typeof value.chapter === 'number' && Number.isFinite(value.chapter)
    ? Math.max(1, Math.min(5, Math.round(value.chapter))) : undefined;
  const effects: StoryEffects = {
    relationships,
    meetCharacters: savedStringList(value.meetCharacters).filter((id): id is CharacterId => characterIds.includes(id as CharacterId)),
    discoverEvidence: savedStringList(value.discoverEvidence),
    revealTruths: savedStringList(value.revealTruths),
    districts,
    ...(chapter === undefined ? {} : { chapter }),
  };
  return effects;
}

function normalizeSavedHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.eventId !== 'string' || typeof item.eventTitle !== 'string' || typeof item.choiceLabel !== 'string') return [];
    if (typeof item.day !== 'number' || !Number.isFinite(item.day) || item.day < 1) return [];
    return [{
      day: Math.round(item.day),
      eventId: item.eventId,
      eventTitle: item.eventTitle,
      choiceLabel: item.choiceLabel,
      deltas: normalizeSavedDeltas(item.deltas),
      ...(typeof item.note === 'string' ? { note: item.note } : {}),
      ...(Array.isArray(item.delayedMessages) ? { delayedMessages: item.delayedMessages.filter((message): message is string => typeof message === 'string') } : {}),
    }];
  });
}

function normalizeSavedPending(value: unknown): GameState['pending'] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!isRecord(item) || typeof item.id !== 'string' || typeof item.message !== 'string' || typeof item.dueDay !== 'number' || !Number.isFinite(item.dueDay)) return [];
    return [{
      id: item.id,
      dueDay: Math.max(1, Math.round(item.dueDay)),
      message: item.message,
      deltas: normalizeSavedDeltas(item.deltas),
      ...(Array.isArray(item.setFlags) ? { setFlags: savedStringList(item.setFlags) } : {}),
      ...(normalizeSavedStoryEffects(item.storyEffects) ? { storyEffects: normalizeSavedStoryEffects(item.storyEffects) } : {}),
    }];
  });
}

/** Load the current save envelope or migrate a legacy bare GameState in place. */
export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    let decoded: unknown = JSON.parse(raw);
    if (!isRecord(decoded)) return null;
    if ('schemaVersion' in decoded || 'state' in decoded) {
      const version = decoded.schemaVersion;
      if (typeof version !== 'number' || !Number.isInteger(version) || version < 1 || version > SAVE_SCHEMA_VERSION || !('state' in decoded)) return null;
      decoded = decoded.state;
    }
    if (!isRecord(decoded) || typeof decoded.day !== 'number' || !Number.isFinite(decoded.day) || decoded.day < 1 || !isRecord(decoded.stats)) return null;
    if (!Array.isArray(decoded.history)) return null;

    const initial = createNewGame();
    const stats = { ...initial.stats };
    for (const key of STAT_KEYS) {
      const value = decoded.stats[key];
      if (typeof value === 'number' && Number.isFinite(value)) stats[key] = clamp(value);
      else if (value !== undefined) return null;
    }

    const status = decoded.status;
    if (status !== 'playing' && status !== 'won' && status !== 'lost') return null;
    const flags = savedStringList(decoded.flags);
    const seenEvents = savedStringList(decoded.seenEvents);
    const normalizedHistory = normalizeSavedHistory(decoded.history);
    const pending = normalizeSavedPending(decoded.pending);
    const hadNarrativeState = isRecord(decoded.story);
    let narrative = hadNarrativeState ? normalizeStoryState(decoded.story) : createInitialStoryState();

    // Reconstruct direct relationship/evidence outcomes from older decision histories where possible.
    if (!hadNarrativeState) {
      for (const entry of normalizedHistory) {
        const priorEvent = EVENT_BY_ID[entry.eventId];
        const priorChoice = priorEvent?.choices.find((item) => item.label === entry.choiceLabel);
        narrative = applyStoryEffects(narrative, priorChoice?.storyEffects);
      }
    }

    const migrated: GameState = {
      day: Math.max(1, Math.round(decoded.day)),
      stats,
      flags: [...new Set([...flags, ...seenEvents.map((id) => `resolved:${id}`)])],
      seenEvents,
      history: normalizedHistory,
      pending,
      currentEventId: typeof decoded.currentEventId === 'string' && EVENT_BY_ID[decoded.currentEventId] ? decoded.currentEventId : 'failing-grid',
      status,
      story: narrative,
      ...(typeof decoded.endingTitle === 'string' ? { endingTitle: decoded.endingTitle } : {}),
      ...(typeof decoded.endingText === 'string' ? { endingText: decoded.endingText } : {}),
    };

    // Carry forward discoveries made in saves created before narrative evidence was tracked separately.
    const legacyEvidence: Record<string, string> = {
      'signal-investigated': 'line-9-transmitter-pulse',
      'sky-scanned': 'atmospheric-window-anomaly',
      'signal-decoded': 'dawnline-schedule',
      'mirror-funded': 'prototype-mirror-data',
    };
    migrated.story.evidence = [...new Set([...migrated.story.evidence, ...Object.entries(legacyEvidence).filter(([flag]) => migrated.flags.includes(flag)).map(([, evidence]) => evidence)])];

    if (isRecord(decoded.lastFeedback) && typeof decoded.lastFeedback.title === 'string' && typeof decoded.lastFeedback.text === 'string') {
      migrated.lastFeedback = {
        title: decoded.lastFeedback.title,
        text: decoded.lastFeedback.text,
        deltas: normalizeSavedDeltas(decoded.lastFeedback.deltas),
      };
    }
    if (migrated.status === 'playing') migrated.currentEventId = selectNextEvent(migrated).id;

    // Rewrite a successfully read legacy save as the current envelope. Failure to rewrite must not lose the loaded run.
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, state: migrated })); } catch { /* restricted storage: continue in memory */ }
    return migrated;
  } catch {
    return null;
  }
}

export function saveGame(state: GameState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: SAVE_SCHEMA_VERSION, state }));
    return true;
  } catch {
    return false;
  }
}

export function hasSave(): boolean {
  return loadGame() !== null;
}
