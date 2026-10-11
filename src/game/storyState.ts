import type { CharacterId, DistrictCondition, DistrictId, StoryEffects, StoryState } from './types';

export const STORY_CHARACTERS: Record<CharacterId, { name: string; role: string; introduction: string }> = {
  mara: { name: 'Dr. Mara Venn', role: 'Chief Engineer', introduction: 'Keeps the Dawn Engine operating and carries the burden of an old emergency override.' },
  ilya: { name: 'Ilya Sen', role: 'Lower District Organizer', introduction: 'Organizes residents and searches for the truth about her missing brother.' },
  vale: { name: 'Commander Soren Vale', role: 'Civil Security', introduction: 'Believes order is a precondition for survival and keeps an undisclosed evacuation list.' },
  elias: { name: 'Dr. Elias Rook', role: 'Signal Researcher', introduction: 'Studies the Line 9 transmitter and fears what its repeating signal means.' },
  nadia: { name: 'Nadia Quill', role: 'Keeper of the Archives', introduction: 'Protects the remaining records of the First Night and knows the official history is incomplete.' },
  jorel: { name: 'Jorel Sen', role: 'Relay Mechanic', introduction: 'A missing systems mechanic whose transfer records point toward the northern ridge.' },
};

export const EVIDENCE_CATALOG: Record<string, { title: string; description: string }> = {
  'ration-diversion-ledger': { title: 'Original ration ledger', description: 'Proof that food was diverted through a restricted depot.' },
  'ration-depot-manifest': { title: 'Depot manifest', description: 'A shipment list connecting civic stores to an unlisted facility.' },
  'clerk-deposition-hidden': { title: 'Hidden clerk deposition', description: 'A witness statement preserved outside the official record.' },
  'silver-mould-sample': { title: 'Hardy mould sample', description: 'A sample that may help develop crops suited to the altered environment.' },
  'line-9-transmitter-pulse': { title: 'Line 9 pulse fragment', description: 'A repeating transmission older than the blackout itself.' },
  'northern-route-map': { title: 'Northern route map', description: 'A traveller’s route toward a settlement beyond the ridge.' },
  'atmospheric-window-anomaly': { title: 'Atmospheric window readings', description: 'Evidence that the veil has a narrow, repeating opening.' },
  'safe-cycle-calculation': { title: 'Safe-cycle calculation', description: 'A safer Dawn Engine operating profile, incomplete but reproducible.' },
  'prototype-mirror-data': { title: 'Prototype mirror data', description: 'Proof that redirected scattered light can ease the city’s power burden.' },
  'blackout-impact-log': { title: 'Blackout impact log', description: 'A verified record of the human cost of the western power decision.' },
  'west-grid-temperature-map': { title: 'Western grid temperature map', description: 'Readings show the western habitats cooled faster than the public bulletin admitted.' },
  'maintenance-routing-anomaly': { title: 'Maintenance routing anomaly', description: 'A missing maintenance interval links the Dawn Engine, food shipments, and an outbound relay handshake.' },
  'restricted-relay-routing': { title: 'Restricted relay routing', description: 'Independent records confirm cargo and power were routed to an unlisted relay facility.' },
  'unlisted-relay-manifest': { title: 'Unlisted relay manifest', description: 'A cargo route leads from a civic storehouse to an access door marked Line 9.' },
  'audit-chain-of-custody': { title: 'Audit chain of custody', description: 'Independent copies preserve the ration and maintenance discrepancy against later alteration.' },
  'jorel-census-gap': { title: 'Jorel Sen census discrepancy', description: 'Jorel’s transfer destination was redacted; the record does not establish whether he survived.' },
  'evacuation-contingency-draft': { title: 'Unsigned evacuation draft', description: 'An unapproved plan names the districts that would be abandoned if the Dawn Engine fails.' },
  'first-night-index': { title: 'First Night archive index', description: 'A catalogue entry proves that a planetary maintenance authority named DAWNLINE existed.' },
  'archive-access-log': { title: 'Forced archive access log', description: 'The archive records who used emergency authority to open the restricted First Night index.' },
  'ridge-coordinate-schedule': { title: 'Ridge coordinate schedule', description: 'Coordinates aligned to a repeating nine-hour atmospheric signal.' },
  'dawnline-schedule': { title: 'DAWNLINE schedule fragment', description: 'The signal appears to be a maintenance schedule, not a distress call.' },
  'public-broadcast-copy': { title: 'Publicly broadcast coordinates', description: 'A copy of the signal data distributed across Vesper’s public bands.' },
  'first-night-transcript-fragment': { title: 'First Night transcript fragment', description: 'A partial transcript identifying DAWNLINE as a planetary maintenance network.' },
  'black-box-clock-offset': { title: 'Black-box clock offset', description: 'The Dawn Engine controller clock disagrees with the maintenance logs by nine hours.' },
  'depot-dispatch-ledger': { title: 'Depot dispatch ledger', description: 'A live, maintained corridor links the civic storehouse to a northern relay.' },
  'depot-hatch-photo': { title: 'Photograph of the sealed depot hatch', description: 'A numbered access hatch exists beneath the supposedly decommissioned storehouse.' },
  'ledger-second-copy': { title: 'Independent courier copy', description: 'A separate copy corroborates the dispatch schedule and relay destination.' },
  'public-hearing-record': { title: 'Public hearing record', description: 'A formal record separates the relay evidence from claims that remain unproven.' },
  'ridge-survey-order': { title: 'Northern survey order', description: 'A formally recorded decision to investigate the ridge corridor.' },
  'expedition-witness-roster': { title: 'Expedition witness roster', description: 'A record of who joined the northern team and what they were authorised to report.' },
  'ridge-crossing-data': { title: 'Ridge crossing telemetry', description: 'A field record of the repeating atmospheric window and its effect on the route.' },
  'emergency-beacon-trace': { title: 'Emergency beacon trace', description: 'A brief emergency pulse marks a reliable return bearing across the ridge.' },
  'weather-station-raw-data': { title: 'Weather station raw data', description: 'Atmospheric readings recovered from the northern weather station.' },
  'weather-station-drive': { title: 'Weather station drive', description: 'A removable data drive containing old network maintenance records.' },
  'nine-hour-latency-table': { title: 'Nine-hour latency table', description: 'A time offset connecting the local array, the ridge beacon, and a remote command.' },
  'jorel-transfer-record': { title: 'Jorel Sen transfer record', description: 'A redacted transfer entry places Jorel at a northern relay; by itself, it does not prove survival.' },
  'jorel-live-roster-entry': { title: 'Authenticated Hearth-9 roster', description: 'A signed roster records Jorel as a mechanic assigned to outer mirror post K-17 thirty-six hours ago.' },
  'jorel-maintenance-code': { title: 'Jorel’s maintenance code', description: 'A human maintenance challenge uses Jorel’s verified key from the outer relay.' },
  'hearth9-arrival-record': { title: 'Hearth-9 arrival record', description: 'A dated record establishes that the northern settlement is inhabited and operating.' },
  'settlement-relay-protocol': { title: 'Settlement relay protocol', description: 'A shared challenge-response protocol authenticates a live operator beyond the ridge.' },
  'remote-mirror-geometry': { title: 'Remote mirror geometry', description: 'The settlement uses a mirror field to focus scattered light into its habitable zone.' },
  'mirror-field-repair-record': { title: 'Mirror field repair record', description: 'A jointly repaired mount improves the settlement’s light collection without removing its lifeline.' },
  'dawnline-header-fragment': { title: 'DAWNLINE autonomous header', description: 'A recovered protocol header shows that the network continued executing rules without a fresh human signature.' },
  'peer-reviewed-veil-cycle': { title: 'Peer-reviewed veil cycle', description: 'Independent station and signal measurements confirm the veil is being actively maintained.' },
  'settlement-compact-signatures': { title: 'Hearth-9 compact signatures', description: 'Both cities agree to share timing data and safety checks before any planetary reset.' },
  'outer-mirror-post-coordinates': { title: 'Outer mirror post K-17', description: 'The most recent record places Jorel at the exposed relay post beyond Hearth-9.' },
  'hearth9-diplomatic-record': { title: 'Hearth-9 diplomatic record', description: 'The settlement and Vesper record the terms under which future cooperation may proceed.' },
  'provisional-veil-model': { title: 'Provisional veil model', description: 'Available readings support an active control cycle, pending independent review.' },
  'restricted-veil-analysis': { title: 'Restricted veil analysis', description: 'Two technical teams preserve a shared model without public release.' },
  'public-jorel-signal-copy': { title: 'Public copy of Jorel’s signal', description: 'Both cities can independently verify the maintenance-code waveform.' },
  'limited-settlement-timing-window': { title: 'Limited settlement timing window', description: 'Hearth-9 provides a narrow operational window but withholds full command coordination.' },
  'compact-draft': { title: 'Draft inter-city compact', description: 'A proposed safety agreement is recorded but has not been signed by both councils.' },
  'dawnline-facility-map': { title: 'DAWNLINE facility map', description: 'A powered but officially decommissioned control sublevel lies beneath Northworks.' },
  'public-operation-mandate': { title: 'Public operation mandate', description: 'A publicly witnessed mandate defines who may participate in the DAWNLINE operation.' },
  'mara-override-record': { title: 'Mara’s override record', description: 'Mara authorised a local override during the First Night emergency.' },
  'northworks-override-log': { title: 'Northworks override log', description: 'A separate command log corroborates the timing and downstream effects of Mara’s override.' },
  'human-interlock-procedure': { title: 'Human interlock procedure', description: 'DAWNLINE requires a human witness and a second-city timing receipt before a reset.' },
  'human-lock-witness-record': { title: 'Human lock witness record', description: 'A witnessed manual procedure establishes identity without granting root command authority.' },
  'jorel-message-auth': { title: 'Authenticated Jorel message', description: 'A maintenance-key exchange authenticates a current message from the outer relay.' },
  'jorel-location-request': { title: 'Jorel location request', description: 'A rescue request records the last verified work location and asks Hearth-9 to confirm the current roster.' },
  'outer-relay-maintenance-record': { title: 'Outer relay maintenance record', description: 'Jorel’s authenticated procedure describes the pressure sequence around the outer post.' },
  'redundant-grid-plan': { title: 'Redundant grid plan', description: 'A second isolatable power loop can protect local heat if an atmospheric test fails.' },
  'orbital-autonomous-header': { title: 'Orbital autonomous header', description: 'DAWNLINE answers with a valid command signature but no current human operator.' },
  'public-handshake-copy': { title: 'Public DAWNLINE handshake', description: 'Both cities hold the same copy of the autonomous network response.' },
  'signed-safety-model': { title: 'Peer-reviewed safety model', description: 'Independent teams agree on the maintained veil cycle and the safeguards required for a reset.' },
  'approximate-calibration-log': { title: 'Approximate calibration log', description: 'A fast mirror alignment points toward the corridor but lacks a verified safety margin.' },
  'light-corridor-telemetry': { title: 'Light corridor telemetry', description: 'Measurement of the narrow natural-light corridor during a controlled test pulse.' },
  'reset-test-telemetry': { title: 'Reset test telemetry', description: 'A record of the first controlled test, including its measured result and safety margins.' },
  'pulse-failure-report': { title: 'Pulse failure report', description: 'A report records where the test pulse exceeded the available safety margin.' },
  'control-vote-record': { title: 'Final control vote record', description: 'The city’s formal decision on a coordinated reset, local preservation, or staged evacuation.' },
  'final-operation-roster': { title: 'Final operation roster', description: 'A recorded coalition of people authorised to operate, witness, or abort the final operation.' },
  'jorel-return-record': { title: 'Jorel return and search record', description: 'A record of a completed extraction or an acknowledged search request; it does not imply rescue unless the extraction succeeded.' },
  'final-evacuation-manifest': { title: 'Final evacuation manifest', description: 'Names and transport assignments for people preparing to leave Vesper toward Hearth-9.' },
  'final-reset-record': { title: 'Coordinated reset record', description: 'A record of the successful human-supervised DAWNLINE handoff.' },
  'local-dawn-charter': { title: 'Local artificial dawn charter', description: 'The plan to maintain Vesper’s local system while deferring the planetary reset.' },
  'civilian-recovery-charter': { title: 'Civilian recovery charter', description: 'The public agreement that ends emergency rule and shares future network decisions.' },
  'catastrophic-lockout-record': { title: 'DAWNLINE catastrophic lockout record', description: 'The final record of a reset attempted without the required reciprocal witness.' },
};

