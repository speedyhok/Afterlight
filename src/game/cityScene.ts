import type { GameState, Stats, StatKey } from './types';

export type CityMood = 'default' | 'blackout' | 'fractured' | 'smoke' | 'unrest' | 'recovery' | 'greenhouse' | 'aurora' | 'pulse' | 'light-seam' | 'dawn' | 'ridge' | 'expedition' | 'whiteout' | 'station' | 'hearth9' | 'jorel' | 'veil' | 'facility' | 'archive' | 'gantry' | 'orbital' | 'calibration' | 'testsuccess' | 'testfailure' | 'breach' | 'final';
export type CityPressure = StatKey;

export interface CityScenePresentation {
  mood: CityMood;
  region: string;
  kicker: string;
  titleA: string;
  titleB: string;
  caption: string;
  outputLabel: string;
}

const PRESENTATIONS: Record<CityMood, CityScenePresentation> = {
  default: { mood: 'default', region: 'SECTOR 07 · NORTH', kicker: 'ARTIFICIAL DAWN ARRAY / 01', titleA: 'THE LONG', titleB: 'NIGHT', caption: 'Outside temperature −61°C', outputLabel: 'THE SUN HAS NOT RISEN' },
  blackout: { mood: 'blackout', region: 'WESTERN RING · PARTIAL BLACKOUT', kicker: 'GRID ALERT / WESTERN HABITATS', titleA: 'DARK', titleB: 'SECTORS', caption: 'Emergency power only in the outer ring', outputLabel: 'LIGHTS OUT · HEAT PRESERVED' },
  fractured: { mood: 'fractured', region: 'HELIOSTAT ARRAY · MIRROR DAMAGE', kicker: 'ARRAY WARNING / MIRROR BANK 02', titleA: 'A BROKEN', titleB: 'SUN', caption: 'The array is bright, but no longer stable', outputLabel: 'MIRROR FRACTURE DETECTED' },
  smoke: { mood: 'smoke', region: 'FOUNDRY 03 · AIR QUALITY WARNING', kicker: 'INDUSTRIAL ALERT / VENTILATION', titleA: 'SMOKE IN', titleB: 'THE SKY', caption: 'Residential air filters are running hot', outputLabel: 'VENTILATION DIVERTED' },
  unrest: { mood: 'unrest', region: 'CENTRAL PLAZA · CIVIC TENSION', kicker: 'CIVIC MONITOR / SOUTH RING', titleA: 'A CITY', titleB: 'DIVIDED', caption: 'The public square is waiting for an answer', outputLabel: 'CIVIC TENSION ELEVATED' },
  recovery: { mood: 'recovery', region: 'WESTERN HABITATS · HEAT RESTORED', kicker: 'CIVIC RECOVERY / DISTRICT POWER', titleA: 'LIGHTS', titleB: 'RETURN', caption: 'Heat moves back through the residential ring', outputLabel: 'DISTRICT RECOVERING' },
  greenhouse: { mood: 'greenhouse', region: 'SHELTER NINE · CULTIVATION LIGHTS', kicker: 'BIOSPHERE / RECOVERY SIGNAL', titleA: 'LIFE UNDER', titleB: 'GLASS', caption: 'Green light spreads through the dormant domes', outputLabel: 'GROWTH DETECTED' },
  aurora: { mood: 'aurora', region: 'NORTHERN RIDGE · SIGNAL ANOMALY', kicker: 'ATMOSPHERIC SCAN / UNKNOWN SIGNAL', titleA: 'A SIGNAL', titleB: 'ABOVE US', caption: 'For the first time, the sky appears to answer', outputLabel: 'ANOMALY DETECTED' },
  pulse: { mood: 'pulse', region: 'HELIOSTAT ARRAY · PULSE IN FLIGHT', kicker: 'ATMOSPHERIC EXPERIMENT / IN PROGRESS', titleA: 'A PULSE', titleB: 'INTO DARK', caption: 'The array signal is crossing the cloud layer', outputLabel: 'AWAITING RESPONSE' },
  'light-seam': { mood: 'light-seam', region: 'HELIOSTAT ARRAY · UNSTABLE LIGHT SEAM', kicker: 'NATURAL LIGHT / TRANSIENT EVENT', titleA: 'A THREAD', titleB: 'OF MORNING', caption: 'A pale seam of real light opened above Vesper. It is not morning yet.', outputLabel: 'LIGHT SEAM · NOT STABLE' },
  dawn: { mood: 'dawn', region: 'HELIOSTAT ARRAY · LIGHT CORRIDOR OPEN', kicker: 'ATMOSPHERIC CORRIDOR / ACTIVE', titleA: 'THE FIRST', titleB: 'DAWN', caption: 'A seam of real light is crossing the frozen city', outputLabel: 'FIRST LIGHT RECORDED' },
  ridge: { mood: 'ridge', region: 'NORTHERN CAUSEWAY · EXPEDITION PREPARATION', kicker: 'ACT III / BEYOND VESPER', titleA: 'THE ROAD', titleB: 'NORTH', caption: 'A signal answers from beyond the ridge', outputLabel: 'ROUTE UNDER INVESTIGATION' },
  expedition: { mood: 'expedition', region: 'NORTHERN CAUSEWAY · CONVOY MOVING', kicker: 'ACT III / FIELD EXPEDITION', titleA: 'PAST THE', titleB: 'BEACON', caption: 'Convoy lights are leaving Vesper behind', outputLabel: 'EXPEDITION IN MOTION' },
  whiteout: { mood: 'whiteout', region: 'NORTHERN RIDGE · WHITEOUT WARNING', kicker: 'ACT III / ROUTE LOST', titleA: 'THE STORM', titleB: 'ERASES', caption: 'Visibility has collapsed beyond the ridge', outputLabel: 'RETURN BEACON UNSTABLE' },
  station: { mood: 'station', region: 'WEATHER STATION K-17 · ONLINE', kicker: 'ACT III / DATA RECOVERY', titleA: 'A STATION', titleB: 'STILL CALLS', caption: 'An abandoned sensor wakes beneath the ice', outputLabel: 'NINE-HOUR CYCLE DETECTED' },
  hearth9: { mood: 'hearth9', region: 'HEARTH-9 · NORTHERN SETTLEMENT', kicker: 'ACT III / FIRST CONTACT', titleA: 'LIGHTS ON', titleB: 'THE RIDGE', caption: 'Another city is alive beyond Vesper’s horizon', outputLabel: 'SETTLEMENT CONFIRMED' },
  jorel: { mood: 'jorel', region: 'OUTER MIRROR POST K-17 · HUMAN SIGNAL', kicker: 'ACT III / PERSONAL RECORD', titleA: 'A NAME', titleB: 'ANSWERS', caption: 'Jorel’s maintenance key has appeared on a live channel', outputLabel: 'HUMAN RESPONSE DETECTED' },
  veil: { mood: 'veil', region: 'HEARTH-9 · ATMOSPHERIC ANALYSIS', kicker: 'ACT III / VERIFIED ANOMALY', titleA: 'THE SKY', titleB: 'IS HELD', caption: 'Independent records show a repeating control cycle', outputLabel: 'VEIL CYCLE CORROBORATED' },
  facility: { mood: 'facility', region: 'NORTHWORKS · SEALED CONTROL SUBLEVEL', kicker: 'ACT IV / FACILITY ACCESS', titleA: 'THE ROOM', titleB: 'BEHIND THE WALL', caption: 'A decommissioned room has drawn power for thirteen years', outputLabel: 'ARCHIVE ACCESS OPEN' },
  archive: { mood: 'archive', region: 'VESPER · FIRST NIGHT ARCHIVE', kicker: 'ACT IV / HISTORICAL RECORD', titleA: 'THE FIRST', titleB: 'NIGHT', caption: 'The emergency order was real; the permanent lockout came later', outputLabel: 'TRANSCRIPT UNDER REVIEW' },
  gantry: { mood: 'gantry', region: 'HELIOSTAT ARRAY · REDUNDANT GANTRY', kicker: 'ACT IV / SAFETY ENGINEERING', titleA: 'TWO LOOPS', titleB: 'ONE CITY', caption: 'A second power route gives the next test a fallback', outputLabel: 'REDUNDANCY STATUS RECORDED' },
  orbital: { mood: 'orbital', region: 'NORTHWORKS · ORBITAL UPLINK', kicker: 'ACT IV / AUTONOMOUS HANDSHAKE', titleA: 'THE NETWORK', titleB: 'ANSWERS BACK', caption: 'DAWNLINE is still applying a valid old command without a live operator', outputLabel: 'AUTONOMOUS SIGNATURE FOUND' },
  calibration: { mood: 'calibration', region: 'HELIOSTAT ARRAY · MIRROR CALIBRATION', kicker: 'ACT IV / TEST WINDOW', titleA: 'A NARROW', titleB: 'CORRIDOR', caption: 'The mirrors can focus into a window, but the safety margin matters', outputLabel: 'CALIBRATION IN PROGRESS' },
  testsuccess: { mood: 'testsuccess', region: 'HELIOSTAT ARRAY · FIVE-SECOND TEST', kicker: 'ACT IV / NATURAL LIGHT DETECTED', titleA: 'FIVE SECONDS', titleB: 'OF MORNING', caption: 'A real seam of natural light crossed the city and faded', outputLabel: 'TEST CORRIDOR VERIFIED' },
  testfailure: { mood: 'testfailure', region: 'HELIOSTAT ARRAY · SAFETY SHUTDOWN', kicker: 'ACT IV / TEST ABORTED', titleA: 'THE LIGHT', titleB: 'CAME BACK WRONG', caption: 'The shutdown prevented a cascade; the mirror bank needs repair', outputLabel: 'PULSE FAILURE RECORDED' },
  breach: { mood: 'breach', region: 'DAWNLINE · PLANETARY SECURITY WARNING', kicker: 'ACT IV / CLOSURE COMMAND QUEUED', titleA: 'THE NETWORK', titleB: 'LOCKS DOWN', caption: 'An unauthorised reset will be treated as a planetary security breach', outputLabel: 'HUMAN HANDOFF REQUIRED' },
  final: { mood: 'final', region: 'VESPER · FINAL OPERATIONS ROOM', kicker: 'ACT V / FINAL WINDOW', titleA: 'THE LAST', titleB: 'WINDOW', caption: 'Vesper and Hearth-9 must act before the next autonomous closure', outputLabel: 'STRATEGY RECORDED' },
};

