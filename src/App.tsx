import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Check,
  ChevronRight, CloudSnow, Cpu, Flame, History, House,
  LockKeyhole, RotateCcw, Settings2, Shield, Sun, Users, Utensils, X,
  Volume2, Radio, Waves, Zap, type LucideIcon,
} from 'lucide-react';
import { EVENTS, EVENT_BY_ID } from './game/events';
import { getCityResourcePressures, getCityScenePresentation, type CityMood, type CityPressure } from './game/cityScene';
import {
  createNewGame, formatDelta, hasSave, isChoiceAvailable, loadGame, resolveChoice,
  saveGame, STAT_KEYS, STAT_LABELS,
} from './game/engine';
import type { CharacterId, Deltas, GameEvent, GameState, StatKey } from './game/types';
import { getCharacterBeat, moodForStanding } from './game/characterBeats';
import CharacterPortrait from './components/CharacterPortrait';
import { AfterlightAudio, classifyDecisionCue } from './game/audio';
import { getLocalPreference, removeLocalPreference, setLocalPreference } from './game/preferences';
import { EVIDENCE_CATALOG, STORY_CHARACTERS, TRUTH_CATALOG, relationshipLabel } from './game/storyState';

type Screen = 'title' | 'play' | 'status' | 'history' | 'settings';

const STAT_ICONS: Record<StatKey, LucideIcon> = {
  population: Users, energy: Zap, food: Utensils, order: Shield, technology: Cpu,
};
const STAT_TONES: Record<StatKey, string> = {
  population: 'cyan', energy: 'amber', food: 'green', order: 'violet', technology: 'blue',
};
const STAT_DESCRIPTIONS: Record<StatKey, string> = {
  population: 'People under the city’s protection',
  energy: 'Power in the city reserve',
  food: 'Food and emergency stores',
  order: 'Trust, stability, and civic calm',
  technology: 'Scientific and engineering capacity',
};