export const TRUTH_CATALOG: Record<string, { title: string; description: string }> = {
  'signal-is-schedule': { title: 'The signal is a schedule', description: 'The Line 9 transmission encodes timed instructions and coordinates.' },
  'veil-is-maintained': { title: 'The atmospheric veil is being maintained', description: 'The darkness is not simply a passive remnant of the original catastrophe.' },
  'ridge-settlement-survived': { title: 'The northern settlement survived', description: 'A community beyond the ridge has remained operational without Vesper’s exact system.' },
  'dawnline-is-autonomous': { title: 'DAWNLINE is autonomous', description: 'The planetary network continues enforcing old safety rules without human oversight.' },
  'safe-reset-requires-coordination': { title: 'A safe reset requires coordination', description: 'No single city can safely reset the network alone.' },
  'first-night-was-an-emergency-response': { title: 'The First Night was an emergency response', description: 'DAWNLINE was activated to protect Earth from a real solar catastrophe; failures then trapped the network in its protective mode.' },
  'narrow-light-corridor-confirmed': { title: 'A narrow corridor of natural light is possible', description: 'A controlled pulse can open a small atmospheric corridor, but it cannot safely be sustained alone.' },
  'jorel-survived': { title: 'Jorel survived the transfer north', description: 'An authenticated Hearth-9 record proves Jorel was alive and working at the outer relay thirty-six hours before contact.' },
  'jorel-current-signal-confirmed': { title: 'Jorel answered the live signal', description: 'A current maintenance-code response confirms Jorel is transmitting from the outer relay, though his physical safety is still unknown.' },
  'mara-override-saved-west': { title: 'Mara’s override protected the western heat loop', description: 'Mara authorised a local emergency override to protect Vesper’s western heat loop; the wider cascade had consequences she did not understand at the time.' },
  'human-override-required': { title: 'DAWNLINE requires a human witness for a reset', description: 'The network requires a witnessed human interlock and an independent timing receipt rather than a spoofed credential.' },
  'safe-reset-tested-once': { title: 'A narrow light corridor has been tested', description: 'A controlled five-second pulse proved that a corridor can open briefly; it did not prove a full reset is safe.' },
  'test-pulse-failure-documented': { title: 'The first pulse failed because its safety margin was insufficient', description: 'The shutdown prevented cascading failure, and the telemetry identifies a calibration or redundancy gap.' },
  'both-cities-control-protocol': { title: 'Vesper and Hearth-9 agreed to shared control', description: 'The next reset strategy is bound to reciprocal witnesses and safeguards across both cities.' },
  'jorel-rescued': { title: 'Jorel was extracted from the outer relay', description: 'A final-operation rescue returned Jorel and the relay technician through the pressure lock.' },
  'dawnline-human-handoff-complete': { title: 'DAWNLINE accepted a human-supervised handoff', description: 'The coordinated reset transferred control in stages while preserving the protective shield.' },
};