export function getCityScenePresentation(state: GameState): CityScenePresentation {
  const flags = new Set(state.flags);
  if (flags.has('ending-first-morning')) return PRESENTATIONS.dawn;
  if (flags.has('ending-eternal-city')) return PRESENTATIONS.final;
  if (flags.has('ending-peoples-dawn')) return PRESENTATIONS.recovery;
  if (flags.has('ending-iron-winter')) return PRESENTATIONS.unrest;
  if (flags.has('ending-beyond-ridge')) return PRESENTATIONS.ridge;
  if (flags.has('ending-last-light')) return PRESENTATIONS.testfailure;
  if (flags.has('act-five-opened')) return PRESENTATIONS.final;
  if (flags.has('test-pulse-succeeded')) return PRESENTATIONS.testsuccess;
  if (flags.has('test-pulse-failed')) return PRESENTATIONS.testfailure;
  if (flags.has('light-corridor-calibrated')) return PRESENTATIONS.calibration;
  if (flags.has('dawnline-security-alert') && !flags.has('dawnline-warning-acknowledged')) return PRESENTATIONS.breach;
  if (flags.has('orbital-handshake-decoded') || flags.has('orbital-handshake-public') || flags.has('uplink-isolated')) return PRESENTATIONS.orbital;
  if (flags.has('first-night-record-public') || flags.has('first-night-record-reviewed')) return PRESENTATIONS.archive;
  if (flags.has('grid-redundancy-built') || flags.has('gantry-built')) return PRESENTATIONS.gantry;
  if (flags.has('dawnline-access-open')) return PRESENTATIONS.facility;
  if (flags.has('jorel-current-signal-confirmed') || flags.has('jorel-confirmed-alive')) return PRESENTATIONS.jorel;
  if (flags.has('veil-peer-reviewed') || flags.has('dawnline-header-decoded')) return PRESENTATIONS.veil;
  if (flags.has('settlement-contact-public') || flags.has('settlement-contact-coded') || flags.has('settlement-contact-covert')) return PRESENTATIONS.hearth9;
  if (flags.has('weather-station-recovered') || flags.has('weather-station-batteries-stripped')) return PRESENTATIONS.station;
  if (flags.has('ridge-route-exposed') && !flags.has('weather-station-recovered')) return PRESENTATIONS.whiteout;
  if (flags.has('expedition-prepared') && !flags.has('ridge-route-signal-window') && !flags.has('ridge-route-sheltered') && !flags.has('ridge-route-exposed')) return PRESENTATIONS.expedition;
  // An early campaign light seam is only a transient signal. Reserve full dawn visuals
  // for the confirmed First Morning ending, which passes the campaign safety gates.
  if (flags.has('dawn-reached')) return PRESENTATIONS['light-seam'];
  if (flags.has('act-two-complete')) return PRESENTATIONS.ridge;
  if (flags.has('dawn-attempted')) return PRESENTATIONS.pulse;
  if (flags.has('sun-overdriven') && !flags.has('array-repaired') && !flags.has('array-isolated')) return PRESENTATIONS.fractured;
  if (flags.has('foundry-diverted') && !flags.has('ventilation-restored')) return PRESENTATIONS.smoke;
  if (((flags.has('blackout-policy') && !flags.has('lights-restored')) || state.story?.districts.west === 'dark' || state.stats.energy <= 18) && !flags.has('emergency-lighting')) return PRESENTATIONS.blackout;
  if ((state.stats.order <= 24 || state.story?.districts.south === 'sealed' || state.story?.districts.south === 'strained' || state.story?.districts.lower === 'dark' || ['shelter-raided', 'hall-cleared', 'clerk-punished', 'curfew-imposed'].some((flag) => flags.has(flag))) && !flags.has('assembly-held')) return PRESENTATIONS.unrest;
  if (flags.has('line-9-route-known') || flags.has('signal-decoded') || flags.has('signal-shared') || flags.has('sky-scanned') || (flags.has('signal-investigated') && !flags.has('signal-cut'))) return PRESENTATIONS.aurora;
  if (state.story?.districts.west === 'recovering' || state.story?.districts.lower === 'recovering') return PRESENTATIONS.recovery;
  if (flags.has('greenhouse-network-live') || state.story?.districts.south === 'recovering' || (!flags.has('greenhouse-paused') && ['garden-funded', 'mold-study', 'seed-vault-saved'].some((flag) => flags.has(flag)))) return PRESENTATIONS.greenhouse;
  return PRESENTATIONS.default;
}


/** Return at most two strongest low-reserve signals for subtle city-scene overlays.
 * This is presentation only: it never changes resource values or story state.
 */
export function getCityResourcePressures(stats: Stats): CityPressure[] {
  const limits: Record<StatKey, number> = {
    population: 35,
    energy: 35,
    food: 35,
    order: 30,
    technology: 30,
  };
  return (Object.keys(limits) as StatKey[])
    .filter((key) => stats[key] <= limits[key])
    .sort((a, b) => stats[a] - stats[b])
    .slice(0, 2);
}