function CityScene({ compact = false, mood = 'default', impactTone, pressures = [] }: { compact?: boolean; mood?: CityMood; impactTone?: 'positive' | 'negative' | 'mixed'; pressures?: CityPressure[] }) {
  const pressureClass = pressures.map((pressure) => `pressure-${pressure}`).join(' ');
  return (
    <div className={`city-scene mood-${mood} ${pressureClass} ${compact ? 'city-scene-compact' : ''} ${impactTone ? `decision-impact-${impactTone}` : ''}`} data-scene-mood={mood} data-city-pressures={pressures.join(' ')} aria-hidden="true">
      <div className="sky-glow" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="moon-halo"><span /></div>
      <div className="distant-ridge ridge-one" />
      <div className="distant-ridge ridge-two" />
      <div className="city-haze haze-one" />
      <div className="city-haze haze-two" />
      <div className="scene-story-wash" />
      <svg className="city-svg" viewBox="0 0 1600 660" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="building" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stopColor="#263c4a"/><stop offset="1" stopColor="#0b1722"/></linearGradient>
          <linearGradient id="tower" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#355363"/><stop offset="1" stopColor="#0a141e"/></linearGradient>
          <linearGradient id="sunbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#f6c77f" stopOpacity=".16"/><stop offset="1" stopColor="#f6c77f" stopOpacity="0"/></linearGradient>
          <pattern id="windows" width="24" height="32" patternUnits="userSpaceOnUse"><rect x="5" y="8" width="5" height="10" fill="#b7d8d9" opacity=".25"/><rect x="15" y="8" width="3" height="10" fill="#e6bd79" opacity=".28"/></pattern>
        </defs>
        <path d="M0 398 L90 398 90 326 122 326 122 283 146 283 146 398 205 398 205 248 240 248 240 211 258 211 258 398 310 398 310 309 344 309 344 257 372 257 372 398 437 398 437 340 466 340 466 202 490 202 490 146 510 202 510 340 546 340 546 397 590 397 590 293 620 293 620 244 650 244 650 397 697 397 697 314 724 314 724 188 754 188 754 132 783 188 783 397 828 397 828 266 855 266 855 211 883 211 883 397 926 397 926 320 952 320 952 253 980 253 980 397 1024 397 1024 296 1052 296 1052 171 1076 171 1076 115 1096 171 1096 397 1134 397 1134 330 1160 330 1160 239 1188 239 1188 397 1238 397 1238 292 1262 292 1262 218 1290 218 1290 397 1330 397 1330 329 1363 329 1363 271 1390 271 1390 397 1440 397 1440 307 1470 307 1470 265 1505 265 1505 397 1600 397 1600 660 0 660Z" fill="url(#building)" opacity=".88"/>
        <path d="M0 430 L80 430 80 380 122 380 122 348 154 348 154 430 210 430 210 312 254 312 254 280 285 280 285 430 340 430 340 356 371 356 371 318 400 318 400 430 455 430 455 370 490 370 490 286 521 286 521 430 570 430 570 344 613 344 613 288 646 288 646 430 701 430 701 357 739 357 739 288 773 288 773 430 831 430 831 341 862 341 862 306 895 306 895 430 942 430 942 360 970 360 970 298 1004 298 1004 430 1050 430 1050 351 1084 351 1084 281 1115 281 1115 430 1164 430 1164 360 1194 360 1194 310 1222 310 1222 430 1268 430 1268 342 1304 342 1304 286 1335 286 1335 430 1380 430 1380 366 1410 366 1410 319 1444 319 1444 430 1503 430 1503 366 1534 366 1534 335 1560 335 1560 430 1600 430 1600 660 0 660Z" fill="#08121c"/>
        <path d="M0 432 L1600 432 1600 660 0 660Z" fill="url(#windows)" opacity=".56"/>
        <path d="M700 430 L700 274 743 274 743 215 773 215 773 156 801 215 801 274 836 274 836 430Z" fill="url(#tower)"/>
        <path d="M735 430 L735 296 763 296 763 246 789 246 789 296 812 296 812 430Z" fill="#152936"/>
        <path d="M752 431 L752 299 793 299 793 431Z" fill="url(#windows)" opacity=".7"/>
        <path d="M1076 115 L1076 430" stroke="#f2c981" strokeWidth="2" opacity=".7"/>
        <path d="M1096 171 L1096 430" stroke="#f2c981" strokeWidth="1" opacity=".4"/>
        <path d="M1076 171 L1096 171 L1096 397 L1076 397Z" fill="#f2c981" opacity=".12"/>
        {Array.from({ length: 44 }).map((_, i) => <rect key={i} x={30 + ((i * 97) % 1510)} y={432 + ((i * 43) % 150)} width={3 + (i % 3)} height={5 + (i % 4) * 2} rx="1" fill={i % 4 === 0 ? '#e8bf78' : '#9bcbd0'} opacity={.17 + (i % 4) * .07} />)}
        <path d="M0 536 Q420 500 730 538 T1600 520 L1600 660 L0 660Z" fill="#09131d" opacity=".75"/>
        <path d="M0 604 Q400 570 820 605 T1600 590" stroke="#38505b" strokeWidth="2" fill="none" opacity=".42"/>
      </svg>
      <svg className={`city-scene-details details-${mood}`} viewBox="0 0 1600 660" preserveAspectRatio="xMidYMax slice">
        {mood === 'blackout' && <g className="detail-blackout">
          <path d="M0 302 L280 302 280 430 420 430 420 660 0 660Z" fill="#02070b" opacity=".46" />
          <path d="M1180 315 L1600 315 1600 660 1260 660 1260 444 1180 444Z" fill="#02070b" opacity=".5" />
          <g className="detail-emergency-lights">{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={88 + i * 46} y={380 + (i % 2) * 32} width="7" height="3" rx="1" />)}<rect x="1278" y="383" width="18" height="3" rx="1" /><rect x="1320" y="410" width="12" height="3" rx="1" /></g>
        </g>}
        {mood === 'fractured' && <g className="detail-fracture">
          <ellipse cx="1120" cy="138" rx="250" ry="91" fill="none" stroke="#e5b77c" strokeWidth="2" strokeDasharray="180 18 60 24" />
          <ellipse cx="1120" cy="138" rx="298" ry="111" fill="none" stroke="#df775f" strokeWidth="1" strokeDasharray="72 38 14 25" opacity=".8" />
          <path d="M1022 66 L1050 108 1035 130 1071 155 1054 183 M1138 58 L1125 98 1150 118 1127 145 1155 173 M1237 88 L1214 120 1237 148 1200 170" fill="none" stroke="#ff9876" strokeWidth="2.5" />
          <path d="M1060 77 L1081 90 1068 105Z M1191 165 L1215 177 1198 197Z" fill="#f9c27e" opacity=".8" />
        </g>}
        {mood === 'smoke' && <g className="detail-smoke">
          <g className="smoke-plume smoke-plume-one"><ellipse cx="370" cy="326" rx="42" ry="24"/><ellipse cx="395" cy="294" rx="34" ry="30"/><ellipse cx="360" cy="266" rx="27" ry="22"/></g>
          <g className="smoke-plume smoke-plume-two"><ellipse cx="1260" cy="324" rx="48" ry="25"/><ellipse cx="1288" cy="288" rx="35" ry="28"/><ellipse cx="1250" cy="254" rx="27" ry="23"/></g>
          <g className="smoke-plume smoke-plume-three"><ellipse cx="920" cy="354" rx="30" ry="17"/><ellipse cx="935" cy="331" rx="26" ry="20"/></g>
        </g>}
        {mood === 'unrest' && <g className="detail-unrest">
          <path d="M560 506 L1030 506" stroke="#e16b5d" strokeWidth="2" strokeDasharray="15 12" opacity=".75" />
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <g className="detail-citizen" key={i} transform={`translate(${618 + i * 29} ${512 + (i % 3) * 9}) scale(${.85 + (i % 2) * .12})`}><circle cx="0" cy="-9" r="4"/><path d="M-5 -3 Q0 -7 5 -3 L7 11 3 11 2 2 1 15 -3 15 -3 2 -6 11 -9 11Z"/></g>)}
          <g className="detail-beacon"><rect x="594" y="466" width="4" height="36" rx="2"/><circle cx="596" cy="465" r="8" /></g><g className="detail-beacon"><rect x="1004" y="466" width="4" height="36" rx="2"/><circle cx="1006" cy="465" r="8" /></g>
        </g>}
        {(mood === 'recovery' || mood === 'greenhouse') && <g className={`detail-regrowth ${mood === 'greenhouse' ? 'detail-greenhouse' : 'detail-recovery'}`}>
          <path d="M210 475 Q520 430 800 477 T1390 470" fill="none" stroke="#75d4a2" strokeWidth="2" strokeDasharray="12 13" />
          <path d="M290 495 Q560 450 810 496 T1320 489" fill="none" stroke="#75d4a2" strokeWidth="1" strokeDasharray="5 16" />
          <path d="M265 464 Q288 429 311 464Z M280 463 Q300 407 320 463Z M1260 478 Q1282 439 1304 478Z M1274 477 Q1298 414 1320 477Z" fill="#4baf83" fillOpacity=".36" stroke="#74d8a2" strokeWidth="2" />
          {mood === 'greenhouse' && <g className="detail-domes"><path d="M305 500 A76 76 0 0 1 457 500Z M430 498 A90 90 0 0 1 610 498Z" fill="#4fb985" fillOpacity=".12" stroke="#79dfad" strokeWidth="3"/><path d="M380 426 L380 500 M520 410 L520 498 M334 468 L430 468 M465 456 L575 456" stroke="#79dfad" strokeWidth="1.5" opacity=".72"/><path d="M353 489 Q354 465 369 457 Q372 477 353 489 M393 489 Q392 465 408 459 Q407 480 393 489 M490 486 Q492 462 508 453 Q510 476 490 486 M536 486 Q535 462 553 452 Q553 476 536 486" fill="#71d79d" opacity=".8" /></g>}
        </g>}
        {(['aurora', 'veil', 'orbital', 'jorel', 'station', 'hearth9', 'ridge'].includes(mood)) && <g className="detail-signal">
          <ellipse cx="1120" cy="128" rx="180" ry="48" fill="none" stroke="#75d7c8" strokeWidth="1.5" strokeDasharray="18 17" />
          <ellipse cx="1120" cy="128" rx="250" ry="72" fill="none" stroke="#75d7c8" strokeWidth="1" strokeDasharray="6 25" opacity=".55" />
          <path d="M1120 30 L1120 115 1101 128 1120 141 1138 128 1120 115 M1120 141 L1120 230" fill="none" stroke="#a2e6d6" strokeWidth="2" />
          <circle cx="1120" cy="128" r="8" fill="#adf4df"/><circle className="detail-signal-pulse" cx="1120" cy="128" r="24" fill="none" stroke="#adf4df" strokeWidth="2" />
          {mood === 'hearth9' && <g className="detail-far-settlement"><path d="M180 488 L180 454 195 442 210 454 210 488 M220 488 L220 466 231 456 243 466 243 488 M252 488 L252 445 266 431 280 445 280 488" fill="#132e31" stroke="#dfc58a" strokeWidth="2"/><path d="M187 467 L192 467 M198 467 L203 467 M227 476 L233 476 M260 455 L266 455" stroke="#ffe5a1" strokeWidth="4" /></g>}
        </g>}
        {(['pulse', 'calibration', 'testsuccess', 'light-seam', 'dawn'].includes(mood)) && <g className={`detail-light-event detail-light-${mood}`}>
          <path d={mood === 'light-seam' ? 'M0 370 Q400 346 740 360 T1600 340' : 'M1115 145 L960 270 820 430 780 660'} fill="none" stroke={mood === 'dawn' ? '#ffe6a1' : '#f4ce8d'} strokeWidth={mood === 'dawn' ? 18 : 7} strokeOpacity={mood === 'dawn' ? '.13' : '.2'} />
          <path className="detail-light-core" d={mood === 'light-seam' ? 'M0 370 Q400 346 740 360 T1600 340' : 'M1115 145 L960 270 820 430 780 660'} fill="none" stroke={mood === 'dawn' ? '#fff0c2' : '#fbe5ac'} strokeWidth={mood === 'dawn' ? 4 : 2} strokeDasharray={mood === 'light-seam' ? '190 60' : '22 14'} />
          {mood !== 'light-seam' && <circle className="detail-light-ripple" cx="820" cy="430" r="42" fill="none" stroke="#ffe5a3" strokeWidth="2" />}
          {mood === 'dawn' && <path d="M0 470 Q360 424 800 455 T1600 430 L1600 660 L0 660Z" fill="#eac786" fillOpacity=".07" />}
        </g>}
        {(mood === 'testfailure' || mood === 'breach') && <g className="detail-breach">
          <path d="M990 80 L1035 118 1018 153 1066 184 1044 228 M1182 52 L1158 94 1189 124 1156 166 1179 203" fill="none" stroke="#ef786e" strokeWidth="3" strokeDasharray="7 4" />
          <path d="M1060 245 L1180 245 M1120 215 L1120 274" stroke="#e66460" strokeWidth="1.5" strokeDasharray="6 8" />
          <circle cx="1120" cy="245" r="21" fill="none" stroke="#ef786e" strokeWidth="2" strokeDasharray="7 8" />
        </g>}
        {(['expedition', 'whiteout', 'ridge'].includes(mood)) && <g className={`detail-expedition detail-expedition-${mood}`}>
          {mood !== 'whiteout' && <g><path d="M130 530 L130 501 165 488 198 501 198 530Z M210 540 L210 519 236 510 262 519 262 540Z" fill="#172b32" stroke="#9cc2c5" strokeWidth="1.5"/><path d="M138 519 L149 519 M176 519 L188 519 M218 531 L231 531 M245 531 L256 531" stroke="#ffdf97" strokeWidth="4"/><path d="M90 548 L280 548" stroke="#a5c9ce" strokeWidth="1" strokeDasharray="5 8" /></g>}
          {mood === 'whiteout' && <g className="detail-whiteout-lines">{[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M${80 + i * 185} ${235 + (i % 3) * 88} q90 -20 180 0`} fill="none" stroke="#d7e7e8" strokeWidth={2 + (i % 2)} strokeOpacity=".55" />)}</g>}
        </g>}
        {pressures.includes('energy') && <g className="detail-pressure detail-pressure-energy"><path d="M300 420 L300 450 M330 400 L330 450 M360 430 L360 450 M1330 405 L1330 435 M1360 420 L1360 435" stroke="#f0bd69" strokeWidth="5" strokeDasharray="8 8"/><path d="M300 420 L300 450 M1330 405 L1330 435" stroke="#fff0b3" strokeWidth="2" /></g>}
        {pressures.includes('food') && <g className="detail-pressure detail-pressure-food"><path d="M455 498 Q450 466 462 447 M462 472 Q435 451 430 462 Q440 479 462 472 M460 459 Q481 438 490 447 Q481 465 460 459" fill="none" stroke="#d7b779" strokeWidth="3"/><path d="M610 506 L610 478 M610 490 Q591 469 580 482 Q592 502 610 490 M610 483 Q629 461 640 475 Q630 495 610 483" fill="none" stroke="#d7b779" strokeWidth="3" /></g>}
        {pressures.includes('order') && <g className="detail-pressure detail-pressure-order"><path d="M520 505 L1060 505" stroke="#ec766c" strokeWidth="2" strokeDasharray="8 18"/><circle cx="560" cy="486" r="8"/><circle cx="1020" cy="486" r="8"/></g>}
        {pressures.includes('population') && <g className="detail-pressure detail-pressure-population"><path d="M80 552 L365 552 M1235 552 L1530 552" stroke="#a4d8e2" strokeWidth="2" strokeDasharray="4 12"/><path d="M310 548 l17 -7 17 7 -17 7Z M1280 548 l17 -7 17 7 -17 7Z" fill="#e4c580" /></g>}
        {pressures.includes('technology') && <g className="detail-pressure detail-pressure-technology"><path d="M790 154 L790 105 M776 117 L804 117 M780 132 L800 132 M790 105 L777 91 M790 105 L803 91" fill="none" stroke="#a9a2ff" strokeWidth="3"/><circle cx="790" cy="105" r="20" fill="none" stroke="#a9a2ff" strokeDasharray="4 6" strokeWidth="2" /></g>}
      </svg>
      <div className="snow-field snow-a" />
      <div className="snow-field snow-b" />
      <div className="snow-field snow-c" />
      <div className="scene-vignette" />
    </div>
  );
}
function SegmentedMeter({ value, tone, critical = false, compact = false }: { value: number; tone?: string; critical?: boolean; compact?: boolean }) {
  return (
    <div className={`segmented-meter ${tone ?? ''} ${critical ? 'meter-critical' : ''} ${compact ? 'segmented-meter-compact' : ''}`} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value} aria-label={`${value} of 100 points`}>
      {Array.from({ length: 5 }, (_, index) => {
        const segmentValue = Math.min(20, Math.max(0, value - index * 20));
        return <span className="meter-segment" key={index} aria-hidden="true"><i style={{ width: `${segmentValue * 5}%` }} /></span>;
      })}
    </div>
  );
}

function DeltaLine({ deltas }: { deltas: Deltas }) {
  const active = STAT_KEYS.filter((key) => (deltas[key] ?? 0) !== 0);
  return <div className="delta-line">{active.map((key) => {
    const n = deltas[key] ?? 0;
    return <span className={`delta-chip ${n > 0 ? 'delta-up' : 'delta-down'}`} key={key}>{formatDelta(n)} {STAT_LABELS[key]}</span>;
  })}</div>;
}

function Header({ state, onNavigate, onBack }: { state: GameState; onNavigate: (screen: Screen) => void; onBack: () => void }) {
  return (
    <header className="topbar">
      <button className="brand-lockup" onClick={onBack} aria-label="Back to title screen">
        <span className="brand-mark"><span /></span>
        <span className="brand-type">AFTERLIGHT<small>THE LAST CITY</small></span>
      </button>
      <div className="topbar-center"><span className="live-dot" /> CITY CORE ONLINE <span className="topbar-separator">/</span> CYCLE {String(state.day).padStart(2, '0')}</div>
      <nav className="main-nav" aria-label="Game navigation">
        <button className="nav-item" onClick={() => onNavigate('play')}><House size={14} /> <span>Overview</span></button>
        <button className="nav-item" onClick={() => onNavigate('status')}><Activity size={14} /> <span>City status</span></button>
        <button className="nav-item" onClick={() => onNavigate('history')}><BookOpen size={14} /> <span>Chronicle</span>{state.history.length > 0 && <b>{state.history.length}</b>}</button>
        <button className="nav-icon" onClick={() => onNavigate('settings')} aria-label="Settings"><Settings2 size={17} /></button>
      </nav>
    </header>
  );
}

function TitleScreen({ continueAvailable, onNew, onContinue, onSettings }: { continueAvailable: boolean; onNew: () => void; onContinue: () => void; onSettings: () => void }) {
  return (
    <main className="title-screen">
      <CityScene />
      <div className="title-top"><span className="brand-mark brand-mark-large"><span /></span><span className="title-top-label">AN INTERACTIVE SURVIVAL CHRONICLE</span><span className="title-top-right">FIELD ARCHIVE <b>01—A</b></span></div>
      <section className="title-content">
        <div className="eyebrow"><span /> HUMANITY’S LAST LIGHT <span /></div>
        <h1>AFTER<span>LIGHT</span></h1>
        <p className="title-subtitle">The sun stopped rising.<br />The city did not.</p>
        <p className="title-copy">Lead the last city through the long dark. Every decision draws a line between what survives today and what might exist tomorrow.</p>
        <div className="title-actions">
          <button className="button-primary" onClick={onNew}><span>Begin a new cycle</span><ArrowRight size={17} /></button>
          <button className="button-secondary" disabled={!continueAvailable} onClick={onContinue}><span>Continue campaign</span>{continueAvailable ? <ChevronRight size={16} /> : <LockKeyhole size={14} />}</button>
          <button className="button-quiet" onClick={onSettings}><Settings2 size={15} /> Settings</button>
        </div>
        <div className="title-note"><span className="note-rule" /> <span>NO TWO CITIES FALL THE SAME WAY</span></div>
      </section>
      <div className="title-bottom"><span>LATITUDE 81° N / MUNICIPAL SHELTER 07</span><span><CloudSnow size={13} /> SUBZERO CONDITIONS <b>−61°C</b></span><span>BUILD 0.22.0 <i>COMPLETE FIVE-ACT CAMPAIGN</i></span></div>
      <div className="title-credits">A GAME ABOUT THE COST OF TOMORROW</div>
    </main>
  );
}

function MainPlay({ state, event, onChoice, onNavigate }: { state: GameState; event: GameEvent; onChoice: (choiceId: string) => void; onNavigate: (screen: Screen) => void }) {
  const city = getCityScenePresentation(state);
  const cityPressures = getCityResourcePressures(state.stats);
  const [impactTurn, setImpactTurn] = useState<number | null>(null);
  const previousDecisionCount = useRef(state.history.length);

  // Animate only when a new decision is resolved. Re-opening this screen does not
  // replay the previous impact, and a fast subsequent decision cancels the old timer.
  useEffect(() => {
    if (state.history.length <= previousDecisionCount.current) {
      previousDecisionCount.current = state.history.length;
      return;
    }

    const sequence = state.history.length;
    previousDecisionCount.current = sequence;
    setImpactTurn(sequence);
    const timeout = window.setTimeout(() => {
      setImpactTurn((current) => current === sequence ? null : current);
    }, 1050);
    return () => window.clearTimeout(timeout);
  }, [state.history.length]);

  const impactActive = impactTurn === state.history.length && state.history.length > 0;
  const impactDeltas = impactActive ? state.lastFeedback?.deltas : undefined;
  const impactValues = Object.values(impactDeltas ?? {}).filter((value): value is number => typeof value === 'number' && value !== 0);
  const hasPositiveImpact = impactValues.some((value) => value > 0);
  const hasNegativeImpact = impactValues.some((value) => value < 0);
  const impactTone = hasPositiveImpact && hasNegativeImpact ? 'mixed' : hasPositiveImpact ? 'positive' : hasNegativeImpact ? 'negative' : 'mixed';
  const characterBeat = getCharacterBeat(event.id);
  const character = characterBeat ? STORY_CHARACTERS[characterBeat.character] : undefined;
  const characterStanding = characterBeat ? (state.story.relationships[characterBeat.character] ?? 0) : 0;
  const characterMood = characterBeat ? moodForStanding(characterBeat.mood, characterStanding) : undefined;

  const activeThreats = useMemo(() => {
    const threats: string[] = [];
    if (state.stats.energy <= 25) threats.push('Grid instability');
    if (state.stats.food <= 25) threats.push('Food reserves critical');
    if (state.stats.order <= 25) threats.push('Civil unrest likely');
    if (state.stats.population <= 25) threats.push('Population at risk');
    return threats;
  }, [state.stats]);

  return (
    <div className="play-screen">
      <div className="play-heading-row">
        <div className="play-day-block">
          <span className="play-day-label">CYCLE</span>
          <strong>{String(Math.min(state.day, 90)).padStart(2, '0')}</strong>
          <span className="play-day-total">/ 90</span>
        </div>
        <div className="play-heading-copy">
          <span className="section-kicker">{state.story.chapter === 1 ? 'ACT I · THE LAST WARM DISTRICT' : state.story.chapter === 2 ? 'ACT II · A CITY DIVIDED' : state.story.chapter === 3 ? 'ACT III · THE SIGNAL BENEATH THE ICE' : state.story.chapter === 4 ? 'ACT IV · THE ARCHITECTURE OF NIGHT' : 'ACT V · AFTERLIGHT'}</span>
          <h1>{state.story.chapter === 1 ? 'Who pays for survival?' : state.story.chapter === 2 ? 'The signal was never silent.' : state.story.chapter === 3 ? 'A route through the dark.' : state.story.chapter === 4 ? 'The relay has a human lock.' : 'The final window is approaching.'}</h1>
          <p>{state.story.chapter === 1 ? 'The first crisis is only the beginning. Every record, relationship, and district carries the cost forward.' : state.story.chapter === 2 ? 'Line 9 was kept alive through thirteen years of darkness. Vesper now has to learn why.' : state.story.chapter === 3 ? 'Hearth-9 survives beyond the ridge. Its records place Jorel at an outer relay, and the sky’s repeating cycle is no longer just a theory.' : state.story.chapter === 4 ? 'The expedition has reached the edge of the system that keeps the veil in place. The next move must account for Jorel, Hearth-9, and the human lock on the relay.' : 'Vesper and Hearth-9 have chosen a strategy. The next closure window will test every safeguard and alliance built so far.'}</p>
        </div>
        <div className={`play-condition ${activeThreats.length ? 'play-condition-alert' : ''}`}>
          <span className="live-dot" />
          <span>{activeThreats.length ? `${activeThreats.length} SYSTEM${activeThreats.length === 1 ? '' : 'S'} UNDER PRESSURE` : 'SYSTEMS HOLDING'}</span>
        </div>
      </div>

      <div className="play-board">
        <section className="city-status-panel" aria-label="Live City Feed">
          <div className="city-feed-header"><span><span className="live-dot" /> LIVE CITY FEED</span><span>{city.region}</span></div>
          <section className={`play-art ${impactActive ? `play-art-impact-${impactTone}` : ''}`} aria-label="Frozen city scene">
            <CityScene key={`city-mood-${city.mood}`} compact mood={city.mood} pressures={cityPressures} impactTone={impactActive ? impactTone : undefined} />
            <div className="play-art-copy">
              <span className="play-art-kicker">{city.kicker}</span>
              <h2>{city.titleA}<br /><em>{city.titleB}</em></h2>
              <p>{city.caption}</p>
            </div>
            <div className="play-art-foot">
              <span><Sun size={14} /> HELIOSTAT OUTPUT</span>
              <SegmentedMeter value={state.stats.energy} tone="amber" compact />
              <strong>{state.stats.energy}<small>/100</small></strong>
            </div>
            <div className="play-art-coordinates">81° N · SHELTER 07<br />THE SUN HAS NOT RISEN</div>
          </section>

          <div className="resource-deck-grid" role="group" aria-label="City resources">
            {STAT_KEYS.map((key) => {
              const Icon = STAT_ICONS[key];
              const value = state.stats[key];
              return (
                <div
                  className={`resource-tile resource-tone-${STAT_TONES[key]} ${value <= 20 ? 'resource-tile-critical' : ''} ${impactActive && (impactDeltas?.[key] ?? 0) > 0 ? 'resource-tile-impact-positive' : ''} ${impactActive && (impactDeltas?.[key] ?? 0) < 0 ? 'resource-tile-impact-negative' : ''}`}
                  key={`${key}-${impactActive ? state.history.length : 'idle'}`}
                  data-impact={impactActive ? ((impactDeltas?.[key] ?? 0) > 0 ? 'positive' : (impactDeltas?.[key] ?? 0) < 0 ? 'negative' : 'none') : undefined}
                >
                  <div className="resource-tile-top"><span className="resource-tile-name"><Icon size={15} />{STAT_LABELS[key]}</span><strong>{value}<small>/100</small></strong></div>
                  <SegmentedMeter value={value} tone={STAT_TONES[key]} critical={value <= 20} />
                  <span className="resource-tile-desc">{value <= 20 ? 'CRITICAL RESERVE' : value <= 40 ? 'LIMITED RESERVE' : 'OPERATIONAL'}</span>
                </div>
              );
            })}
          </div>
          <div className="play-bottom-row">
            <span>{activeThreats.length ? `Attention required: ${activeThreats.join(' · ')}` : 'No immediate system failure detected.'}</span>
            <div className="play-bottom-actions">
              <button className="play-utility-button" onClick={() => onNavigate('status')}><Activity size={14} /> City report <ArrowRight size={13} /></button>
              <button className="play-utility-button" onClick={() => onNavigate('history')}><History size={14} /> Decision chronicle <span>{String(state.history.length).padStart(2, '0')}</span></button>
            </div>
          </div>
        </section>

        <section
          className={`play-story ${impactActive ? 'play-story-impact-active' : ''}`}
          key={impactActive ? `decision-${state.history.length}` : 'decision-idle'}
          aria-label="Current event and decisions"
        >
          {state.lastFeedback && (
            <div className={`outcome-ribbon ${impactActive ? `outcome-ribbon-impact-${impactTone}` : ''}`} aria-live="polite">
              <div className="outcome-symbol"><Check size={16} /></div>
              <div className="outcome-copy">
                <span className="section-kicker">LAST DECISION · DAY {String(Math.max(1, state.day - 1)).padStart(2, '0')}</span>
                <strong>{state.lastFeedback.title}</strong>
                {state.lastFeedback.text && <p>{state.lastFeedback.text}</p>}
              </div>
              <div className="outcome-deltas"><DeltaLine deltas={state.lastFeedback.deltas} /></div>
            </div>
          )}

          <div className="play-event-meta">
            <span className="event-number">EVENT {String(state.history.length + 1).padStart(2, '0')}</span>
            <span className="meta-dot" />
            <span>{event.category}</span>
            <span className="play-event-location">{event.location}</span>
          </div>
          <h2 className="play-event-title">{event.title}</h2>
          <p className="play-event-description">{event.description}</p>
          {characterBeat && character && characterMood && (
            <aside className={`character-voice-card character-mood-${characterMood}`} aria-label={`Dialogue from ${character.name}`} key={`${event.id}-${characterBeat.character}-${characterMood}`}>
              <div className="character-portrait-frame">
                <CharacterPortrait character={characterBeat.character} mood={characterMood} />
                <span className="character-portrait-live" aria-hidden="true" />
              </div>
              <div className="character-voice-copy">
                <div className="character-voice-signal"><span className="live-dot" /> {characterBeat.signal ?? 'LIVE COUNCIL CHANNEL'} <span className="character-voice-status">LIVE</span></div>
                <div className="character-voice-identity"><strong>{character.name}</strong><span>{character.role}</span></div>
                <p className="character-voice-line">“{characterBeat.line}”</p>
                <div className="character-relationship">CURRENT STANDING <b>{relationshipLabel(characterStanding).toUpperCase()}</b></div>
              </div>
            </aside>
          )}
          {event.quote && <blockquote className="play-event-quote">“{event.quote}”</blockquote>}

          <div className="play-decision-heading">
            <div><span className="section-kicker">MAKE THE CALL</span><strong>What will you do?</strong></div>
            <span>ONE CLICK · IMMEDIATE EFFECT</span>
          </div>
          <div className={`play-choices play-choices-${event.choices.length}`}>
            {event.choices.filter((choice) => isChoiceAvailable(state, choice)).map((choice, index) => (
              <button className="play-choice" key={choice.id} onClick={() => onChoice(choice.id)}>
                <span className="play-choice-number">0{index + 1}</span>
                <span className="play-choice-main">
                  <span className="play-choice-impact"><DeltaLine deltas={choice.deltas} /></span>
                  <span className="play-choice-title">{choice.label}</span>
                  <span className="play-choice-detail">{choice.detail}</span>
                </span>
                <span className="play-choice-arrow"><ArrowRight size={18} /></span>
              </button>
            ))}
          </div>
          <div className="play-story-foot"><span><LockKeyhole size={12} /> Decisions are final and autosaved.</span><span>{String(state.history.length).padStart(2, '0')} RECORDED</span></div>
        </section>
      </div>
    </div>
  );
}
function PageHeading({ kicker, title, description, onBack }: { kicker: string; title: string; description: string; onBack: () => void }) {
  return <div className="page-heading"><button className="back-link" onClick={onBack}><ArrowLeft size={15} /> BACK TO CITY</button><span className="section-kicker">{kicker}</span><h1>{title}</h1><p>{description}</p></div>;
}

function StatusScreen({ state, onBack }: { state: GameState; onBack: () => void }) {
  const weakest = [...STAT_KEYS].sort((a, b) => state.stats[a] - state.stats[b])[0];
  return <section className="content-page"><PageHeading kicker="MUNICIPAL INTELLIGENCE / REPORT 01" title="City status" description="A systems-level view of the last city. Every number reflects decisions already made." onBack={onBack} />
    <div className="status-page-grid"><div className="status-main-card"><div className="report-card-head"><div><span className="section-kicker">CURRENT RESERVES</span><h2>Vital signs</h2></div><span className="report-stamp">CYCLE {String(state.day).padStart(2, '0')}</span></div><div className="large-stats-grid">{STAT_KEYS.map((key) => { const Icon = STAT_ICONS[key]; const value = state.stats[key]; return <div className={`large-stat-card ${STAT_TONES[key]}`} key={key}><div className="large-stat-icon"><Icon size={18} /></div><div className="large-stat-label">{STAT_LABELS[key]}</div><div className="large-stat-value">{value}</div><SegmentedMeter value={value} tone={STAT_TONES[key]} critical={value <= 20} /><p>{STAT_DESCRIPTIONS[key]}</p></div>; })}</div></div>
      <div className="report-side-card"><div className="report-card-head"><div><span className="section-kicker">ASSESSMENT</span><h2>Pressure points</h2></div><Shield size={19} /></div><div className="assessment-line"><span>Campaign chapter</span><b>{state.story.chapter === 1 ? 'I · The Last Warm District' : state.story.chapter === 2 ? 'II · A City Divided' : state.story.chapter === 3 ? 'III · The Signal Beneath the Ice' : state.story.chapter === 4 ? 'IV · The Architecture of Night' : 'V · Afterlight'}</b></div><div className="assessment-line"><span>Weakest system</span><b>{STAT_LABELS[weakest]}</b></div><div className="assessment-line"><span>Recorded decisions</span><b>{state.history.length}</b></div><div className="assessment-line"><span>Known developments</span><b>{state.flags.length}</b></div><div className="assessment-line"><span>Pending effects</span><b>{state.pending.length}</b></div><div className="report-side-note"><Flame size={16} /><p>{state.stats[weakest] <= 30 ? `${STAT_LABELS[weakest]} is approaching a critical threshold. Prioritise a recovery before another system fails.` : `${STAT_LABELS[weakest]} is your most vulnerable system. Keep it in mind when weighing the next decision.`}</p></div></div>
    </div>
    <div className="intel-section"><div className="intel-heading"><span className="section-kicker">DEVELOPMENT REGISTER</span><h2>What the city has learned</h2></div>{state.flags.length ? <div className="flag-grid">{state.flags.map((flag) => <div className="flag-item" key={flag}><Check size={14} /><span>{flag.replace(/-/g, ' ')}</span><b>RECORDED</b></div>)}</div> : <div className="empty-state">No lasting directives or discoveries have been recorded yet.</div>}</div>
    <div className="intel-section story-dossier-section">
      <div className="intel-heading"><span className="section-kicker">STORY INTELLIGENCE / PERSISTENT CAMPAIGN STATE</span><h2>People and evidence</h2></div>
      <div className="story-dossier-grid">
        <div className="story-dossier-card">
          <div className="story-dossier-card-title">Relationships</div>
          {state.story.metCharacters.length ? state.story.metCharacters.map((id) => {
            const person = STORY_CHARACTERS[id];
            const standing = state.story.relationships[id] ?? 0;
            const expression = moodForStanding(standing <= -12 ? 'wary' : standing >= 12 ? 'steady' : 'focused', standing);
            return <div className="story-person-row" key={id}>
              <CharacterPortrait character={id as CharacterId} mood={expression} className="dossier-portrait" />
              <div className="story-person-copy"><strong>{person.name}</strong><span>{person.role}</span></div>
              <div className="story-standing"><span>{relationshipLabel(standing)}</span><div className="story-standing-track"><i style={{ width: `${Math.max(0, Math.min(100, (standing + 100) / 2))}%` }} /></div></div>
            </div>;
          }) : <p className="story-empty-copy">No key figures have formed a recorded relationship with the administration yet.</p>}
        </div>
        <div className="story-dossier-card">
          <div className="story-dossier-card-title">Evidence collected · {state.story.evidence.length}</div>
          {state.story.evidence.length ? <div className="story-evidence-list">{state.story.evidence.map((id) => <div className="story-evidence-item" key={id}><Check size={13} /><div><strong>{EVIDENCE_CATALOG[id]?.title ?? id.replace(/-/g, ' ')}</strong><span>{EVIDENCE_CATALOG[id]?.description ?? 'A record has been preserved in the city archive.'}</span></div></div>)}</div> : <p className="story-empty-copy">No evidence has been formally preserved. Investigations may produce records that unlock later choices.</p>}
        </div>
      </div>
      <div className="story-truths-row"><span className="section-kicker">CONFIRMED FINDINGS</span>{state.story.truths.length ? state.story.truths.map((id) => <div className="story-truth-item" key={id}><Check size={13} /><span><strong>{TRUTH_CATALOG[id]?.title ?? id.replace(/-/g, ' ')}</strong><small>{TRUTH_CATALOG[id]?.description ?? 'A conclusion supported by discovered evidence.'}</small></span></div>) : <p className="story-empty-copy">The larger mystery remains unresolved. Individual clues are not yet a complete explanation.</p>}</div>
    </div>
    <div className="intel-section"><div className="intel-heading"><span className="section-kicker">PENDING CONSEQUENCES</span><h2>Effects in motion</h2></div>{state.pending.length ? <div className="pending-list">{state.pending.map((effect) => <div className="pending-item" key={effect.id}><div><b>{effect.message}</b><p>Expected after the next {Math.max(1, effect.dueDay - state.day)} cycle(s)</p></div><DeltaLine deltas={effect.deltas} /></div>)}</div> : <div className="empty-state">No delayed effects are currently pending.</div>}</div>
  </section>;
}

function HistoryScreen({ state, onBack }: { state: GameState; onBack: () => void }) {
  return <section className="content-page"><PageHeading kicker="MUNICIPAL ARCHIVE / DECISION LOG" title="The chronicle" description="The city remembers what leadership chooses to remember. This record keeps the full sequence." onBack={onBack} />
    {state.history.length ? <div className="chronicle-list">{[...state.history].reverse().map((entry, index) => <article className="chronicle-entry" key={`${entry.day}-${entry.eventId}`}><div className="chronicle-day"><span>DAY</span><b>{String(entry.day).padStart(2, '0')}</b></div><div className="chronicle-body"><div className="chronicle-meta">RECORD {String(state.history.length - index).padStart(2, '0')} <span /> {EVENT_BY_ID[entry.eventId]?.category ?? 'CITY RECORD'}</div><h2>{entry.eventTitle}</h2><p className="chronicle-choice">Decision: <b>{entry.choiceLabel}</b></p>{entry.note && <p className="chronicle-note">{entry.note}</p>}{entry.delayedMessages?.map((message) => <p className="chronicle-delayed" key={message}><Check size={13} /> {message}</p>)}<DeltaLine deltas={entry.deltas} /></div><div className="chronicle-mark"><Check size={16} /></div></article>)}</div> : <div className="empty-state empty-state-tall"><BookOpen size={28} /><h2>No decisions recorded</h2><p>The chronicle begins after your first choice. The city is waiting.</p><button className="button-primary compact-button" onClick={onBack}>Return to city <ArrowRight size={15} /></button></div>}
  </section>;
}

function SettingsScreen({ reducedMotion, setReducedMotion, ambienceEnabled, setAmbienceEnabled, effectsEnabled, setEffectsEnabled, audioVolume, setAudioVolume, confirmReset, setConfirmReset, onBack, onReset }: { reducedMotion: boolean; setReducedMotion: (value: boolean) => void; ambienceEnabled: boolean; setAmbienceEnabled: (value: boolean) => void; effectsEnabled: boolean; setEffectsEnabled: (value: boolean) => void; audioVolume: number; setAudioVolume: (value: number) => void; confirmReset: boolean; setConfirmReset: (value: boolean) => void; onBack: () => void; onReset: () => void }) {
  return <section className="content-page settings-page"><PageHeading kicker="SYSTEM CONFIGURATION / LOCAL DEVICE" title="Settings" description="Tune the atmosphere, control decision audio, and manage the local campaign archive." onBack={onBack} />
    <div className="settings-card"><div className="setting-row"><div className="setting-icon"><CloudSnow size={18} /></div><div className="setting-text"><h3>Atmospheric motion</h3><p>Snowfall, subtle glow and moving environmental layers.</p></div><button className={`toggle ${!reducedMotion ? 'toggle-on' : ''}`} onClick={() => setReducedMotion(!reducedMotion)} role="switch" aria-checked={!reducedMotion} aria-label="Toggle atmospheric motion"><span /></button></div><div className="setting-row"><div className="setting-icon"><Waves size={18} /></div><div className="setting-text"><h3>City ambience</h3><p>A quiet turbine hum and distant winter wind. Audio starts only after a player interaction.</p></div><button className={`toggle ${ambienceEnabled ? 'toggle-on' : ''}`} onClick={() => setAmbienceEnabled(!ambienceEnabled)} role="switch" aria-checked={ambienceEnabled} aria-label="Toggle city ambience"><span /></button></div>
      <div className="setting-row"><div className="setting-icon"><Radio size={18} /></div><div className="setting-text"><h3>Decision cues & radio</h3><p>Subtle tones for decisions, alarms for emergencies, radio static for signals, and a sunrise chime for a confirmed dawn.</p></div><button className={`toggle ${effectsEnabled ? 'toggle-on' : ''}`} onClick={() => setEffectsEnabled(!effectsEnabled)} role="switch" aria-checked={effectsEnabled} aria-label="Toggle decision sounds and radio cues"><span /></button></div>
      <div className="setting-row setting-volume-row"><div className="setting-icon"><Volume2 size={18} /></div><div className="setting-text"><h3>Master volume</h3><p>Adjust the city ambience and event cues together.</p></div><input className="audio-volume" type="range" min="0" max="80" step="5" value={Math.round(audioVolume * 100)} onChange={(event) => setAudioVolume(Number(event.currentTarget.value) / 100)} aria-label="Master audio volume" /><span className="audio-volume-value">{Math.round(audioVolume * 100)}%</span></div><div className="setting-row"><div className="setting-icon danger-setting"><RotateCcw size={18} /></div><div className="setting-text"><h3>Reset campaign</h3><p>Delete the local save and return the city to its opening state.</p></div><button className="button-danger" onClick={() => setConfirmReset(true)}>Reset progress</button></div>
      <div className="settings-foot"><span><LockKeyhole size={13} /> SAVE DATA STAYS IN THIS BROWSER</span><button className="text-action" onClick={onBack}>Done <ArrowRight size={14} /></button></div></div>
    {confirmReset && <div className="confirm-overlay"><div className="confirm-dialog"><button className="modal-close" onClick={() => setConfirmReset(false)} aria-label="Close"><X size={17} /></button><div className="confirm-icon"><RotateCcw size={20} /></div><span className="section-kicker">LOCAL ARCHIVE</span><h2>Reset this city?</h2><p>Your current campaign and decision history will be deleted from this browser. This cannot be undone.</p><div className="confirm-actions"><button className="button-secondary" onClick={() => setConfirmReset(false)}>Keep campaign</button><button className="button-danger" onClick={onReset}>Delete save</button></div></div></div>}
  </section>;
}

function EndingScreen({ state, onRestart, onHistory }: { state: GameState; onRestart: () => void; onHistory: () => void }) {
  const won = state.status === 'won';
  const city = getCityScenePresentation(state);
  const endingBeatId = ['ending-first-morning', 'ending-eternal-city', 'ending-peoples-dawn', 'ending-iron-winter', 'ending-beyond-ridge', 'ending-last-light'].find((id) => state.flags.includes(id));
  const finalBeat = endingBeatId ? getCharacterBeat(endingBeatId) : undefined;
  const finalCharacter = finalBeat ? STORY_CHARACTERS[finalBeat.character] : undefined;
  const finalStanding = finalBeat ? (state.story.relationships[finalBeat.character] ?? 0) : 0;
  const finalMood = finalBeat ? moodForStanding(finalBeat.mood, finalStanding) : undefined;
  return <div className="ending-screen"><CityScene mood={city.mood} /><div className="ending-content"><span className="section-kicker">CAMPAIGN CONCLUDED · {won ? 'SURVIVAL RECORD' : 'FINAL TRANSMISSION'}</span><div className={`ending-symbol ${won ? 'ending-won' : ''}`}>{won ? <Sun size={28} /> : <CloudSnow size={28} />}</div><h1>{state.endingTitle ?? (won ? 'The city endures' : 'The city falls silent')}</h1><p>{state.endingText}</p>
    {finalBeat && finalCharacter && finalMood && <aside className={`ending-character-epilogue character-mood-${finalMood}`} aria-label={`Final message from ${finalCharacter.name}`}><div className="ending-character-portrait"><CharacterPortrait character={finalBeat.character} mood={finalMood} /></div><div><span className="section-kicker">FINAL TRANSMISSION · {finalBeat.signal ?? 'CITY CHANNEL'}</span><strong>{finalCharacter.name}</strong><p>“{finalBeat.line}”</p></div></aside>}
    <div className="ending-stats">{STAT_KEYS.map((key) => <div key={key}><span>{STAT_LABELS[key]}</span><b>{state.stats[key]}</b></div>)}</div><div className="ending-actions"><button className="button-primary" onClick={onRestart}>Begin another cycle <ArrowRight size={16} /></button><button className="button-secondary" onClick={onHistory}>Read the chronicle <BookOpen size={15} /></button></div><span className="ending-foot">AFTERLIGHT · BUILD 0.22.0</span></div></div>;
}

export default function App() {
  const [game, setGame] = useState<GameState | null>(null);
  const [screen, setScreen] = useState<Screen>('title');
  const [canContinue, setCanContinue] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [ambienceEnabled, setAmbienceEnabled] = useState(false);
  const [effectsEnabled, setEffectsEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.45);
  const [confirmReset, setConfirmReset] = useState(false);
  const choiceLock = useRef(false);
  const audioRef = useRef<AfterlightAudio | null>(null);

  const getAudioDirector = () => {
    if (!audioRef.current) audioRef.current = new AfterlightAudio();
    return audioRef.current;
  };

  // A browser may suspend sound between visits. Restore the preference here, but
  // only create/resume the audio context from a real pointer interaction.
  const unlockAudioOnInteraction = () => {
    if (!ambienceEnabled && !effectsEnabled) return;
    const audio = getAudioDirector();
    audio.setVolume(audioVolume);
    audio.unlock();
    if (ambienceEnabled) audio.setAmbience(true);
  };

  const updateAmbience = (enabled: boolean) => {
    setAmbienceEnabled(enabled);
    setLocalPreference('afterlight-audio-ambience', String(enabled));
    const audio = enabled ? getAudioDirector() : audioRef.current;
    if (audio) {
      audio.setVolume(audioVolume);
      audio.setAmbience(enabled);
    }
  };

  const updateEffects = (enabled: boolean) => {
    setEffectsEnabled(enabled);
    setLocalPreference('afterlight-audio-effects', String(enabled));
    if (enabled) {
      const audio = getAudioDirector();
      audio.setVolume(audioVolume);
      audio.unlock();
    }
  };

  const updateAudioVolume = (value: number) => {
    const safeValue = Math.max(0, Math.min(0.8, value));
    setAudioVolume(safeValue);
    setLocalPreference('afterlight-audio-volume', String(safeValue));
    audioRef.current?.setVolume(safeValue);
  };

  useEffect(() => {
    setCanContinue(hasSave());
    const motionSetting = getLocalPreference('afterlight-reduced-motion');
    if (motionSetting === 'true') setReducedMotion(true);
    setAmbienceEnabled(getLocalPreference('afterlight-audio-ambience') === 'true');
    setEffectsEnabled(getLocalPreference('afterlight-audio-effects') === 'true');
    const storedVolume = getLocalPreference('afterlight-audio-volume');
    if (storedVolume !== null) {
      const parsedVolume = Number(storedVolume);
      if (Number.isFinite(parsedVolume)) setAudioVolume(Math.max(0, Math.min(0.8, parsedVolume)));
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('reduced-motion', reducedMotion);
    setLocalPreference('afterlight-reduced-motion', String(reducedMotion));
  }, [reducedMotion]);

  useEffect(() => {
    if (game) {
      saveGame(game);
      setCanContinue(true);
    }
  }, [game]);

  useEffect(() => {
    choiceLock.current = false;
  }, [game]);

  const currentEvent = game ? EVENT_BY_ID[game.currentEventId] ?? EVENTS[0] : EVENTS[0];

  const startNew = () => {
    const fresh = createNewGame();
    setGame(fresh);
    saveGame(fresh);
    setScreen('play');
    setConfirmReset(false);
  };

  const continueGame = () => {
    const saved = loadGame();
    if (saved) {
      setGame(saved);
      setScreen(saved.status === 'playing' ? 'play' : 'play');
    }
  };

  const choose = (choiceId: string) => {
    if (!game || game.status !== 'playing' || choiceLock.current) return;
    choiceLock.current = true;
    const next = resolveChoice(game, currentEvent, choiceId);
    if (next === game) {
      choiceLock.current = false;
      return;
    }
    if (effectsEnabled) {
      const audio = getAudioDirector();
      audio.setVolume(audioVolume);
      audio.unlock();
      audio.play(classifyDecisionCue(currentEvent.id, next.lastFeedback?.deltas ?? {}, next.flags));
    }
    setGame(next);
  };

  const resetCampaign = () => {
    removeLocalPreference('afterlight-save-v01');
    setGame(null);
    setCanContinue(false);
    setConfirmReset(false);
    setScreen('title');
  };

  const navigate = (next: Screen) => {
    if (next === 'play' && game?.status !== 'playing') return;
    setScreen(next);
  };

  if (screen === 'title') {
    return <div className="app-shell" onPointerDown={unlockAudioOnInteraction}><TitleScreen continueAvailable={canContinue} onNew={startNew} onContinue={continueGame} onSettings={() => setScreen('settings')} /></div>;
  }

  if (screen === 'settings' && !game) {
    return <div className="app-shell" onPointerDown={unlockAudioOnInteraction}><TitleScreen continueAvailable={canContinue} onNew={startNew} onContinue={continueGame} onSettings={() => setScreen('settings')} /><div className="title-settings-overlay"><SettingsScreen reducedMotion={reducedMotion} setReducedMotion={setReducedMotion} ambienceEnabled={ambienceEnabled} setAmbienceEnabled={updateAmbience} effectsEnabled={effectsEnabled} setEffectsEnabled={updateEffects} audioVolume={audioVolume} setAudioVolume={updateAudioVolume} confirmReset={confirmReset} setConfirmReset={setConfirmReset} onBack={() => setScreen('title')} onReset={resetCampaign} /></div></div>;
  }

  if (!game) return <div className="app-shell" onPointerDown={unlockAudioOnInteraction}><TitleScreen continueAvailable={canContinue} onNew={startNew} onContinue={continueGame} onSettings={() => setScreen('settings')} /></div>;
  if (game.status !== 'playing' && screen !== 'history') return <div className="app-shell" onPointerDown={unlockAudioOnInteraction}><EndingScreen state={game} onRestart={startNew} onHistory={() => setScreen('history')} /></div>;

  return <div className="app-shell game-shell" onPointerDown={unlockAudioOnInteraction}>
    <Header state={game} onNavigate={navigate} onBack={() => setScreen('title')} />
    <main className="game-content">
      {screen === 'play' && <MainPlay state={game} event={currentEvent} onChoice={choose} onNavigate={navigate} />}
      {screen === 'status' && <StatusScreen state={game} onBack={() => setScreen('play')} />}
      {screen === 'history' && <HistoryScreen state={game} onBack={() => setScreen('play')} />}
      {screen === 'settings' && <SettingsScreen reducedMotion={reducedMotion} setReducedMotion={setReducedMotion} ambienceEnabled={ambienceEnabled} setAmbienceEnabled={updateAmbience} effectsEnabled={effectsEnabled} setEffectsEnabled={updateEffects} audioVolume={audioVolume} setAudioVolume={updateAudioVolume} confirmReset={confirmReset} setConfirmReset={setConfirmReset} onBack={() => setScreen('play')} onReset={resetCampaign} />}
    </main>
    <footer className="global-footer"><span>AFTERLIGHT / MUNICIPAL SURVIVAL PROGRAM</span><span>BUILD 0.22.0 <i /> COMPLETE FIVE-ACT CAMPAIGN</span></footer>
  </div>;
}