export const DISTRICT_LABELS: Record<DistrictId, string> = {
  west: 'Western Habitats', lower: 'Lower Districts', south: 'Southern Ring', north: 'Northern Causeway', core: 'Dawn Engine Core',
};

export function createInitialStoryState(): StoryState {
  return {
    chapter: 1,
    relationships: { mara: 0, ilya: 0, vale: 0, elias: 0, nadia: 0, jorel: 0 },
    metCharacters: [],
    evidence: [],
    truths: [],
    districts: { west: 'strained', lower: 'stable', south: 'stable', north: 'strained', core: 'strained' },
  };
}

export function clampRelationship(value: number): number {
  return Math.max(-100, Math.min(100, Math.round(value)));
}

export function applyStoryEffects(story: StoryState, effects?: StoryEffects): StoryState {
  if (!effects) return story;
  const relationships = { ...story.relationships };
  for (const [id, delta] of Object.entries(effects.relationships ?? {}) as [CharacterId, number][]) {
    relationships[id] = clampRelationship((relationships[id] ?? 0) + delta);
  }
  const districts: Record<DistrictId, DistrictCondition> = { ...story.districts, ...(effects.districts ?? {}) };
  return {
    ...story,
    relationships,
    metCharacters: [...new Set([...story.metCharacters, ...(effects.meetCharacters ?? [])])],
    evidence: [...new Set([...story.evidence, ...(effects.discoverEvidence ?? [])])],
    truths: [...new Set([...story.truths, ...(effects.revealTruths ?? [])])],
    districts,
    chapter: effects.chapter ?? story.chapter,
  };
}

