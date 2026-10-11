import type { CharacterId } from './types';

export type CharacterMood = 'focused' | 'concerned' | 'angry' | 'weary' | 'hopeful' | 'wary' | 'determined' | 'shocked' | 'calm' | 'steady';

export interface CharacterBeat {
  character: CharacterId;
  mood: CharacterMood;
  line: string;
  signal?: string;
}

/**
 * Presentation-only character beats. These add voiced reactions to selected
 * existing events without changing their mechanics, prerequisites, or outcomes.
 */
const CHARACTER_BEATS: Record<string, CharacterBeat> = {
  'failing-grid': { character: 'mara', mood: 'concerned', signal: 'GRID DIAGNOSTICS', line: 'The load is climbing faster than the forecast. Give me one decision I can still make safe.' },
  'ration-ledger': { character: 'ilya', mood: 'wary', signal: 'CIVIC CHANNEL', line: 'Those numbers are not missing on paper. They are missing from people’s kitchens.' },
  'greenhouse-mold': { character: 'ilya', mood: 'hopeful', signal: 'AGRI-DOME 2', line: 'If the roots can survive this cold, we should stop treating the garden like an experiment.' },
  'signal-below': { character: 'elias', mood: 'shocked', signal: 'LINE 9 LISTENING POST', line: 'That sequence predates the blackout. Something was talking before the sky went dark.' },
  'heat-theft': { character: 'vale', mood: 'angry', signal: 'CIVIL SECURITY', line: 'I can stop the theft tonight. I need to know whether you want the truth or quiet streets.' },
  'old-reactor': { character: 'mara', mood: 'focused', signal: 'REACTOR NINE', line: 'There is power in that shell. The question is what wakes up with it.' },
  'outside-voice': { character: 'vale', mood: 'wary', signal: 'NORTH GATE', line: 'The gate is built to keep the weather out. It was never built to decide who counts as ours.' },
  'glass-sky': { character: 'elias', mood: 'concerned', signal: 'OBSERVATORY FEED', line: 'The sky is not behaving like weather. It is behaving like a system keeping time.' },
  'hospital-appeal': { character: 'ilya', mood: 'angry', signal: 'WARD THREE', line: 'The hospital has stopped asking for comfort. It is asking which patients get heat.' },
  'radio-pirate': { character: 'elias', mood: 'wary', signal: '88.3 MHz', line: 'That carrier is too clean to be random interference. Let it finish before we answer.' },
  'ice-quake': { character: 'mara', mood: 'concerned', signal: 'FOUNDATION MONITOR', line: 'The structure held. I cannot promise it will hold a second time without a load reduction.' },
  'seed-vault': { character: 'nadia', mood: 'hopeful', signal: 'ARCHIVE VAULT', line: 'Some of these seeds have outlived the institutions that stored them. Let us not waste that kind of patience.' },
  'power-broker': { character: 'vale', mood: 'wary', signal: 'TRADE EXCHANGE', line: 'A bargain made under a heater is still a bargain. Read every condition before you shake hands.' },
  'sun-engine': { character: 'mara', mood: 'focused', signal: 'DAWN ENGINE CONTROL', line: 'The output is stable. The machine is not healthy. Do not confuse those two readings.' },
  'quiet-protest': { character: 'ilya', mood: 'angry', signal: 'SOUTH RING', line: 'A silent queue is not consent. People are just saving their voices for when they matter.' },
  'foundry-fire': { character: 'vale', mood: 'concerned', signal: 'FOUNDRY 3', line: 'We can clear the floor quickly, but the workers will remember who was told to stay behind.' },
  'night-garden': { character: 'ilya', mood: 'hopeful', signal: 'SHELTER NINE', line: 'Look at it. One green thing in a whole city of blue warnings. Protect it.' },
  'mirror-proposal': { character: 'elias', mood: 'determined', signal: 'SCIENCE COUNCIL', line: 'We do not need a brighter artificial sun. We need to learn where the light is going.' },
  'last-transmission': { character: 'elias', mood: 'shocked', signal: 'LONG-RANGE RADIO', line: 'The signal is repeating on a schedule. Someone designed this to survive our silence.' },
  'dawn-equation': { character: 'mara', mood: 'determined', signal: 'CORE CALIBRATION', line: 'I can calculate a window. I cannot calculate how much trust we have left to spend.' },
  'blackout-aftermath': { character: 'ilya', mood: 'angry', signal: 'WESTERN CLINIC', line: 'These were not abstract districts on a map. These were rooms where people tried to sleep.' },
  'mirror-fractures': { character: 'mara', mood: 'shocked', signal: 'EAST MIRROR BANK', line: 'Cut the overdrive. I can save the core, but I need the gantry cleared now.' },
  'plaza-after-sirens': { character: 'ilya', mood: 'determined', signal: 'CENTRAL PLAZA', line: 'They came here with lanterns, not weapons. Do not turn a request to be heard into a siege.' },
  'greenhouse-network': { character: 'ilya', mood: 'hopeful', signal: 'GROW-LAMP NETWORK', line: 'The first leaves are not enough to feed a city. They are enough to prove we can start.' },
  'signal-echo': { character: 'elias', mood: 'concerned', signal: 'LINE 9 ARCHIVE', line: 'It is a schedule, not a distress call. The next pulse may tell us what it is maintaining.' },
  'mara-intake': { character: 'mara', mood: 'wary', signal: 'ENGINEERING BRIEFING', line: 'I can explain the failure. I am less certain the official record will survive the explanation.' },
  'west-temperature-map': { character: 'mara', mood: 'weary', signal: 'THERMAL MAPPING ROOM', line: 'The missing hour changed the report. It also changed which homes we thought were safe.' },
  'council-evacuation-draft': { character: 'vale', mood: 'weary', signal: 'EMERGENCY COUNCIL', line: 'I wrote the list because someone would have to choose. I did not say the list was fair.' },
  'ilya-clinic-visit': { character: 'ilya', mood: 'weary', signal: 'COMMUNITY CLINIC', line: 'I can explain every number in the queue. I cannot explain why this keeps happening.' },
  'vale-night-patrol': { character: 'vale', mood: 'wary', signal: 'NIGHT PATROL', line: 'People notice where the patrol stops. They notice even more where it never goes.' },
  'storehouse-manifest': { character: 'nadia', mood: 'focused', signal: 'CARGO ARCHIVE', line: 'A missing record is a question. A second copy is a chain of custody.' },
  'frost-witness': { character: 'ilya', mood: 'concerned', signal: 'STAIRWELL SIX', line: 'They agreed to speak because they thought someone would listen. Do not make them regret it.' },
  'quill-archive-request': { character: 'nadia', mood: 'wary', signal: 'MUNICIPAL ARCHIVE', line: 'The archive is not a safe place because it is old. It is safe only if its access can be accounted for.' },
  'ration-audit': { character: 'nadia', mood: 'determined', signal: 'AUDIT CHAIN', line: 'We now have two records that disagree. The next step is to find who had the means to alter either.' },
  'census-of-missing': { character: 'ilya', mood: 'concerned', signal: 'POPULATION REGISTER', line: 'Jorel is not a line item. If his name was removed, somebody knew enough to remove it.' },
  'maintenance-shift-log': { character: 'mara', mood: 'concerned', signal: 'ENGINE CORE LOG', line: 'This interval is absent from the public copy and present in the controller. Someone wanted a gap.' },
  'night-watch-climax': { character: 'elias', mood: 'shocked', signal: 'NIGHT WATCH · 02:13', line: 'Line 9 answered before our transmitter finished its handshake. We are not the only side listening.' },
  'northern-visitor-interview': { character: 'nadia', mood: 'focused', signal: 'NORTH GATE INTERVIEW', line: 'Ask for the detail the witness thinks is unimportant. That is usually where a prepared story frays.' },
  'quill-vault-access': { character: 'nadia', mood: 'wary', signal: 'SUBLEVEL C', line: 'The lock was opened with emergency authority. The record says who entered, not what they took.' },
  'vale-contingency-list': { character: 'vale', mood: 'weary', signal: 'OPERATIONS ROOM', line: 'The list was a contingency, not an order. I know how little comfort that distinction offers.' },
  'mara-black-box': { character: 'mara', mood: 'shocked', signal: 'BLACK BOX / CLOCK DRIFT', line: 'The controller clock and maintenance log differ by nine hours. That is not a harmless offset.' },
  'jorel-trail': { character: 'ilya', mood: 'concerned', signal: 'CARGO TAG ARCHIVE', line: 'His name is on the route. That is not proof he made it there. I need you to remember the difference.' },
  'hidden-depot-access': { character: 'vale', mood: 'wary', signal: 'RESTRICTED SUBLEVEL', line: 'We can secure the door or learn what it hides. Doing both without witnesses may be impossible.' },
  'ledger-second-copy': { character: 'nadia', mood: 'determined', signal: 'COURIER RELAY', line: 'Two copies survived on separate routes. That makes this harder to erase, not yet impossible to misunderstand.' },
  'public-hearing': { character: 'ilya', mood: 'determined', signal: 'WINTER SESSION', line: 'Let the evidence be challenged in daylight—even if daylight is only a metaphor here.' },
  'winter-vote': { character: 'vale', mood: 'concerned', signal: 'FINAL WINTER VOTE', line: 'Every form of authority can move quickly. The hard part is making it give the power back.' },
  'ridge-map': { character: 'elias', mood: 'focused', signal: 'NORTHERN TRACK', line: 'Nine-hour intervals turn the route into a clock. We need to cross when the system expects us to.' },
  'expedition-prep': { character: 'mara', mood: 'focused', signal: 'EXPEDITION MANIFEST', line: 'Pack for the repair you expect and the failure you do not. The ridge rarely respects the plan.' },
  'ridge-crossing': { character: 'elias', mood: 'concerned', signal: 'BEACON LINE', line: 'The pulse is on time. The storm is not. Keep both readings in the log.' },
  'ridge-whiteout': { character: 'mara', mood: 'shocked', signal: 'FIELD COMMS', line: 'Check the tether before the next gust. We can lose the route in seconds.' },
  'weather-station': { character: 'elias', mood: 'determined', signal: 'WEATHER STATION K-17', line: 'The station has been recording through the blackout. Its last file is still being written.' },
  'jorel-evacuation-record': { character: 'ilya', mood: 'shocked', signal: 'HEARTH-9 REGISTRY', line: 'Thirty-six hours ago he was working the outer post. Tell me exactly what the record proves—and what it does not.' },
  'ridge-settlement': { character: 'nadia', mood: 'concerned', signal: 'HEARTH-9 CONTACT', line: 'They survived by keeping their own records and their own lights. We should begin by respecting both.' },
  'remote-mirror': { character: 'elias', mood: 'hopeful', signal: 'MIRROR FIELD', line: 'They are redirecting what the veil scatters. We have been spending energy to fight a system we do not understand.' },
  'third-signal-clue': { character: 'jorel', mood: 'wary', signal: 'OUTER RELAY / FRAGMENT', line: 'If this is reaching you, use the maintenance key. Do not trust a voice that only knows my name.' },
  'dawnline-archive-fragment': { character: 'nadia', mood: 'shocked', signal: 'DAWNLINE ARCHIVE', line: 'The authority signature is valid. The operator is absent. The system has been treating absence as permission.' },
  'proof-of-veil': { character: 'elias', mood: 'determined', signal: 'JOINT ANALYSIS', line: 'Two instruments, separate clocks, the same cycle. This is no longer just a compelling pattern.' },
  'ridge-envoy': { character: 'nadia', mood: 'focused', signal: 'EASTERN GATE', line: 'A settlement is not an ally because it agrees with us. It is an ally when its safeguards can survive disagreement.' },
  'cross-settlement-compact': { character: 'mara', mood: 'concerned', signal: 'JOINT OPERATIONS', line: 'If one city can command the other to risk its life support, this is not a compact. It is a lever.' },
  'act-three-outlook': { character: 'ilya', mood: 'determined', signal: 'NORTHERN OPERATIONS', line: 'We have evidence he was there. We have a channel that may still be live. Now we choose what risk to carry first.' },
  'outer-relay-briefing': { character: 'mara', mood: 'focused', signal: 'ACT IV / OPERATIONS BOARD', line: 'The relay recognises a living operator. We will not fake that signature—and we will not pretend the human risk is solved.' },
  'act-four-council': { character: 'nadia', mood: 'determined', signal: 'JOINT COUNCIL', line: 'Both cities must be able to inspect the rule that governs the switch. Trust without a record will not be enough.' },
  'dawnline-access': { character: 'vale', mood: 'wary', signal: 'NORTHWORKS ACCESS', line: 'Once this door opens, security cannot make the decision disappear. Choose the witnesses before the entry team.' },
  'mara-override-confession': { character: 'mara', mood: 'weary', signal: 'SEALED TESTIMONY', line: 'I used the override. It kept one district alive. I cannot prove it did not condemn another.' },
  'quill-full-archive': { character: 'nadia', mood: 'concerned', signal: 'FIRST NIGHT ARCHIVE', line: 'The record does not absolve anyone. It lets us see which choices were made—and which were hidden.' },
  'relay-lock-authenticated': { character: 'elias', mood: 'focused', signal: 'HUMAN INTERLOCK', line: 'The code answers as a live operator. The safest path still requires the operator’s permission, not just the machine’s.' },
  'relay-lock-manual': { character: 'vale', mood: 'concerned', signal: 'MANUAL ACCESS', line: 'We can force the mechanism. That does not mean we should call the result a verified command.' },
  'jorel-reunion': { character: 'jorel', mood: 'hopeful', signal: 'AUTHENTICATED CHANNEL', line: 'I am alive. Keep the line open, but do not expose the post just to prove you heard me.' },
  'jorel-search-plan': { character: 'ilya', mood: 'determined', signal: 'RESCUE PLANNING', line: 'I want him home. I also know a rescue order can get more people lost if we confuse urgency with a plan.' },
  'gantry-workshop': { character: 'mara', mood: 'focused', signal: 'SHARED GANTRY', line: 'A repair team from both cities means more eyes on the work and more people who can stop it.' },
  'orbital-telemetry': { character: 'elias', mood: 'shocked', signal: 'ORBITAL UPLINK', line: 'DAWNLINE answered with the old authority chain. It has been enforcing the same rule without anyone renewing it.' },
  'veil-model': { character: 'nadia', mood: 'focused', signal: 'SAFETY MODEL REVIEW', line: 'Keep the raw readings beside every conclusion. We cannot afford another report that hides the uncertainty.' },
  'mirror-calibration': { character: 'mara', mood: 'determined', signal: 'CALIBRATION BAY', line: 'Point the mirrors at the gap. Then give me a stop condition that no one in this room can overrule.' },
  'first-test-pulse': { character: 'elias', mood: 'concerned', signal: 'TEST WINDOW / FIVE SECONDS', line: 'Five seconds will not restore the sun. It can tell us whether a safe corridor exists.' },
  'grid-rebuild': { character: 'mara', mood: 'focused', signal: 'REDUNDANCY CHECK', line: 'Do not spend the last reserve on the test. The city needs a way to survive it if we are wrong.' },
  'second-test-window': { character: 'elias', mood: 'determined', signal: 'SECOND WINDOW', line: 'We have one cleaner window. If any interlock disagrees, we abort before the pulse.' },
  'test-pulse-success': { character: 'mara', mood: 'hopeful', signal: 'CORRIDOR CONFIRMED', line: 'The seam held for five seconds. It is not morning yet—but now we know the route can be made safe.' },
  'test-pulse-failure': { character: 'mara', mood: 'weary', signal: 'TEST ABORTED', line: 'Cut the sequence. The system is protecting itself, and we still have people here who need power.' },
  'act4-final-vote': { character: 'nadia', mood: 'determined', signal: 'FINAL SAFEGUARD VOTE', line: 'The vote must name who can stop the operation, not only who is allowed to start it.' },
  'act-five-briefing': { character: 'mara', mood: 'focused', signal: 'FINAL WINDOW', line: 'This is our last planned window. Every safeguard you chose is now part of the operation.' },
  'act-five-commitments': { character: 'ilya', mood: 'concerned', signal: 'FINAL OPERATIONS ROOM', line: 'Whoever stands at the console will speak for more than themselves. Let the city see who accepted the risk.' },
  'act-five-jorel-dispatch': { character: 'jorel', mood: 'determined', signal: 'OUTER POST CHANNEL', line: 'I can confirm the timing from here. Do not route the whole city’s future through one person’s voice.' },
  'act-five-final-operation': { character: 'mara', mood: 'determined', signal: 'DAWNLINE FINAL COMMAND', line: 'I am ready to abort if a check fails. I need everyone else to mean it when they say the same.' },
  'ending-first-morning': { character: 'mara', mood: 'hopeful', signal: 'FIRST NATURAL LIGHT', line: 'Stand down the artificial dawn. Let the real sunlight do the work we kept asking the machine to do.' },
  'ending-eternal-city': { character: 'vale', mood: 'steady', signal: 'ARTIFICIAL DAWN PRESERVED', line: 'The city will survive under the light it knows. Now we must keep the emergency from becoming permanent.' },
  'ending-peoples-dawn': { character: 'ilya', mood: 'hopeful', signal: 'CIVILIAN COUNCIL', line: 'No one person gets to own the morning. We will remember who paid to make it possible.' },
  'ending-iron-winter': { character: 'vale', mood: 'weary', signal: 'SECURITY ADMINISTRATION', line: 'The lights are on. I know that is not the same as saying the city is free.' },
  'ending-beyond-ridge': { character: 'jorel', mood: 'concerned', signal: 'HEARTH-9 CONVOY', line: 'Keep the line moving and the manifest honest. Every name deserves to arrive in the record.' },
  'ending-last-light': { character: 'mara', mood: 'shocked', signal: 'CATASTROPHIC LOCKOUT', line: 'The interlocks are gone. Cut the feed—there is nothing left to gain by sending another command.' },
};

export function getCharacterBeat(eventId: string): CharacterBeat | undefined {
  return CHARACTER_BEATS[eventId];
}

export function moodForStanding(mood: CharacterMood, standing: number): CharacterMood {
  if (standing <= -25 && ['focused', 'calm', 'hopeful', 'steady'].includes(mood)) return 'wary';
  if (standing >= 35 && ['concerned', 'focused', 'wary'].includes(mood)) return 'steady';
  return mood;
}