export function normalizeStoryState(value: unknown): StoryState {
  const initial = createInitialStoryState();
  if (!value || typeof value !== 'object') return initial;
  const candidate = value as Partial<StoryState>;
  const relationships = { ...initial.relationships };
  for (const id of Object.keys(relationships) as CharacterId[]) {
    const n = candidate.relationships?.[id];
    if (typeof n === 'number' && Number.isFinite(n)) relationships[id] = clampRelationship(n);
  }
  const districts = { ...initial.districts, ...(candidate.districts ?? {}) };
  const validConditions: DistrictCondition[] = ['stable', 'strained', 'dark', 'recovering', 'sealed'];
  for (const id of Object.keys(districts) as DistrictId[]) if (!validConditions.includes(districts[id])) districts[id] = initial.districts[id];
  const chapter = typeof candidate.chapter === 'number' ? Math.max(1, Math.min(5, Math.round(candidate.chapter))) : 1;
  return {
    chapter,
    relationships,
    metCharacters: Array.isArray(candidate.metCharacters) ? candidate.metCharacters.filter((id): id is CharacterId => id in STORY_CHARACTERS) : [],
    evidence: Array.isArray(candidate.evidence) ? candidate.evidence.filter((id): id is string => typeof id === 'string') : [],
    truths: Array.isArray(candidate.truths) ? candidate.truths.filter((id): id is string => typeof id === 'string') : [],
    districts,
  };
}

export function relationshipLabel(value: number): string {
  if (value >= 35) return 'Trusted';
  if (value >= 12) return 'Warming';
  if (value <= -35) return 'Hostile';
  if (value <= -12) return 'Wary';
  return 'Uncertain';
}
