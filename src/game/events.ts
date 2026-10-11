import type { GameEvent } from './types';

export const EVENTS: GameEvent[] = [
  {
    id: 'failing-grid', title: 'A dark sector', location: 'WESTERN GRID · SECTOR 04', category: 'INFRASTRUCTURE',
    description: 'The artificial dawn over Sector 04 has begun to stutter. Three heating towers are drawing power from a line already running hot. By midnight, someone will be left in the cold.',
    quote: '“The lights don’t go out all at once. They go out by neighbourhood.”',
    choices: [
      { id: 'reroute', label: 'Reroute the grid', detail: 'Protect homes. Take the hit elsewhere.', deltas: { energy: -30, order: 15, population: 10 }, setFlags: ['grid-rerouted'], note: 'The western blocks stay warm, but the reserve coils are strained.', storyEffects: { meetCharacters: ['mara', 'vale'], relationships: { mara: 2, vale: 1 }, districts: { west: 'recovering' } } },
      { id: 'blackout', label: 'Order a controlled blackout', detail: 'Save power at a human cost.', deltas: { energy: 30, order: -25, population: -10 }, setFlags: ['blackout-policy'], note: 'A clean technical solution leaves a messy political scar.', storyEffects: { meetCharacters: ['mara', 'ilya', 'vale'], relationships: { mara: 3, ilya: -10, vale: 7 }, districts: { west: 'dark' } } },
      { id: 'engineers', label: 'Send engineers into the cold', detail: 'Risk a dangerous field repair.', deltas: { energy: -10, technology: 15 }, delay: { turns: 2, deltas: { energy: 50 }, message: 'The field team stabilised the western grid. Power output has improved.', storyEffects: { relationships: { mara: 5 }, districts: { west: 'recovering' } } }, note: 'The engineers request two days and a working heater.', storyEffects: { meetCharacters: ['mara'], relationships: { mara: 6 }, discoverEvidence: ['safe-cycle-calculation'] } },
    ], once: true,
  },
  {
    id: 'ration-ledger', title: 'The missing ledger', location: 'CIVIC STOREHOUSE · LOWER RING', category: 'CIVIC ORDER',
    description: 'A clerk has uncovered evidence that food allocations have been quietly diverted to senior officials. The story is already moving through the queue outside the storehouse.',
    choices: [
      { id: 'publish', label: 'Publish the full ledger', detail: 'Trade trust at the top for trust below.', deltas: { order: 25, food: -10, population: 10 }, setFlags: ['ledger-published'], storyEffects: { meetCharacters: ['ilya', 'nadia'], relationships: { ilya: 8, nadia: 2, vale: -3 }, discoverEvidence: ['ration-diversion-ledger'] } },
      { id: 'quiet', label: 'Recover the stock quietly', detail: 'Avoid a public fracture.', deltas: { food: 25, order: -15 }, setFlags: ['quiet-ledger'], storyEffects: { meetCharacters: ['nadia'], relationships: { nadia: 1, ilya: -3, vale: 2 }, discoverEvidence: ['ration-depot-manifest'] } },
      { id: 'prosecute', label: 'Make an example of the clerk', detail: 'A show of control, with a price.', deltas: { order: -25, food: 10 }, setFlags: ['clerk-punished'], storyEffects: { meetCharacters: ['ilya', 'vale', 'nadia'], relationships: { ilya: -10, vale: 5, nadia: -6 }, discoverEvidence: ['clerk-deposition-hidden'] } },
    ], once: true,
  },
  {
    id: 'greenhouse-mold', priority: 28, title: 'Something in the roots', location: 'AGRI-DOME 2 · CULTIVATION BAY', category: 'FOOD SECURITY',
    requiresAnyFlags: ['garden-funded', 'garden-closed', 'seed-vault-saved'],
    description: 'A silver mould is spreading through the hydroponic beds. The crop is still edible today. The lead botanist says the next forty-eight hours will decide whether the blight reaches the seed vault.',
    choices: [
      { id: 'burn', label: 'Burn the infected beds', detail: 'Lose this harvest to save the next.', deltas: { food: -30, technology: 10 }, setFlags: ['mold-contained'] },
      { id: 'study', label: 'Let the lab study it', detail: 'A calculated risk with a delayed payoff.', deltas: { food: -15, technology: 15 }, delay: { turns: 2, deltas: { food: 25, technology: 10 }, message: 'The research team isolated a hardy strain. The next crop is healthier than expected.', storyEffects: { discoverEvidence: ['silver-mould-sample'] } }, setFlags: ['mold-study'] },
      { id: 'harvest', label: 'Harvest everything now', detail: 'Fill the stores. Risk tomorrow.', deltas: { food: 30, order: -10 }, setFlags: ['mold-harvested'], delay: { turns: 2, deltas: { food: -30, order: -15 }, message: 'Mould spores reached the seed beds. Food stores are spoiling.' } },
    ], once: true,
  },
  {
    id: 'signal-below', title: 'A signal below', location: 'OLD METRO · LINE 9', category: 'UNKNOWN SIGNAL',
    description: 'A maintenance crew has found a powered transmitter beneath the abandoned metro. Its repeating pulse matches no city system. Someone — or something — has kept it running through the long night.',
    choices: [
      { id: 'expedition', label: 'Send a science team', detail: 'Spend resources to learn what remains.', deltas: { energy: -15, food: -10, technology: 20 }, setFlags: ['signal-investigated'], delay: { turns: 2, deltas: { technology: 15 }, message: 'The transmitter contains fragments of a pre-darkness climate model.' }, storyEffects: { meetCharacters: ['elias'], relationships: { elias: 5 }, discoverEvidence: ['line-9-transmitter-pulse'] } },
      { id: 'seal', label: 'Seal the tunnel', detail: 'Unknown risks can wait.', deltas: { order: 10, technology: -10 }, setFlags: ['signal-sealed'] },
    ], once: true,
  },
  {
    id: 'heat-theft', title: 'The heat thieves', location: 'SOUTHERN HABITATS · BLOCK C', category: 'PUBLIC ORDER',
    description: 'A group has tapped the district heat pipe to warm an unofficial shelter. Their makeshift valves are leaking pressure from two neighbouring blocks. The shelter is full of children.',
    choices: [
      { id: 'legalise', label: 'Legalise the shelter', detail: 'Bring it into the ration system.', deltas: { food: -15, order: 20, population: 10 }, setFlags: ['shelter-legal'] },
      { id: 'repair', label: 'Repair the line and relocate them', detail: 'A costly, orderly compromise.', deltas: { energy: -20, order: 10 }, setFlags: ['shelter-relocated'] },
      { id: 'raid', label: 'Send the security teams', detail: 'Restore control immediately.', deltas: { order: -25, population: -10, energy: 15 }, setFlags: ['shelter-raided'] },
    ], once: true,
  },
  {
    id: 'old-reactor', title: 'The sleeping reactor', location: 'NORTH CAUSEWAY · REACTOR NINE', category: 'ENERGY',
    description: 'A dormant reactor outside the city perimeter may still be viable. Recommissioning it would require parts from the hospital reserve, and nobody can guarantee the containment systems survived the cold.',
    choices: [
      { id: 'restart', label: 'Attempt a restart', detail: 'High risk, high reward.', deltas: { technology: -10, energy: -25 }, setFlags: ['reactor-attempted'], delay: { turns: 3, deltas: { energy: 50, technology: 10 }, message: 'Reactor Nine is online at partial capacity. The city gains a new power reserve.' } },
      { id: 'strip', label: 'Strip it for parts', detail: 'Reliable gains, no miracle.', deltas: { energy: 15, technology: 15 }, setFlags: ['reactor-stripped'] },
      { id: 'leave', label: 'Leave it sleeping', detail: 'Keep the hospital reserve intact.', deltas: { order: 10 }, setFlags: ['reactor-ignored'] },
    ], once: true,
  },
  {
    id: 'outside-voice', title: 'Someone at the gate', location: 'NORTH GATE · OUTER WALL', category: 'POPULATION',
    description: 'A lone traveller has reached the outer wall, frostbitten but alive. They claim to have crossed a settlement that uses mirrors to concentrate the last available daylight — daylight your instruments insist no longer exists.',
    choices: [
      { id: 'admit', label: 'Open the inner gate', detail: 'Welcome one more life into the city.', deltas: { population: 10, food: -15, order: 10 }, setFlags: ['traveller-admitted'] },
      { id: 'question', label: 'Treat and question them', detail: 'Learn before committing.', deltas: { food: -10, technology: 10, order: -10 }, setFlags: ['traveller-questioned'], delay: { turns: 1, deltas: { technology: 10 }, message: 'The traveller shared a route map and a set of unfamiliar atmospheric readings.', storyEffects: { discoverEvidence: ['northern-route-map'] } }, storyEffects: { meetCharacters: ['nadia'], relationships: { nadia: 1 } } },
      { id: 'refuse', label: 'Keep the gate shut', detail: 'Protect those already inside.', deltas: { order: 10, population: -10 }, setFlags: ['traveller-refused'] },
    ], once: true,
  },
  {
    id: 'glass-sky', title: 'The glass sky', location: 'OBSERVATORY · UPPER SPIRE', category: 'DISCOVERY',
    description: 'The observatory detects a faint oscillation in the atmospheric particle layer. It may be natural, or it may indicate that the permanent cloud cover is thinning in a narrow band above the northern ridge.',
    minTechnology: 25,
    choices: [
      { id: 'scan', label: 'Power a full scan', detail: 'Spend energy to resolve the pattern.', deltas: { energy: -20, technology: 20 }, setFlags: ['sky-scanned'], delay: { turns: 2, deltas: { technology: 15 }, message: 'The scan confirms a repeating atmospheric window above the ridge.', storyEffects: { discoverEvidence: ['atmospheric-window-anomaly'] } }, storyEffects: { meetCharacters: ['elias'], relationships: { elias: 3 } } },
      { id: 'archive', label: 'Archive the readings', detail: 'Wait for more evidence.', deltas: { technology: 10, order: 10 }, setFlags: ['sky-archived'] },
    ], once: true,
  },
  {
    id: 'hospital-appeal', title: 'One more night of heat', location: 'CIVIC HOSPITAL · WARD THREE', category: 'PUBLIC HEALTH',
    description: 'The hospital generator is running at the edge of its tolerances. The chief physician asks for a dedicated power allocation for the maternity and intensive care wards. The request would come from the city’s already-thin reserve.',
    choices: [
      { id: 'allocate', label: 'Guarantee the hospital line', detail: 'Prioritise the most vulnerable.', deltas: { energy: -25, population: 15, order: 10 }, setFlags: ['hospital-protected'] },
      { id: 'rotate', label: 'Rotate power by ward', detail: 'Spread the shortage across the hospital.', deltas: { energy: -10, population: 10, order: -10 } },
      { id: 'deny', label: 'Keep the grid allocation', detail: 'Protect city-wide stability.', deltas: { energy: 15, population: -15, order: -15 }, setFlags: ['hospital-denied'] },
    ], once: true,
  },
  {
    id: 'radio-pirate', title: 'A voice on the band', location: 'RADIO TOWER · FREQUENCY 88.3', category: 'COMMUNICATIONS',
    description: 'A pirate broadcast is telling citizens that the artificial sun is deliberately dimmed to control the population. The voice has a following, and the claims are technically plausible enough to spread.',
    choices: [
      { id: 'broadcast', label: 'Answer with open data', detail: 'Trust the public with the numbers.', deltas: { energy: -10, order: 20, technology: 10 }, setFlags: ['open-broadcast'] },
      { id: 'jam', label: 'Jam the frequency', detail: 'Silence the signal, not the rumour.', deltas: { energy: -10, order: -15 }, setFlags: ['radio-jammed'] },
      { id: 'invite', label: 'Invite them to the council', detail: 'Turn an adversary into a witness.', deltas: { order: 10, technology: 10 }, setFlags: ['pirate-invited'], delay: { turns: 2, deltas: { order: 10 }, message: 'The broadcaster presented the grid logs live. The rumour lost momentum.' } },
    ], once: true,
  },
  {
    id: 'ice-quake', title: 'The ground moves', location: 'FOUNDATION RING · EAST SPAN', category: 'INFRASTRUCTURE',
    description: 'A pressure quake has shifted the ice shelf beneath the eastern foundations. No buildings have fallen, but the stress sensors warn that the next tremor could crack the district coolant main.',
    choices: [
      { id: 'evacuate', label: 'Evacuate the eastern ring', detail: 'Spend supplies now to reduce risk.', deltas: { food: -15, order: -10, population: -10 }, setFlags: ['east-evacuated'] },
      { id: 'brace', label: 'Brace the foundations', detail: 'A focused engineering response.', deltas: { energy: -15, technology: 10 }, setFlags: ['east-braced'] },
      { id: 'monitor', label: 'Monitor and wait', detail: 'Preserve resources for now.', deltas: { order: -10 }, delay: { turns: 2, deltas: { population: -10, energy: -15 }, message: 'A second tremor damaged the coolant main before repairs could begin.' } },
    ],
  },
  {
    id: 'seed-vault', title: 'Seeds for a warmer world', location: 'BOTANICAL ARCHIVE · LEVEL −6', category: 'LONG-TERM SURVIVAL',
    description: 'The seed vault’s climate system has begun to fail. A backup battery can keep it cold for months, but the battery is also the last reserve capable of restarting the public tram network.',
    choices: [
      { id: 'vault', label: 'Protect the seed vault', detail: 'Invest in a future you may not see.', deltas: { energy: -20, technology: 15 }, setFlags: ['seed-vault-saved'], delay: { turns: 3, deltas: { food: 20 }, message: 'The protected seed collection yielded a small emergency crop.' } },
      { id: 'trams', label: 'Restore the tram network', detail: 'Move people and supplies today.', deltas: { energy: 15, order: 10, food: 10 }, setFlags: ['trams-restored'] },
    ],
  },
  {
    id: 'power-broker', title: 'The copper compact', location: 'TRADE EXCHANGE · CENTRAL ATRIUM', category: 'POLITICS',
    description: 'A guild of technicians offers enough copper and specialist labour to expand the generator network. In return, they want long-term control of the city’s repair contracts and a permanent seat on the council.',
    minDay: 3,
    choices: [
      { id: 'accept', label: 'Sign the compact', detail: 'Fast infrastructure at a political price.', deltas: { energy: 25, technology: 15, order: -20 }, setFlags: ['copper-compact'] },
      { id: 'counter', label: 'Negotiate a public contract', detail: 'Slower gains, better oversight.', deltas: { energy: 15, technology: 10, order: 10 }, setFlags: ['public-contract'] },
      { id: 'reject', label: 'Refuse the offer', detail: 'Keep control inside the council.', deltas: { order: 10, energy: -10 }, setFlags: ['compact-rejected'] },
    ], once: true,
  },
  {
    id: 'sun-engine', title: 'The sun engine', location: 'HELIOSTAT ARRAY · CONTROL DECK', category: 'CRITICAL SYSTEM',
    description: 'Your chief engineer has modelled a way to push the artificial sun beyond its safety ceiling. The city would gain several days of warmth, but the array’s mirrors may fracture under thermal stress.',
    minTechnology: 35,
    choices: [
      { id: 'overdrive', label: 'Overdrive the array', detail: 'Borrow warmth from the machine’s future.', deltas: { energy: -15, population: 10, order: 10 }, setFlags: ['sun-overdriven'], delay: { turns: 2, deltas: { energy: -25, technology: 15 }, message: 'The array’s output surged, but two mirror banks fractured under the heat.' }, storyEffects: { meetCharacters: ['mara'], relationships: { mara: -8 }, districts: { core: 'strained' } } },
      { id: 'calibrate', label: 'Tune a safer cycle', detail: 'Smaller gains, durable knowledge.', deltas: { technology: 20, energy: -10 }, setFlags: ['sun-calibrated'], delay: { turns: 2, deltas: { energy: 15 }, message: 'The new cycle reduced energy loss across the heliostat array.', storyEffects: { relationships: { mara: 4 }, districts: { core: 'recovering' } } }, storyEffects: { meetCharacters: ['mara'], relationships: { mara: 8 }, discoverEvidence: ['safe-cycle-calculation'] } },
    ], once: true,
  },
  {
    id: 'quiet-protest', title: 'The silent queue', location: 'DISTRIBUTION HALL · SOUTH RING', category: 'CIVIC ORDER',
    description: 'No one is shouting outside the ration hall. That is what worries your security chief. People have started leaving their ration cards face-up on the floor, in a gesture that has spread from one queue to the next.',
    choices: [
      { id: 'listen', label: 'Hold an open assembly', detail: 'Make space for anger before it hardens.', deltas: { order: 25, food: -10 }, setFlags: ['assembly-held'], storyEffects: { meetCharacters: ['ilya', 'vale'], relationships: { ilya: 10, vale: -4 } } },
      { id: 'concessions', label: 'Increase emergency rations', detail: 'Buy relief with scarce food.', deltas: { food: -25, order: 15, population: 10 }, setFlags: ['ration-increase'], storyEffects: { meetCharacters: ['ilya'], relationships: { ilya: 6 } } },
      { id: 'disperse', label: 'Clear the hall', detail: 'Restore the schedule by force.', deltas: { order: -25, population: -10 }, setFlags: ['hall-cleared'], storyEffects: { meetCharacters: ['ilya', 'vale'], relationships: { ilya: -15, vale: 8 }, districts: { south: 'strained' } } },
    ], once: true,
  },
  {
    id: 'foundry-fire', title: 'Red metal', location: 'FOUNDRY 3 · SMELTING FLOOR', category: 'INDUSTRY',
    description: 'A furnace accident has shut down the foundry that supplies the artificial sun’s maintenance crews. Workers can restore production quickly if they divert the ventilation units from the residential floors above.',
    choices: [
      { id: 'ventilate', label: 'Protect the workers', detail: 'Repair slowly, keep the air clean.', deltas: { energy: -15, technology: 10, population: 10 }, setFlags: ['foundry-safe'] },
      { id: 'divert', label: 'Divert residential ventilation', detail: 'Get the foundry back online faster.', deltas: { energy: 15, technology: 15, population: -15 }, setFlags: ['foundry-diverted'] },
    ], once: true,
  },
  {
    id: 'night-garden', priority: 30, minDay: 5, title: 'A garden in the dark', location: 'SHELTER NINE · ROOFTOP', category: 'COMMUNITY',
    description: 'Residents have built a rooftop garden under borrowed grow-lamps. It is small, inefficient, and somehow the first place in months where people have gathered without being asked to. The lamp batteries are due back at the clinic.',
    choices: [
      { id: 'support', label: 'Fund the garden', detail: 'Small harvest, a stronger community.', deltas: { energy: -10, food: 15, order: 15 }, setFlags: ['garden-funded'], storyEffects: { meetCharacters: ['ilya'], relationships: { ilya: 4 }, districts: { south: 'recovering' } } },
      { id: 'return', label: 'Return the batteries', detail: 'Keep the clinic fully supplied.', deltas: { energy: 10, population: 10, order: -10 }, setFlags: ['garden-closed'] },
    ], once: true,
  },
  {
    id: 'mirror-proposal', title: 'The mirror proposal', location: 'SCIENCE COUNCIL · CHAMBER A', category: 'RESEARCH',
    description: 'A young physicist proposes a field of orbital mirrors to bend scattered light toward the city. The model is elegant; the materials list is brutal. The same alloy is needed to keep the city’s heat exchangers intact.',
    minTechnology: 30,
    choices: [
      { id: 'fund', label: 'Fund a prototype', detail: 'Bet on a brighter horizon.', deltas: { technology: 20, energy: -20 }, setFlags: ['mirror-funded'], delay: { turns: 3, deltas: { energy: 25 }, message: 'The prototype mirror redirected enough scattered light to ease the heliostat load.' }, storyEffects: { meetCharacters: ['elias'], relationships: { elias: 5 }, discoverEvidence: ['prototype-mirror-data'] } },
      { id: 'shelve', label: 'Shelve the proposal', detail: 'Keep critical systems supplied.', deltas: { energy: 10, order: 10 }, setFlags: ['mirror-shelved'] },
    ], once: true,
  },
  {
    id: 'last-transmission', priority: 55, title: 'A message from the ridge', location: 'LONG-RANGE RADIO · NORTH BAND', category: 'LATE CAMPAIGN',
    description: 'The northern ridge settlement is transmitting on the signal you found below the metro. They have observed the same thinning cloud band. They ask whether your city is willing to share its remaining power for one coordinated experiment.',
    minDay: 6,
    requiresFlags: ['signal-investigated'],
    choices: [
      { id: 'coordinate', label: 'Coordinate the experiment', detail: 'Share scarce power for a shared chance.', deltas: { energy: -30, technology: 25, order: 15 }, setFlags: ['ridge-alliance'], delay: { turns: 2, deltas: { energy: 25, technology: 15 }, message: 'The coordinated experiment held. Both settlements now have a more efficient power model.', storyEffects: { discoverEvidence: ['ridge-coordinate-schedule'], relationships: { elias: 5 } } }, storyEffects: { relationships: { ilya: 2 } } },
      { id: 'protect', label: 'Keep the power at home', detail: 'Secure your city before reaching outward.', deltas: { energy: 10, order: -10 }, setFlags: ['ridge-refused'], storyEffects: { relationships: { ilya: -3, elias: -4 } } },
    ], once: true,
  },
  {
    id: 'dawn-equation', priority: 60, title: 'The dawn equation', location: 'HELIOSTAT ARRAY · CORE', category: 'FINAL DECISION',
    description: 'The pieces finally align: the atmospheric readings, the transmitter’s old model, and the array’s new cycle. You can attempt a city-wide pulse designed to clear a narrow corridor in the cloud layer. It may give the city its first true dawn — or consume the last of its reserves.',
    minDay: 10,
    minTechnology: 45,
    requiresFlags: ['sky-scanned'],
    requiresEvidence: ['atmospheric-window-anomaly'],
    choices: [
      { id: 'pulse', label: 'Attempt the dawn pulse', detail: 'Risk everything for a new beginning.', deltas: { energy: -50, technology: 25, order: 20 }, setFlags: ['dawn-attempted'], delay: { turns: 2, deltas: { energy: 50, population: 15 }, message: 'A pale seam opened above the city. It is not morning yet, but the light is real.', setFlags: ['dawn-reached'], storyEffects: { revealTruths: ['narrow-light-corridor-confirmed'], districts: { core: 'recovering' } } }, storyEffects: { relationships: { mara: 2, elias: 4 }, districts: { core: 'strained' } } },
      { id: 'stabilise', label: 'Stabilise the array first', detail: 'Choose survival over a gamble.', deltas: { energy: 15, technology: 10, order: 10 }, setFlags: ['dawn-deferred'] },
    ], once: true,
  },

  {
    id: 'blackout-aftermath', priority: 110, title: 'The dark has a street address', location: 'WESTERN HABITATS · CLINIC STAIRWELL', category: 'CONSEQUENCE / POWER',
    description: 'By the second watch, the blackout is no longer a line on a grid map. The western stairwells have become cold wells. The clinic reports three patients whose heating packs have failed, while citizens ask why the council hall is still lit. Your first order saved the reserve. Now the city is asking who was made to pay for it.',
    quote: '“You can call it a controlled blackout from the warm side of the glass.”',
    requiresFlags: ['blackout-policy'], excludesFlags: ['lights-restored'], once: true,
    choices: [
      { id: 'restore-lights', label: 'Reconnect the clinic and stairwells', detail: 'Spend the reserve where the cold is killing people first.', deltas: { energy: -15, order: 20, population: 10 }, setFlags: ['lights-restored'], note: 'The stairwell lamps return one by one. Nobody cheers, but the clinic stops sending red alerts.', storyEffects: { relationships: { ilya: 8, vale: -2 }, districts: { west: 'recovering' }, discoverEvidence: ['blackout-impact-log'] } },
      { id: 'extend-dark', label: 'Extend the blackout outward', detail: 'Protect the core by asking more districts to endure.', deltas: { energy: 20, order: -20, population: -10 }, setFlags: ['blackout-extended'], note: 'The city saves power. The outer ring begins marking dark windows with white cloth.', storyEffects: { relationships: { ilya: -8, vale: 4 }, districts: { west: 'dark', lower: 'dark' } } },
    ],
  },
  {
    id: 'mirror-fractures', priority: 105, title: 'A sun with a broken edge', location: 'HELIOSTAT ARRAY · EAST MIRROR BANK', category: 'CONSEQUENCE / INFRASTRUCTURE',
    description: 'The overdrive bought eleven minutes of warmth. Then the eastern mirror bank split, sending bright fragments across the maintenance apron. The artificial sun now has an uneven edge, a bright wound moving across the low cloud. Engineers can save the core if they enter the gantry during the next power trough. The window will not last.',
    quote: '“It is still shining. That is not the same as still working.”',
    requiresFlags: ['sun-overdriven'], excludesFlags: ['array-repaired', 'array-isolated'], once: true,
    choices: [
      { id: 'repair-mirrors', label: 'Send the mirror crew', detail: 'Risk the gantry shift to restore a stable beam.', deltas: { energy: -25, technology: 15 }, setFlags: ['array-repaired'], note: 'The crew locks a replacement panel into the eastern bank. The sun steadies, weaker but whole.', storyEffects: { relationships: { mara: 10 }, districts: { core: 'recovering' } } },
      { id: 'isolate-mirrors', label: 'Isolate the damaged bank', detail: 'Accept less light to prevent a wider failure.', deltas: { energy: 10, order: -10 }, setFlags: ['array-isolated'], note: 'The damaged mirrors turn black. The skyline loses a blade of light, but the core stops shaking.', storyEffects: { relationships: { mara: 2 }, districts: { core: 'strained' } } },
    ],
  },
  {
    id: 'plaza-after-sirens', priority: 100, title: 'Lanterns without flames', location: 'CENTRAL PLAZA · CIVIC STEPS', category: 'CONSEQUENCE / PUBLIC ORDER',
    description: 'After the ration hall was cleared, families walked to the central plaza carrying unlit lanterns. They are not attacking the city; they are asking whether the city still recognises them. Your security chief wants authority to close the bridges before the gathering spreads. Across the plaza, a child has written a single word in frost: “HOME.”',
    requiresAnyFlags: ['shelter-raided', 'hall-cleared', 'clerk-punished', 'curfew-imposed'], excludesFlags: ['assembly-held'], once: true,
    choices: [
      { id: 'plaza-assembly', label: 'Meet them in the open', detail: 'Give the crowd a voice before it becomes a force.', deltas: { order: 20, food: -10 }, setFlags: ['assembly-held'], note: 'You speak without the security chief beside you. The lanterns stay unlit, but the crowd gives you one more night.', storyEffects: { relationships: { ilya: 10, vale: -5 }, districts: { south: 'recovering' } } },
      { id: 'plaza-curfew', label: 'Impose a night curfew', detail: 'Secure the bridges and accept the cost.', deltas: { energy: 15, order: -25, population: -10 }, setFlags: ['curfew-imposed'], note: 'The bridges close at dusk. In the morning, the public channel is silent—and so is the clinic queue.', storyEffects: { relationships: { ilya: -15, vale: 12 }, districts: { south: 'sealed' } } },
    ],
  },
  {
    id: 'greenhouse-network', priority: 95, title: 'A green light spreads', location: 'SHELTER NINE · ROOFTOP GARDEN', category: 'CONSEQUENCE / FOOD SECURITY',
    description: 'The garden lamps have become the only steady green light anyone has seen outside a laboratory in months. The botanists believe the hardy strain can be copied into three dormant cultivation stacks. It will take power away from public warmth for a time, but the city could trade a little heat tonight for food next week.',
    requiresAnyFlags: ['mold-study', 'seed-vault-saved'], excludesFlags: ['greenhouse-network-live', 'greenhouse-paused'], once: true,
    choices: [
      { id: 'link-grow-lamps', label: 'Link the grow-lamp network', detail: 'Build a small food system that can outlast this winter.', deltas: { energy: -10, food: 20, order: 10 }, setFlags: ['greenhouse-network-live'], note: 'Three dormant domes take on a green pulse. For the first time, the food forecast includes a future tense.', storyEffects: { relationships: { ilya: 5 }, districts: { south: 'recovering' } } },
      { id: 'return-grow-lamps', label: 'Return the lamps to heating', detail: 'Keep people warm now; accept a smaller harvest later.', deltas: { energy: 15, food: -10, order: -10 }, setFlags: ['greenhouse-paused'], note: 'The garden dims. Residents carry its seed trays indoors rather than abandon them.', storyEffects: { relationships: { ilya: -2 }, districts: { south: 'strained' } } },
    ],
  },
  {
    id: 'signal-echo', priority: 90, title: 'The forecast from thirteen years ago', location: 'OLD METRO · LINE 9 TRANSMITTER', category: 'CONSEQUENCE / DISCOVERY',
    description: 'Once cleaned, the transmitter plays a weather report recorded thirteen years before the sun stopped rising. The forecaster describes a solar event, then a second signal interrupts with coordinates beyond the northern ridge. The message is not a distress call. It is a schedule—repeating every nine hours, as if someone expected the darkness to last.',
    quote: '“If the light fails, do not point your mirrors at the sun. Point them at the gap.”',
    requiresFlags: ['signal-investigated'], excludesFlags: ['signal-decoded', 'signal-cut'], once: true,
    choices: [
      { id: 'decode-forecast', label: 'Decode the full archive', detail: 'Spend power to find the pattern inside the old weather data.', deltas: { energy: -10, technology: 20 }, setFlags: ['signal-decoded'], note: 'The schedule aligns with the atmospheric pulse recorded above the northern ridge. The signal is a map, not a warning.', storyEffects: { relationships: { elias: 8, nadia: 2 }, discoverEvidence: ['dawnline-schedule'], revealTruths: ['signal-is-schedule'] } },
      { id: 'broadcast-coordinates', label: 'Broadcast the coordinates', detail: 'Let the city and any neighbours decide what the signal means.', deltas: { order: 10, technology: 10 }, setFlags: ['signal-shared'], note: 'The coordinates go out on every public band. Somewhere beyond the ridge, a reply begins to form.', storyEffects: { relationships: { ilya: 5, elias: 2 }, discoverEvidence: ['public-broadcast-copy'] } },
      { id: 'cut-transmitter', label: 'Cut the transmitter power', detail: 'Stop an unknown system from drawing on the grid.', deltas: { energy: 10, order: -10 }, setFlags: ['signal-cut'], note: 'The pulse dies. Its last sequence remains in the archive, unfinished.', storyEffects: { relationships: { elias: -8, nadia: -2 } } },
    ],
  },
  {
    id: 'mara-intake', title: 'A briefing behind closed glass', location: 'MUNICIPAL CORE · ENGINEERING BRIEFING ROOM', category: 'ACT I / THE FIRST CRACK',
    description: 'The grid report is still scrolling when Dr. Mara Venn enters with a frost-stiffened folder. Commander Vale follows, carrying an evacuation list that has not been authorised. Neither agrees on what the city should hear. You have one briefing before the first public bulletin goes out.',
    quote: '“A machine can fail quietly. A government never does.”',
    requiresFlags: ['resolved:failing-grid'], once: true,
    choices: [
      { id: 'brief-openly', label: 'Brief the city in public', detail: 'Admit what is known and what is still uncertain.', deltas: { order: 10, energy: -10 }, setFlags: ['briefing-public'], note: 'The bulletin includes the damaged grid map and the names of the districts at risk. It is not reassuring, but it is verifiable.', storyEffects: { meetCharacters: ['mara', 'ilya', 'vale', 'nadia'], relationships: { ilya: 5, nadia: 5, vale: -2, mara: 1 } } },
      { id: 'brief-private', label: 'Give Mara the original logs', detail: 'Prioritise diagnosis before public explanation.', deltas: { technology: 10, energy: -10 }, setFlags: ['briefing-private'], note: 'Mara keeps the unfiltered telemetry. She says one routing interval is missing from the official maintenance copy.', storyEffects: { meetCharacters: ['mara', 'vale'], relationships: { mara: 8, vale: -2, ilya: -2 }, discoverEvidence: ['safe-cycle-calculation'] } },
      { id: 'brief-security', label: 'Let Vale control the briefing', detail: 'Keep messaging consistent and the streets predictable.', deltas: { order: 15, technology: -10 }, setFlags: ['security-first'], note: 'The bulletin calls the outage a controlled precaution. Vale gets the authority he asked for; the engineers are told not to discuss the missing interval.', storyEffects: { meetCharacters: ['mara', 'vale', 'ilya'], relationships: { vale: 8, ilya: -5, mara: -3 }, districts: { west: 'sealed' } } },
    ],
  },
  {
    id: 'west-temperature-map', title: 'The map that was not sent', location: 'WESTERN GRID · THERMAL MAPPING ROOM', category: 'ACT I / EVIDENCE',
    description: 'A technician finds a temperature map that should have been attached to the grid report. It shows the western blocks cooling faster than the public bulletin admitted. The final page bears an access code from a maintenance office outside the normal shift rotation.',
    requiresFlags: ['resolved:mara-intake'], once: true,
    choices: [
      { id: 'publish-map', label: 'Publish the full temperature map', detail: 'Give residents evidence they can check for themselves.', deltas: { order: 10, energy: -10 }, setFlags: ['temperature-map-published'], note: 'The map spreads through the local mesh. The council loses control of the story, but the clinic can prioritise the coldest buildings.', storyEffects: { relationships: { ilya: 6, vale: -4, nadia: 2 }, discoverEvidence: ['west-grid-temperature-map'] } },
      { id: 'restrict-map', label: 'Keep the map inside command', detail: 'Avoid panic and retain operational flexibility.', deltas: { energy: 10, order: -10 }, setFlags: ['temperature-map-restricted'], note: 'The map is sealed as an operational document. Vale approves; Ilya begins asking why the public bulletin has no source data.', storyEffects: { relationships: { vale: 5, ilya: -5 }, discoverEvidence: ['west-grid-temperature-map'] } },
      { id: 'audit-map', label: 'Compare it with the maintenance logs', detail: 'Spend time to find who altered the report.', deltas: { technology: 10, energy: -10 }, setFlags: ['temperature-map-audited'], note: 'The timestamps do not match the normal shift roster. The missing interval was removed after the readings were recorded.', storyEffects: { relationships: { mara: 5, nadia: 3 }, discoverEvidence: ['west-grid-temperature-map', 'maintenance-routing-anomaly'] } },
    ],
  },
  {
    id: 'council-evacuation-draft', priority: 86, title: 'The evacuation draft', location: 'MUNICIPAL CORE · EMERGENCY COUNCIL', category: 'ACT I / CONDITIONAL CRISIS',
    description: 'A draft order lists the districts that would be abandoned if the Dawn Engine falls below its minimum output. It was written before tonight’s failure and already names the western habitats. The document has no signatures, but its calculations use the same missing maintenance interval.',
    requiresAnyFlags: ['blackout-policy', 'blackout-extended', 'evacuation-alert'], excludesFlags: ['evacuation-plan-public', 'evacuation-secret', 'evacuation-rejected'], once: true,
    choices: [
      { id: 'publish-evacuation', label: 'Publish the draft and its assumptions', detail: 'Let every district prepare before an order is necessary.', deltas: { order: 10, energy: -10 }, setFlags: ['evacuation-plan-public'], note: 'The draft becomes a public contingency plan rather than a secret list. The city can argue about it before the alarms begin.', storyEffects: { relationships: { ilya: 5, nadia: 3, vale: -4 }, discoverEvidence: ['evacuation-contingency-draft'] } },
      { id: 'delegate-evacuation', label: 'Put Vale in charge of contingencies', detail: 'Prepare routes quietly and centralise responsibility.', deltas: { order: 15, population: -10 }, setFlags: ['evacuation-secret'], note: 'Vale begins mapping routes and supply locks. The plan may be more executable, but nobody outside command knows who will be left behind.', storyEffects: { relationships: { vale: 8, ilya: -6 }, discoverEvidence: ['evacuation-contingency-draft'] } },
      { id: 'reject-evacuation', label: 'Reject the draft for now', detail: 'Refuse to treat abandonment as inevitable.', deltas: { energy: 10, order: -10 }, setFlags: ['evacuation-rejected'], note: 'The document is returned unsigned. Mara warns that rejecting the paper does not remove the engineering conditions that produced it.', storyEffects: { relationships: { mara: 3, vale: -3 }, discoverEvidence: ['evacuation-contingency-draft'] } },
    ],
  },
  {
    id: 'ilya-clinic-visit', priority: 83, title: 'The clinic after curfew', location: 'WESTERN HABITATS · COMMUNITY CLINIC', category: 'ACT I / CHARACTER',
    description: 'Ilya Sen arrives carrying a list of residents treated for cold injuries. She does not ask you to reverse the whole policy. She asks why no one from the administration came to see the clinic before deciding which stairwells could go dark. Vale waits outside the door, listening.',
    requiresAnyFlags: ['blackout-policy', 'blackout-extended', 'hospital-denied', 'shelter-raided'], excludesFlags: ['clinic-visit-resolved'], once: true,
    choices: [
      { id: 'hear-clinic', label: 'Hear every case in person', detail: 'Spend time with residents before issuing another order.', deltas: { population: 10, order: 10 }, setFlags: ['clinic-visit-resolved', 'clinic-heard'], note: 'The clinic staff give Ilya the floor. She leaves with no promise of a miracle, but with a direct line to the administration.', storyEffects: { meetCharacters: ['ilya'], relationships: { ilya: 10, vale: -3 }, districts: { west: 'recovering' } } },
      { id: 'security-clinic', label: 'Let Vale conduct the review', detail: 'Secure the clinic and standardise the incident reports.', deltas: { order: 10, population: -10 }, setFlags: ['clinic-visit-resolved', 'clinic-security-review'], note: 'The clinic becomes quiet and orderly. Several residents decline to sign their statements.', storyEffects: { meetCharacters: ['vale', 'ilya'], relationships: { vale: 7, ilya: -8 }, districts: { west: 'strained' } } },
      { id: 'clinic-reserve', label: 'Allocate emergency heat packs', detail: 'Use reserve power for those already injured.', deltas: { energy: -10, population: 10 }, setFlags: ['clinic-visit-resolved', 'clinic-reserve-used'], note: 'The heaters and heat packs come back online. It will cost the city elsewhere tonight, but the clinic stops reporting new cold injuries.', storyEffects: { relationships: { ilya: 6, mara: 2 }, districts: { west: 'recovering' } } },
    ],
  },
  {
    id: 'vale-night-patrol', priority: 74, title: 'A patrol without orders', location: 'LOWER DISTRICT · EAST STAIR BRIDGE', category: 'ACT I / SECURITY',
    description: 'Security teams have begun checking ration cards at the bridge, although no curfew has been declared. Vale says his officers are preventing hoarding and sabotage. Ilya says the checks are turning ordinary travel into a loyalty test. Neither can prove that the other is wrong.',
    minDay: 4, requiresAnyFlags: ['unrest-alert', 'security-first', 'blackout-extended'], excludesFlags: ['patrol-policy-set'], once: true,
    choices: [
      { id: 'patrol-liaisons', label: 'Attach civilian liaisons to patrols', detail: 'Keep the bridge safe without making every resident a suspect.', deltas: { order: 10, energy: -10 }, setFlags: ['patrol-policy-set', 'patrol-liaisons'], storyEffects: { relationships: { ilya: 5, vale: -3 }, districts: { lower: 'stable' } }, note: 'A resident representative joins every shift. The patrols remain, but people now know where to challenge an order.' },
      { id: 'patrol-checkpoints', label: 'Give Vale checkpoint authority', detail: 'Prioritise control while the city is unstable.', deltas: { order: 15, population: -10 }, setFlags: ['patrol-policy-set', 'patrol-checkpoints'], storyEffects: { relationships: { vale: 8, ilya: -8 }, districts: { lower: 'sealed' } }, note: 'The bridge queue shortens. So does the list of residents willing to speak to the administration.' },
      { id: 'patrol-limit', label: 'Limit patrols to emergency calls', detail: 'Accept uncertainty to protect ordinary movement.', deltas: { order: -10, technology: 10 }, setFlags: ['patrol-policy-set', 'patrol-limited'], storyEffects: { relationships: { vale: -5, ilya: 4 }, districts: { lower: 'recovering' } }, note: 'The bridge opens. Vale records his objection in the official log.' },
    ],
  },
  {
    id: 'storehouse-manifest', title: 'Cargo for a building that is not there', location: 'CIVIC STOREHOUSE · SEALED LOADING BAY', category: 'ACT I / INVESTIGATION',
    description: 'The missing ration ledger leads to a shipment manifest for food, copper cable, and two thermal regulators. The cargo was signed out to a relay maintenance station that does not appear on Vesper’s civic map. A clerk’s mark beside the order matches the timestamp missing from the western grid report.',
    requiresFlags: ['resolved:ration-ledger'], once: true,
    choices: [
      { id: 'preserve-manifest', label: 'Preserve the original manifest', detail: 'Keep the chain of custody intact for an independent audit.', deltas: { food: -10, technology: 10 }, setFlags: ['manifest-preserved'], note: 'The original is sealed with two witnesses. The destination code is still redacted, but the cargo count can no longer be quietly changed.', storyEffects: { meetCharacters: ['nadia'], relationships: { nadia: 6, vale: -2 }, discoverEvidence: ['ration-depot-manifest', 'audit-chain-of-custody'] } },
      { id: 'follow-courier', label: 'Follow the next delivery', detail: 'Trade a little order for a route no map records.', deltas: { order: -10, technology: 15 }, setFlags: ['courier-followed'], note: 'A small team tracks the empty cargo sled through a closed service tunnel. Its wheel marks end at a locked Line 9 access door.', storyEffects: { meetCharacters: ['elias', 'nadia'], relationships: { elias: 3, nadia: 3, vale: -4 }, discoverEvidence: ['unlisted-relay-manifest', 'northern-route-map'] } },
      { id: 'suppress-manifest', label: 'Seal the discrepancy as an accounting error', detail: 'Keep the storehouse running and avoid a public fracture.', deltas: { food: 10, order: -10 }, setFlags: ['manifest-suppressed'], delay: { turns: 2, deltas: { order: -10, technology: 10 }, message: 'A duplicate copy of the sealed manifest reaches a night clerk. Its timestamp contradicts the official explanation.', setFlags: ['manifest-copy-leaked'], storyEffects: { discoverEvidence: ['clerk-deposition-hidden'] } }, note: 'The manifest is refiled as a duplicate. A copy survives in the clerk’s own ledger, but it will now take more work to authenticate.', storyEffects: { meetCharacters: ['nadia'], relationships: { nadia: -5, vale: 4 }, discoverEvidence: ['ration-depot-manifest'] } },
      { id: 'community-audit-network', label: 'Build a community chain of custody', detail: 'Ilya can recruit the queue witnesses—but only if they trust you with the original ledger.', requiresEvidence: ['ration-diversion-ledger'], requiresRelationship: [{ character: 'ilya', min: 5 }], deltas: { food: -10, order: -10, technology: 10 }, setFlags: ['community-audit-network'], delay: { turns: 2, deltas: { order: 10, technology: 10 }, message: 'Residents independently corroborate the missing allotments. The council can no longer dismiss the case as a duplicate.', setFlags: ['community-audit-corroborated'], storyEffects: { discoverEvidence: ['clerk-deposition-hidden'] } }, note: 'Ilya gathers signed recollections from the ration queue and Nadia seals them with the manifest. You spend political calm to make the evidence survive pressure.', storyEffects: { meetCharacters: ['ilya', 'nadia'], relationships: { ilya: 6, nadia: 4, vale: -2 }, discoverEvidence: ['audit-chain-of-custody', 'restricted-relay-routing'] } },
    ],
  },
  {
    id: 'frost-witness', priority: 81, title: 'The witness at the stairwell', location: 'WESTERN HABITATS · STAIRWELL 6', category: 'ACT I / CONSEQUENCE',
    description: 'A building attendant has kept a handwritten count of the residents moved during the blackout. The list includes names missing from the official census and one person recorded as transferred to the unlisted relay station. The attendant will testify, but only if their family is protected.',
    requiresAnyFlags: ['blackout-extended', 'unrest-alert'], excludesFlags: ['frost-witness-resolved'], once: true,
    choices: [
      { id: 'protect-witness', label: 'Protect the attendant and record the testimony', detail: 'Secure evidence without turning a witness into a target.', deltas: { order: -10, technology: 10 }, setFlags: ['frost-witness-resolved', 'witness-protected'], note: 'The testimony is duplicated in three independent archives. The census discrepancy can no longer be dismissed as a clerical error.', storyEffects: { relationships: { ilya: 7, nadia: 4, vale: -3 }, discoverEvidence: ['blackout-impact-log', 'jorel-census-gap'] } },
      { id: 'security-interview', label: 'Let security take the statement', detail: 'Protect the witness through official channels.', deltas: { order: 10, population: -10 }, setFlags: ['frost-witness-resolved', 'witness-security-file'], note: 'Vale promises the family protection. The public will not see the testimony, but an authenticated copy enters the security archive.', storyEffects: { relationships: { vale: 6, ilya: -5 }, discoverEvidence: ['blackout-impact-log'] } },
      { id: 'let-witness-leave', label: 'Move the witness to a safe district', detail: 'Avoid a confrontation and preserve their choice.', deltas: { energy: -10, order: 10 }, setFlags: ['frost-witness-resolved', 'witness-relocated'], note: 'The attendant leaves with their family. They take the original list, and Nadia records that the city chose not to seize it.', storyEffects: { relationships: { ilya: 2, vale: -2 }, districts: { west: 'recovering' } } },
    ],
  },
  {
    id: 'quill-archive-request', title: 'The archive has a second lock', location: 'MUNICIPAL ARCHIVE · SUBLEVEL B', category: 'ACT I / HISTORICAL RECORD',
    description: 'Nadia Quill agrees to open the First Night index, but a second lock requires a reason to access it. She shows you a catalogue entry for a planetary maintenance authority removed from every public history: DAWNLINE. The underlying file is absent; the catalogue record remains.',
    requiresFlags: ['resolved:ration-audit'], once: true,
    choices: [
      { id: 'respect-archive', label: 'Request access under a public audit', detail: 'Let the archive rules protect the record and the people named in it.', deltas: { technology: 10, order: 10 }, setFlags: ['archive-access-approved'], note: 'Nadia opens the catalogue trail and registers who accessed it. The name DAWNLINE enters the official record without yet explaining what it did.', storyEffects: { meetCharacters: ['nadia'], relationships: { nadia: 8, ilya: 3 }, discoverEvidence: ['first-night-index'] } },
      { id: 'force-archive', label: 'Use emergency authority to open it', detail: 'Get the record now and deal with legitimacy later.', deltas: { technology: 15, order: -10 }, setFlags: ['archive-forced'], note: 'The lock opens. One page is missing from the file, and Nadia records the forced access in her private index.', storyEffects: { meetCharacters: ['nadia', 'vale'], relationships: { nadia: -8, vale: 5 }, discoverEvidence: ['first-night-index', 'archive-access-log'] } },
      { id: 'defer-archive', label: 'Leave the second lock closed', detail: 'Continue with evidence already in hand.', deltas: { order: 10, technology: -10 }, setFlags: ['archive-deferred'], note: 'Nadia closes the archive but gives you the catalogue number. It can be reopened later if the case becomes stronger.', storyEffects: { relationships: { nadia: 2 }, discoverEvidence: ['first-night-index'] } },
    ],
  },
  {
    id: 'ration-audit', title: 'Two ledgers, one missing hour', location: 'CIVIC AUDIT ROOM · RECORDS TABLE', category: 'ACT I / CLIMAX EVIDENCE',
    description: 'The ration manifest and the grid log overlap for exactly one hour. During that interval, food and thermal regulators were sent to a relay station under a code that is not in the civic directory. The records are incomplete, but the pattern is now repeatable.',
    requiresFlags: ['resolved:storehouse-manifest'], once: true,
    choices: [
      { id: 'independent-audit', label: 'Commission an independent audit', detail: 'Spend time and political capital to make the evidence hold.', deltas: { technology: 10, order: -10 }, setFlags: ['independent-audit'], note: 'Two auditors independently reproduce the discrepancy. The destination remains unknown, but the shipment was real.', storyEffects: { meetCharacters: ['nadia', 'mara'], relationships: { nadia: 5, mara: 3, vale: -2 }, discoverEvidence: ['audit-chain-of-custody', 'restricted-relay-routing'] } },
      { id: 'council-audit', label: 'Keep the audit inside the council', detail: 'Protect the investigation from public pressure.', deltas: { order: 10, technology: 10 }, setFlags: ['council-audit'], note: 'The council confirms the discrepancy in closed session. The evidence survives, but only a small group knows the relay exists.', storyEffects: { relationships: { nadia: 2, vale: 3 }, discoverEvidence: ['restricted-relay-routing'] } },
      { id: 'close-audit', label: 'Close the audit as incomplete', detail: 'Do not accuse anyone without a destination or a witness.', deltas: { food: 10, order: -10 }, setFlags: ['audit-closed'], note: 'The case is marked inconclusive. Nadia keeps the duplicate manifest; it can be reopened if another record corroborates it.', storyEffects: { relationships: { nadia: -3, ilya: -2 }, discoverEvidence: ['ration-depot-manifest'] } },
    ],
  },
  {
    id: 'census-of-missing', title: 'Names removed from the census', location: 'MUNICIPAL ARCHIVE · POPULATION REGISTER', category: 'ACT I / HUMAN COST',
    description: 'The official population count is larger than the list of residents assigned to districts. Some people were transferred during the First Night; others disappeared from the register after the western grid incident. One entry is repeated in two different hands: Jorel Sen, transfer destination redacted.',
    requiresFlags: ['resolved:maintenance-shift-log'], once: true,
    choices: [
      { id: 'trace-jorel', label: 'Trace Jorel’s transfer record', detail: 'Follow the human trail even if the city has to explain its own numbers.', deltas: { technology: 10, order: -10 }, setFlags: ['jorel-trace-open'], note: 'The transfer number matches the unlisted relay manifest. It does not prove Jorel is alive, but it proves his destination was concealed.', storyEffects: { meetCharacters: ['ilya', 'nadia'], relationships: { ilya: 8, nadia: 5, vale: -3 }, discoverEvidence: ['jorel-census-gap', 'unlisted-relay-manifest'] } },
      { id: 'publish-census', label: 'Publish the missing-person discrepancy', detail: 'Give families the truth that the city can verify today.', deltas: { order: 10, population: -10 }, setFlags: ['census-published'], note: 'Families begin submitting names. The public count becomes less tidy and more accurate.', storyEffects: { meetCharacters: ['ilya', 'nadia'], relationships: { ilya: 7, vale: -4, nadia: 4 }, discoverEvidence: ['jorel-census-gap'] } },
      { id: 'seal-census', label: 'Keep the census sealed until names are verified', detail: 'Avoid raising hope or fear on a partial record.', deltas: { order: 10, technology: -10 }, setFlags: ['census-sealed'], note: 'The discrepancy stays out of public circulation. Ilya notices the seal; she does not forget it.', storyEffects: { relationships: { ilya: -5, vale: 4 }, discoverEvidence: ['jorel-census-gap'] } },
    ],
  },
  {
    id: 'maintenance-shift-log', title: 'The missing maintenance interval', location: 'DAWN ENGINE CORE · SHIFT ARCHIVE', category: 'ACT I / TECHNICAL CLUE',
    description: 'Mara retrieves the raw shift log that survived outside the official maintenance archive. The same hour appears in three systems: the western grid, the ration shipment, and an outbound relay handshake. Someone did not merely remove a page. They removed the link between systems.',
    requiresFlags: ['resolved:ration-audit'], once: true,
    choices: [
      { id: 'preserve-raw-log', label: 'Preserve the raw log in three archives', detail: 'Make later alteration difficult, even if the truth spreads.', deltas: { technology: 10, order: -10 }, setFlags: ['raw-log-preserved'], note: 'The raw log is copied to engineering, civic archive, and an offline store. All three show the same outbound relay code.', storyEffects: { meetCharacters: ['mara', 'nadia'], relationships: { mara: 7, nadia: 4 }, discoverEvidence: ['maintenance-routing-anomaly', 'restricted-relay-routing'] } },
      { id: 'summarise-log', label: 'Publish a technical summary', detail: 'Share the anomaly without exposing the full control map.', deltas: { order: 10, technology: 10 }, setFlags: ['log-summary-published'], note: 'The public sees the discrepancy, but not the routing codes. Engineers are invited to submit independent readings.', storyEffects: { meetCharacters: ['mara', 'ilya'], relationships: { ilya: 4, mara: 3 }, discoverEvidence: ['maintenance-routing-anomaly'] } },
      { id: 'hand-log-vale', label: 'Hand the raw log to Vale', detail: 'Let security investigate the unauthorised transmission.', deltas: { order: 15, technology: -10 }, setFlags: ['raw-log-security'], note: 'Vale locks the log in a security vault. He confirms that the relay handshake was real but refuses to disclose who has read it.', storyEffects: { meetCharacters: ['vale', 'mara'], relationships: { vale: 7, mara: -5 }, discoverEvidence: ['maintenance-routing-anomaly'] } },
    ],
  },
  {
    id: 'night-watch-climax', priority: 120, title: 'The relay that answered', location: 'MUNICIPAL CORE · NIGHT WATCH, 02:13', category: 'ACT I / CLIMAX',
    description: 'At 02:13, the relay handshake repeats on the maintenance console. The audit, the shift log, and the census now point to the same unlisted facility. A label appears for less than a second before the terminal blanks: LINE 9. No one in the room knows what is waiting beneath the abandoned metro, only that someone kept it powered while the city froze.',
    requiresFlags: ['resolved:census-of-missing'], once: true,
    choices: [
      { id: 'preserve-line9', label: 'Preserve the trace and authorise a technical inquiry', detail: 'Secure the evidence before anyone tries to erase the route.', deltas: { technology: 10, energy: -10 }, setFlags: ['act-one-complete', 'line-9-route-known', 'line-9-inquiry-authorised'], note: 'The trace is duplicated. Mara identifies the access corridor; Rook is requested for the next phase. You have a lead, not an explanation.', storyEffects: { meetCharacters: ['mara', 'elias', 'nadia'], relationships: { mara: 4, elias: 3, nadia: 3 }, discoverEvidence: ['line-9-transmitter-pulse'], chapter: 2 } },
      { id: 'tell-the-city', label: 'Tell Vesper what the records prove', detail: 'Give the public a lead before rumours fill the silence.', deltas: { order: 10, energy: -10 }, setFlags: ['act-one-complete', 'line-9-route-known', 'line-9-public'], note: 'The city learns that an unlisted relay received supplies during the First Night. The name Line 9 reaches every public band before the council can redact it.', storyEffects: { meetCharacters: ['ilya', 'nadia', 'elias'], relationships: { ilya: 8, nadia: 4, vale: -5 }, discoverEvidence: ['line-9-transmitter-pulse', 'public-broadcast-copy'], chapter: 2 } },
      { id: 'secure-line9', label: 'Give Vale custody of the relay route', detail: 'Keep the lead contained until the city can respond safely.', deltas: { order: 15, technology: -10 }, setFlags: ['act-one-complete', 'line-9-route-known', 'line-9-security-sealed'], note: 'The route is sealed behind an emergency warrant. Vale promises to protect the evidence; Mara warns that secrecy cannot substitute for understanding the machine.', storyEffects: { meetCharacters: ['vale', 'mara'], relationships: { vale: 8, mara: -3, ilya: -4 }, discoverEvidence: ['line-9-transmitter-pulse'], chapter: 2 } },
    ],
  },
  {
    id: 'northern-visitor-interview', title: 'The traveller knows the name', location: 'NORTH GATE · INTERVIEW ROOM', category: 'ACT II / EXTERNAL CONTACT',
    description: 'The traveller who crossed the ridge recognises the unlisted relay code from a cargo sled they saw on the northern road. They refuse to call the place a city. “A settlement,” they say. “People who learned to live with less light.” Nadia asks to verify the route before the council turns a witness into a promise.',
    once: true,
    choices: [
      { id: 'verify-traveller', label: 'Verify the route against the archive', detail: 'Let evidence, not hope, establish the next step.', deltas: { technology: 15, energy: -10 }, setFlags: ['traveller-route-verified'], note: 'The route matches an old cargo schedule. It confirms a path beyond the ridge, not who is waiting at the end.', storyEffects: { relationships: { nadia: 5, elias: 3 }, discoverEvidence: ['northern-route-map', 'ridge-coordinate-schedule'] } },
      { id: 'trust-traveller', label: 'Offer a guarded radio channel', detail: 'Make contact without exposing the city network.', deltas: { order: -10, technology: 10 }, setFlags: ['traveller-channel-open'], note: 'A narrow-band channel opens for six minutes each watch. No voice answers yet, but a distant relay repeats the same nine-hour pulse.', storyEffects: { relationships: { ilya: 4, elias: 4 }, discoverEvidence: ['northern-route-map'] } },
      { id: 'hold-the-story', label: 'Keep the account confidential', detail: 'Protect the traveller while evidence remains thin.', deltas: { order: 10, technology: -10 }, setFlags: ['traveller-account-sealed'], note: 'The traveller is moved to a protected room. The lead remains private, but Nadia records that the route still needs independent proof.', storyEffects: { relationships: { nadia: 2, ilya: -2 } } },
    ],
  },
  {
    id: 'quill-vault-access', title: 'The shelf without a label', location: 'MUNICIPAL ARCHIVE · SUBLEVEL C', category: 'ACT II / HISTORICAL RECORD',
    description: 'Nadia finds a shelf-sized gap in the archive inventory. The catalogue says the missing First Night transcript was checked out after the emergency declaration, but never returned. A second access log exists behind the same classification used for the unlisted relay.',
    once: true,
    choices: [
      { id: 'archive-small-team', label: 'Give Nadia a small research team', detail: 'Move quickly, with a narrow record of who saw the file.', deltas: { technology: 20, order: -10 }, setFlags: ['quill-vault-opened'], note: 'The team recovers a transcript fragment: DAWNLINE was described as a planetary maintenance network, not a city utility.', storyEffects: { relationships: { nadia: 8, mara: 3 }, discoverEvidence: ['first-night-transcript-fragment'] } },
      { id: 'archive-public-witness', label: 'Require an independent public witness', detail: 'Make the discovery harder to suppress later.', deltas: { technology: 10, order: 10 }, setFlags: ['quill-vault-opened', 'archive-witnessed'], note: 'A civic observer signs every page recovered. The fragment is incomplete, but it can no longer be dismissed as a private copy.', storyEffects: { relationships: { nadia: 5, ilya: 4 }, discoverEvidence: ['first-night-transcript-fragment', 'audit-chain-of-custody'] } },
      { id: 'defer-vault', label: 'Leave the shelf sealed for now', detail: 'Protect the archive while another clue is pursued.', deltas: { order: 10, technology: -10 }, setFlags: ['quill-vault-deferred'], note: 'Nadia records the shelf location and keeps the key. The opportunity remains, but the old transcript stays out of reach.', storyEffects: { relationships: { nadia: 2 } } },
    ],
  },
  {
    id: 'vale-contingency-list', title: 'The city that will be left behind', location: 'CIVIL SECURITY · OPERATIONS ROOM', category: 'ACT II / EMERGENCY POWER',
    description: 'An evacuation list marks six districts for abandonment if the Dawn Engine drops below its restart threshold. Vale calls it a planning document. A clinic coordinator recognises three buildings that still hold patients and families who cannot travel in the cold.',
    once: true,
    choices: [
      { id: 'publish-contingency', label: 'Publish the list with the risk model', detail: 'Expose the plan and force the council to defend it.', deltas: { order: -10, technology: 10 }, setFlags: ['contingency-published'], note: 'The list becomes public with the engineering assumptions attached. Vale loses control of the announcement, but residents can challenge the priorities before an evacuation begins.', storyEffects: { relationships: { vale: -10, ilya: 6, mara: 2 }, discoverEvidence: ['evacuation-contingency-draft'] } },
      { id: 'retain-contingency', label: 'Keep it as a restricted fallback', detail: 'Preserve a plan for the worst day without triggering panic.', deltas: { order: 10, energy: 10 }, setFlags: ['contingency-secret'], note: 'Vale keeps the list in the operations vault. He thanks you for the discretion and now expects you to support the order if the threshold is crossed.', storyEffects: { relationships: { vale: 8, ilya: -5 }, discoverEvidence: ['evacuation-contingency-draft'] } },
      { id: 'redesign-contingency', label: 'Require a district-by-district rescue plan', detail: 'Turn the list into a plan to keep people alive.', deltas: { energy: -15, order: 10 }, setFlags: ['contingency-redesigned'], note: 'The list stays restricted, but every district now has a named transport, heating and medical fallback. The plan is more expensive—and less willing to treat people as expendable.', storyEffects: { relationships: { mara: 4, vale: -2, ilya: 4 }, districts: { lower: 'recovering', west: 'recovering' } } },
    ],
  },
  {
    id: 'mara-black-box', title: 'The black box has two clocks', location: 'DAWN ENGINE · MAINTENANCE WELL', category: 'ACT II / TECHNICAL EVIDENCE',
    description: 'Mara isolates the raw controller from the public telemetry. Its clock and the maintenance log disagree by exactly nine hours. The discrepancy could be corruption, a bad repair, or a deliberate time offset used by another system. Resetting the controller now would erase the only live trace.',
    once: true,
    choices: [
      { id: 'preserve-black-box', label: 'Preserve the controller and its power log', detail: 'Keep the proof; accept a slower repair cycle.', deltas: { energy: -15, technology: 15 }, setFlags: ['black-box-preserved'], note: 'Mara makes a cold copy before changing anything. The offset matches Line 9’s repeating window, but not yet its purpose.', storyEffects: { relationships: { mara: 8, elias: 3 }, discoverEvidence: ['black-box-clock-offset', 'maintenance-routing-anomaly'] } },
      { id: 'reset-black-box', label: 'Reset the controller to stop the cascade', detail: 'Protect power delivery and sacrifice the live trace.', deltas: { energy: 15, technology: -10 }, setFlags: ['black-box-reset'], note: 'The controller stabilises. The nine-hour discrepancy is lost from live memory; only earlier copies can preserve it.', storyEffects: { relationships: { mara: -3, vale: 2 }, districts: { core: 'recovering' } } },
      { id: 'replay-clock-edge', label: 'Replay the clock edge with Mara present', detail: 'Use the earlier routing anomaly and earned trust to isolate a second timestamp.', requiresEvidence: ['maintenance-routing-anomaly'], requiresRelationship: [{ character: 'mara', min: 5 }], deltas: { energy: -10, technology: 10, order: -10 }, setFlags: ['clock-edge-replayed'], delay: { turns: 2, deltas: { technology: 10, order: 10 }, message: 'Independent clocks on the ridge reproduce the same nine-hour phase shift. The discrepancy is a verified network feature, not a corrupted log.', setFlags: ['clock-offset-correlated'], storyEffects: { discoverEvidence: ['nine-hour-latency-table'] } }, note: 'Mara agrees to replay the raw edge instead of resetting the controller. The live trace costs time and power, but both engineers sign the result.', storyEffects: { relationships: { mara: 5, elias: 4 }, discoverEvidence: ['black-box-clock-offset', 'maintenance-routing-anomaly'] } },
    ],
  },
  {
    id: 'jorel-trail', title: 'A name on a cargo tag', location: 'CIVIC STOREHOUSE · TAG ARCHIVE', category: 'ACT II / MISSING PERSONS',
    description: 'Ilya brings a transfer number that appears beside Jorel Sen’s name in the old census. The number also appears in a cargo register, but the destination is abbreviated and the receiving signature is missing. The records prove that his transfer was concealed. They do not prove whether he survived.',
    once: true,
    choices: [
      { id: 'trace-jorel-north', label: 'Trace the transfer north', detail: 'Follow the human lead before the cargo route goes cold.', deltas: { technology: 15, order: -10 }, setFlags: ['jorel-route-traced'], note: 'The transfer number aligns with the northern relay schedule. Jorel may have been sent beyond Vesper, but a living witness is still missing.', storyEffects: { relationships: { ilya: 10, nadia: 4, vale: -3 }, discoverEvidence: ['jorel-census-gap', 'northern-route-map', 'ridge-coordinate-schedule'] } },
      { id: 'audit-cargo-tags', label: 'Audit every matching cargo tag', detail: 'Build a case that can survive denial.', deltas: { technology: 20, food: -10 }, setFlags: ['cargo-tag-audit'], note: 'Three tags share the same unlisted destination. One contains a transfer code, not a name; the trail is larger than Jorel alone.', storyEffects: { relationships: { nadia: 6, mara: 3 }, discoverEvidence: ['unlisted-relay-manifest', 'audit-chain-of-custody'] } },
      { id: 'close-jorel-case', label: 'Suspend the search until the city is stable', detail: 'Avoid promising a family what the evidence cannot yet prove.', deltas: { order: 10, energy: 10 }, setFlags: ['jorel-search-suspended'], note: 'Ilya accepts the formal suspension but refuses to call it closure. The record remains open in the civic register.', storyEffects: { relationships: { ilya: -6, vale: 2 }, discoverEvidence: ['jorel-census-gap'] } },
      { id: 'cross-check-transfer', label: 'Cross-check the transfer against the maintenance anomaly', detail: 'Ilya will take the case further if the engineering records are shared with her.', requiresEvidence: ['maintenance-routing-anomaly'], requiresRelationship: [{ character: 'ilya', min: 8 }], deltas: { technology: 10, energy: -10, order: -10 }, setFlags: ['jorel-transfer-crosschecked'], delay: { turns: 1, deltas: { technology: 10 }, message: 'A second maintenance stamp matches the transfer time. Jorel’s route is corroborated; his survival is still unproven.', setFlags: ['jorel-transfer-corroborated'], storyEffects: { discoverEvidence: ['depot-dispatch-ledger'] } }, note: 'Ilya and Nadia match the transfer code against a separate routing copy. It strengthens the trail without pretending a cargo record is a living witness.', storyEffects: { relationships: { ilya: 5, nadia: 3 }, discoverEvidence: ['jorel-transfer-record', 'nine-hour-latency-table'] } },
    ],
  },
  {
    id: 'hidden-depot-access', title: 'The door beneath the storehouse', location: 'CIVIC STOREHOUSE · SUBLEVEL ACCESS', category: 'ACT II / RELAY INVESTIGATION',
    description: 'Behind a retired freight lift is a sealed hatch carrying the same code as the missing shipment. The corridor beyond is powered, swept clean, and lined with sealed ration containers stamped for a northern relay. Their shipment never appeared in Vesper’s public ledger. Someone has maintained it long after the storehouse was supposedly decommissioned.',
    once: true,
    choices: [
      { id: 'public-warrant-depot', label: 'Enter with a public warrant', detail: 'Make the discovery legitimate and difficult to bury.', deltas: { order: -10, technology: 10, food: 20 }, setFlags: ['hidden-depot-entered', 'depot-public-warrant'], note: 'Witnesses document a relay cabinet and a dispatch ledger. The receiving site is beyond the ridge, but no current occupancy record is present.', storyEffects: { relationships: { ilya: 5, nadia: 5, vale: -4 }, discoverEvidence: ['depot-dispatch-ledger', 'restricted-relay-routing'] } },
      { id: 'covert-depot-team', label: 'Send a small team through the service shaft', detail: 'Move quietly, with a risk if security detects you.', deltas: { technology: 15, order: -10, food: 15 }, setFlags: ['hidden-depot-entered', 'depot-covert-entry'], note: 'The team copies a dispatch record before the hatch alarm trips. Vale knows someone entered the service level, but not what was taken.', storyEffects: { relationships: { elias: 5, vale: -5, nadia: 2 }, discoverEvidence: ['depot-dispatch-ledger', 'restricted-relay-routing'] } },
      { id: 'seal-depot-door', label: 'Photograph the hatch and reseal it', detail: 'Keep the evidence without risking an unknown system.', deltas: { energy: 10, order: 10 }, setFlags: ['depot-sealed'], note: 'The hatch is resealed under a numbered order. The powered corridor remains unexplored, but its existence is now recorded.', storyEffects: { relationships: { vale: 3, ilya: -2 }, discoverEvidence: ['depot-hatch-photo'] } },
    ],
  },
  {
    id: 'ledger-second-copy', title: 'The copy that left the city', location: 'NORTH GATE · COURIER RELAY', category: 'ACT II / CORROBORATION',
    description: 'A duplicate dispatch schedule is recovered from the courier route. Its format matches the depot ledger, but its copy was made before the public archive was altered. The two documents independently point toward the ridge relay; neither names a surviving person.',
    once: true,
    choices: [
      { id: 'protect-courier', label: 'Protect the courier and preserve the copy', detail: 'Secure the evidence without prosecuting its carrier.', deltas: { order: -10, technology: 15 }, setFlags: ['courier-protected', 'independent-relay-proof'], note: 'The courier is granted protected status. Two independent records now establish that the relay received supplies after the First Night.', storyEffects: { relationships: { ilya: 5, nadia: 6, vale: -3 }, discoverEvidence: ['ledger-second-copy', 'audit-chain-of-custody'] } },
      { id: 'official-courier-interview', label: 'Take a formal statement under security protection', detail: 'Keep the investigation official and controlled.', deltas: { order: 10, technology: 10 }, setFlags: ['courier-interviewed', 'independent-relay-proof'], note: 'The courier signs a statement that can be challenged in public. The source is protected, though they do not trust Vale with the original copy.', storyEffects: { relationships: { vale: 4, ilya: -2, nadia: 3 }, discoverEvidence: ['ledger-second-copy'] } },
      { id: 'drop-courier-copy', label: 'Keep the copy out of the public record', detail: 'Avoid another political shock while the city is fragile.', deltas: { energy: 10, order: -10 }, setFlags: ['courier-copy-sealed'], note: 'The copy enters a sealed evidence locker. The route remains documented but cannot yet support a public claim.', storyEffects: { relationships: { nadia: -3, vale: 3 }, discoverEvidence: ['ledger-second-copy'] } },
    ],
  },
  {
    id: 'public-hearing', title: 'A hearing with the doors open', location: 'CIVIC HALL · WINTER SESSION', category: 'ACT II / PUBLIC LEGITIMACY',
    description: 'The council meets while the city watches the public channel. The records establish an unlisted relay, a concealed transfer system and a missing First Night transcript. They do not establish what the relay was for—or whether Jorel reached the other end alive. The city wants an answer the evidence cannot yet give.',
    once: true,
    choices: [
      { id: 'hearing-open', label: 'Allow sworn public testimony', detail: 'Share verified facts and mark the unknowns honestly.', deltas: { order: 15, energy: -10 }, setFlags: ['public-hearing-held', 'truth-shared-carefully'], note: 'The hearing publishes the evidence chain and clearly marks what is still unproven. Rumours remain, but the government has not filled the gaps with a convenient story.', storyEffects: { relationships: { ilya: 8, nadia: 5, vale: -5 }, discoverEvidence: ['public-hearing-record'], districts: { lower: 'recovering' } } },
      { id: 'hearing-technical', label: 'Limit testimony to verified technical records', detail: 'Protect witnesses and keep speculation off the record.', deltas: { technology: 15, order: 10 }, setFlags: ['technical-hearing-only'], note: 'The transcript confirms the relay and its schedule, while personal testimony remains sealed. The technical case strengthens; families feel excluded.', storyEffects: { relationships: { mara: 5, nadia: 3, ilya: -4 }, discoverEvidence: ['public-hearing-record'] } },
      { id: 'hearing-suppress', label: 'Postpone the hearing', detail: 'Keep the city focused on immediate survival.', deltas: { energy: 10, order: -15 }, setFlags: ['hearing-postponed'], note: 'The chamber closes without a verdict. The delay buys a little quiet but lets every faction claim the records mean something different.', storyEffects: { relationships: { vale: 4, ilya: -8, nadia: -3 } } },
      { id: 'community-ledger-testimony', label: 'Enter the corroborated community ledger into testimony', detail: 'The queue witnesses have independently confirmed the ration discrepancy.', requiresFlags: ['community-audit-corroborated'], requiresEvidence: ['clerk-deposition-hidden', 'audit-chain-of-custody'], requiresRelationship: [{ character: 'ilya', min: 10 }], deltas: { order: 10, technology: 10, energy: -10 }, setFlags: ['public-hearing-held', 'truth-shared-carefully', 'community-testimony-entered'], note: 'The witness statements and the duplicate ledger agree. Ilya insists the record say exactly what is proved—and what remains unknown.', storyEffects: { relationships: { ilya: 5, nadia: 5, vale: -5 }, discoverEvidence: ['public-hearing-record', 'audit-chain-of-custody'], districts: { lower: 'recovering' } } },
      { id: 'authenticate-leaked-manifest', label: 'Authenticate the leaked manifest before it becomes rumour', detail: 'The delayed leak can be verified, but acknowledging it will damage trust in the council.', requiresFlags: ['manifest-copy-leaked'], requiresEvidence: ['clerk-deposition-hidden'], deltas: { technology: 10, order: -10 }, setFlags: ['public-hearing-held', 'truth-shared-carefully', 'leaked-copy-authenticated'], note: 'The council admits the sealed copy was real and enters it into the public record. The admission costs confidence now, but stops the leak from becoming an untestable rumour.', storyEffects: { relationships: { ilya: 5, nadia: 3, vale: -10 }, discoverEvidence: ['public-hearing-record', 'audit-chain-of-custody'] } },
    ],
  },
  {
    id: 'winter-vote', title: 'Emergency rule, one more month', location: 'CIVIC HALL · FINAL WINTER VOTE', category: 'ACT II / CLIMAX',
    description: 'With the relay evidence in the open or locked behind a security seal, the council must decide how Vesper will face the next month. The Dawn Engine remains fragile. A northern route is now documented, but no one has proved who survives beyond the ridge. The vote will determine who controls the investigation—and whether the next expedition answers to the people or to emergency command.',
    once: true,
    choices: [
      { id: 'vote-oversight', label: 'Renew emergency powers with civilian oversight', detail: 'Keep a coordinated response, with public review and an expiry date.', deltas: { order: 10, technology: 10, energy: -10 }, setFlags: ['act-two-complete', 'winter-vote-oversight', 'act-three-route-public'], note: 'Emergency powers are renewed for thirty days under a civilian review board. The board authorises a northern survey and orders the relay evidence preserved. Vesper enters the next chapter with a public mandate, not a confirmed answer.', storyEffects: { relationships: { ilya: 5, nadia: 4, mara: 3, vale: -2 }, discoverEvidence: ['ridge-coordinate-schedule'], chapter: 3 } },
      { id: 'vote-security', label: 'Give Vale temporary operational command', detail: 'Choose speed and security; accept less public control.', deltas: { order: 15, energy: 10, technology: -10 }, setFlags: ['act-two-complete', 'winter-vote-security', 'act-three-route-sealed'], note: 'Vale receives a time-limited command over the northern operation. The evidence is secured, but Ilya warns that a sealed expedition can become a permanent secret.', storyEffects: { relationships: { vale: 10, ilya: -10, nadia: -3 }, discoverEvidence: ['ridge-coordinate-schedule'], chapter: 3 } },
      { id: 'vote-end-emergency', label: 'End emergency rule and convene a civilian council', detail: 'Restore ordinary authority before the next crisis.', deltas: { order: -10, technology: 10, food: -10 }, setFlags: ['act-two-complete', 'winter-vote-civilian', 'act-three-route-public'], note: 'Emergency authority expires. The civilian council approves an expedition but requires public reporting at every stage. The process is slower, and more people now have a stake in the truth.', storyEffects: { relationships: { ilya: 10, vale: -8, nadia: 5 }, discoverEvidence: ['ridge-coordinate-schedule'], chapter: 3 } },
    ],
  },
  {
    id: 'ridge-map', title: 'A map drawn in nine-hour intervals', location: 'OBSERVATORY · NORTHERN RIDGE TRACK', category: 'ACT III / OPENING',
    description: 'The route map is assembled from the Line 9 schedule, the courier records and the traveller’s weather notes. A narrow corridor in the atmospheric veil repeats every nine hours. On the far side of the ridge, a weak radio beacon answers once—then goes silent. There may be a settlement there, but the signal alone cannot tell you what remains.',
    once: true,
    choices: [
      { id: 'survey-ridge', label: 'Send a survey team with a return deadline', detail: 'Learn what lies beyond the ridge without gambling the city’s only team.', deltas: { energy: -15, food: -10, technology: 15 }, setFlags: ['ridge-survey-launched', 'act-three-opened'], note: 'The team departs with a timed return beacon. The feed now marks the northern route as active; confirmation will depend on what the team finds.', storyEffects: { relationships: { mara: 3, elias: 5, ilya: 3 }, discoverEvidence: ['ridge-survey-order'] } },
      { id: 'broadcast-ridge-route', label: 'Broadcast the route and seek volunteers', detail: 'Share the risk and invite independent witnesses.', deltas: { order: 10, food: -15 }, setFlags: ['ridge-route-broadcast', 'act-three-opened'], note: 'Volunteers begin preparing in the north hall. The route is public, so no single office can quietly rewrite the mission report.', storyEffects: { relationships: { ilya: 6, nadia: 3, vale: -3 }, discoverEvidence: ['ridge-survey-order'] } },
      { id: 'delay-expedition', label: 'Wait for a stronger signal', detail: 'Protect scarce supplies while the beacon remains uncertain.', deltas: { energy: 10, order: 10 }, setFlags: ['ridge-expedition-delayed', 'act-three-opened'], note: 'The expedition is delayed until the beacon repeats. The map stays in the dossier; the next opportunity may come with a cost.', storyEffects: { relationships: { mara: 2, elias: -3 }, discoverEvidence: ['ridge-survey-order'] } },
    ],
  },
  {
    id: 'expedition-prep', title: 'What can travel without heat?', location: 'NORTH GATE · EXPEDITION HALL', category: 'ACT III / DEPARTURE',
    description: 'The winter vote has authorised a trip beyond Vesper’s safe perimeter. The team can carry only what it can protect from the cold. Mara wants instruments and repair tools; Nadia wants a witness and the original records; Vale wants an armed escort. You cannot take every safeguard.',
    once: true,
    choices: [
      { id: 'team-engineers', label: 'Take engineers and a compact repair kit', detail: 'Prioritise the weather station and the damaged relay hardware.', deltas: { energy: -10, technology: 10 }, setFlags: ['expedition-prepared', 'expedition-composition-engineers'], note: 'Mara signs the equipment manifest. The team can repair what it finds, but the official record will depend on its own instruments.', storyEffects: { meetCharacters: ['mara', 'elias'], relationships: { mara: 5, elias: 3 }, discoverEvidence: ['expedition-witness-roster'] } },
      { id: 'team-archive', label: 'Take an archivist and an independent witness', detail: 'Make the evidence harder to alter after the team returns.', deltas: { order: 10, technology: -10 }, setFlags: ['expedition-prepared', 'expedition-composition-archive'], note: 'Nadia seals the record kit and names an independent witness. The mission will move more slowly, but its findings will be difficult to quietly rewrite.', storyEffects: { meetCharacters: ['nadia', 'ilya'], relationships: { nadia: 5, ilya: 3, vale: -2 }, discoverEvidence: ['expedition-witness-roster'] } },
      { id: 'team-security', label: 'Take Vale’s security detail', detail: 'Protect the team and the return route; accept a more guarded mission.', deltas: { order: 10, energy: 10, technology: -10 }, setFlags: ['expedition-prepared', 'expedition-composition-security'], note: 'Vale assigns a small escort and a sealed reporting channel. The team is better protected, but the settlement may see the expedition as a security operation.', storyEffects: { meetCharacters: ['vale'], relationships: { vale: 6, ilya: -5, nadia: -2 } } },
    ],
  },
  {
    id: 'ridge-crossing', title: 'The whiteout crossing', location: 'NORTHERN RIDGE · BEACON LINE', category: 'ACT III / EXPEDITION',
    description: 'The city drops behind a wall of snow. Every nine hours, the atmospheric veil opens a narrow interval in which the ridge beacon can be seen. The team has three plausible routes, none of them safe: follow the beacon window, take the sheltered switchbacks, or cross the exposed pass before the next storm closes in.',
    once: true,
    choices: [
      { id: 'follow-signal-window', label: 'Cross during the nine-hour signal window', detail: 'Trust the timing data and move when the sky briefly clears.', deltas: { energy: -10, technology: 10 }, setFlags: ['ridge-route-signal-window'], note: 'The beacon appears exactly when the schedule predicts. The team records the timing instead of treating it as folklore.', storyEffects: { meetCharacters: ['elias'], relationships: { elias: 5, mara: 2 }, discoverEvidence: ['ridge-crossing-data', 'atmospheric-window-anomaly'], districts: { north: 'strained' } } },
      { id: 'sheltered-switchbacks', label: 'Take the old maintenance switchbacks', detail: 'Spend supplies and time to keep the team out of the open pass.', deltas: { energy: -10, order: 10 }, setFlags: ['ridge-route-sheltered'], note: 'The old service markers still exist under the snow. The route is slow, but the whole team reaches the far slope together.', storyEffects: { relationships: { mara: 3, ilya: 2 }, districts: { north: 'recovering' } } },
      { id: 'cut-exposed-pass', label: 'Cut across the exposed pass', detail: 'Save time and risk the storm catching the convoy.', deltas: { food: -10, energy: 10, order: -10 }, setFlags: ['ridge-route-exposed'], note: 'The convoy reaches the far slope ahead of schedule, but one supply sled overturns. A whiteout is building behind you.', storyEffects: { relationships: { vale: 2, mara: -2 }, discoverEvidence: ['ridge-crossing-data'] } },
    ],
  },
  {
    id: 'ridge-whiteout', title: 'The storm erases the road', location: 'NORTHERN RIDGE · EXPOSED PASS', category: 'ACT III / FIELD CRISIS',
    description: 'The beacon vanishes. Snow moves sideways across the ridge, and the return line is buried in minutes. The team can shelter and wait for the next atmospheric window, spend its emergency battery on one beacon pulse, or keep moving while the exposed route is still downhill.',
    once: true,
    choices: [
      { id: 'anchor-and-wait', label: 'Anchor the sleds and wait out the storm', detail: 'Protect the team at the cost of heat and provisions.', deltas: { energy: -10, food: -10, population: 10 }, setFlags: ['whiteout-waited', 'ridge-whiteout-resolved'], note: 'The team loses time but stays together. The weather station becomes the safest place to recover the signal.', storyEffects: { relationships: { mara: 3, ilya: 2 } } },
      { id: 'fire-emergency-beacon', label: 'Use the emergency battery to mark the route', detail: 'Spend scarce power to leave a trace for the return journey.', deltas: { energy: -10, technology: -10, order: 10 }, setFlags: ['whiteout-beacon-fired', 'ridge-whiteout-resolved'], note: 'A short pulse reflects off the ridge marker. The power pack is spent, but the team has a return bearing.', storyEffects: { discoverEvidence: ['emergency-beacon-trace'], relationships: { elias: 2 } } },
      { id: 'press-downhill', label: 'Keep moving before visibility disappears', detail: 'Avoid being trapped on the pass; accept the risk of injury.', deltas: { population: -10, order: -10, food: -10 }, setFlags: ['whiteout-pushed-through', 'ridge-whiteout-resolved'], note: 'The team reaches the lee side, shaken and short of supplies. No one is lost, but a damaged pack will complicate the station work.', storyEffects: { relationships: { vale: 2, mara: -3 } } },
    ],
  },
  {
    id: 'weather-station', title: 'A station still recording', location: 'NORTH RIDGE · WEATHER STATION K-17', category: 'ACT III / DISCOVERY',
    description: 'A weather station stands above the lee slope, buried to its windows but still drawing a thin line of power. Its exterior clock advances in nine-hour jumps. The station has a live atmospheric sensor, a removable data drive, and a battery bank that could help the team return. You can secure only part of its capability.',
    once: true,
    choices: [
      { id: 'wake-station-array', label: 'Restore power to the live atmospheric array', detail: 'Recover measurements directly from the station, but consume reserve energy.', deltas: { energy: -10, technology: 10 }, setFlags: ['weather-station-recovered', 'weather-station-array-live'], note: 'The station wakes. Its sensor records a repeating control pulse that does not originate in the local weather system.', storyEffects: { relationships: { mara: 4, elias: 5 }, discoverEvidence: ['weather-station-raw-data', 'nine-hour-latency-table', 'atmospheric-window-anomaly'] } },
      { id: 'recover-station-drives', label: 'Remove and shield the data drives', detail: 'Preserve a verifiable record without keeping the station online.', deltas: { technology: 10, energy: -10 }, setFlags: ['weather-station-recovered', 'weather-station-drives-secured'], note: 'The drives survive the cold. Their checksum matches the signal intervals already in Vesper’s archives.', storyEffects: { relationships: { nadia: 4, elias: 3 }, discoverEvidence: ['weather-station-drive', 'weather-station-raw-data', 'nine-hour-latency-table'] } },
      { id: 'strip-station-batteries', label: 'Strip the battery bank for the return trip', detail: 'Keep the expedition supplied, but sacrifice the station’s local archive.', deltas: { energy: 20, technology: -10 }, setFlags: ['weather-station-batteries-stripped'], note: 'The batteries stabilise the sled heater. Most of the station goes dark before the team can image its drives.', storyEffects: { relationships: { mara: -3, vale: 3 } } },
    ],
  },
  {
    id: 'jorel-evacuation-record', title: 'The name marked transferred', location: 'HEARTH-9 · CIVIC REGISTRY', category: 'ACT III / PERSONAL EVIDENCE',
    description: 'The settlement registry contains a transfer entry matching the redacted census record from Vesper. Jorel Sen arrived at Hearth-9 as a transport-systems mechanic. A signed work roster places him at outer mirror post K-17 thirty-six hours before the current exchange. It proves he survived the transfer and was working recently; it does not prove where he is now.',
    once: true,
    choices: [
      { id: 'tell-ilya-verified', label: 'Verify the roster and tell Ilya privately', detail: 'Give his sister the strongest evidence before the city hears rumours.', deltas: { technology: -10, order: 10 }, setFlags: ['jorel-confirmed-alive', 'jorel-news-private'], note: 'The roster signature and a mechanic’s maintenance key match. Ilya learns that Jorel was alive thirty-six hours ago and assigned to the outer mirror post. His present safety remains unknown.', storyEffects: { meetCharacters: ['jorel', 'ilya'], relationships: { ilya: 10, jorel: 8, nadia: 4 }, discoverEvidence: ['jorel-transfer-record', 'jorel-live-roster-entry', 'outer-mirror-post-coordinates'], revealTruths: ['jorel-survived'] } },
      { id: 'publish-jorel-record', label: 'Publish the transfer and work roster', detail: 'Make it harder for either government to erase his trail.', deltas: { order: 10, energy: -10 }, setFlags: ['jorel-confirmed-alive', 'jorel-news-public'], note: 'Vesper receives a verifiable answer: Jorel survived the transfer and worked at K-17 thirty-six hours ago. Publishing it protects the record, but exposes his last known location.', storyEffects: { meetCharacters: ['jorel', 'ilya', 'nadia'], relationships: { ilya: 5, jorel: 5, nadia: 7, vale: -5 }, discoverEvidence: ['jorel-transfer-record', 'jorel-live-roster-entry', 'outer-mirror-post-coordinates'], revealTruths: ['jorel-survived'] } },
      { id: 'seal-jorel-location', label: 'Keep the location restricted until a rescue is possible', detail: 'Confirm the truth privately and protect the outer post from a rush.', deltas: { technology: -10, order: 10 }, setFlags: ['jorel-confirmed-alive', 'jorel-location-sealed'], note: 'The record is authenticated but restricted to the expedition command. Jorel was alive thirty-six hours ago; the team will need a further signal to know whether he is still at K-17.', storyEffects: { meetCharacters: ['jorel'], relationships: { jorel: 5, vale: 5, ilya: -5 }, discoverEvidence: ['jorel-transfer-record', 'jorel-live-roster-entry', 'outer-mirror-post-coordinates'], revealTruths: ['jorel-survived'] } },
    ],
  },
  {
    id: 'ridge-settlement', title: 'A city that learned to wait', location: 'HEARTH-9 · OUTER MIRROR FIELD', category: 'ACT III / FIRST CONTACT',
    description: 'Lights answer from the far slope—not a beacon, but windows. Hearth-9 is a settlement built around a field of repaired mirrors and a sheltered thermal basin. Its people survived by concentrating scattered daylight and keeping the field aligned through the atmospheric cycle. They are real, wary, and short on spare parts. Their council will hear you, but it will not hand over its only lifeline because Vesper asks.',
    once: true,
    choices: [
      { id: 'hearth9-open-contact', label: 'Make first contact in the open', detail: 'Approach as delegates and let both communities witness the meeting.', deltas: { order: 10, energy: -10 }, setFlags: ['settlement-contact-public', 'settlement-alliance'], note: 'The first exchange is recorded by both sides. Hearth-9 confirms its survival and agrees to a technical meeting, not yet a reset or a rescue.', storyEffects: { meetCharacters: ['nadia', 'ilya', 'elias'], relationships: { ilya: 5, nadia: 4, elias: 3, vale: -2 }, discoverEvidence: ['hearth9-arrival-record'], revealTruths: ['ridge-settlement-survived'], districts: { north: 'recovering' } } },
      { id: 'hearth9-code-contact', label: 'Authenticate through the old relay protocol', detail: 'Use technical evidence to show you are not an automated threat.', deltas: { technology: 10, energy: -10 }, setFlags: ['settlement-contact-coded', 'settlement-alliance'], note: 'The station answers with a human verification challenge. Both cities exchange identities and system warnings under a shared maintenance code.', storyEffects: { meetCharacters: ['elias', 'mara', 'nadia'], relationships: { elias: 6, mara: 3, nadia: 3 }, discoverEvidence: ['hearth9-arrival-record', 'settlement-relay-protocol'], revealTruths: ['ridge-settlement-survived'], districts: { north: 'recovering' } } },
      { id: 'hearth9-covert-approach', label: 'Observe the settlement before revealing Vesper’s full plan', detail: 'Reduce the risk of being treated as a threat, but begin without trust.', deltas: { technology: 10, order: -10 }, setFlags: ['settlement-contact-covert'], note: 'The expedition sees a working mirror field and living residents before making contact. Hearth-9 agrees to a guarded meeting; the settlement’s existence is no longer in doubt, but trust remains low.', storyEffects: { meetCharacters: ['vale', 'elias'], relationships: { vale: 3, elias: 2, ilya: -2 }, discoverEvidence: ['hearth9-arrival-record'], revealTruths: ['ridge-settlement-survived'], districts: { north: 'recovering' } } },
    ],
  },
  {
    id: 'remote-mirror', title: 'The mirror field', location: 'HEARTH-9 · FOCUSING ARRAY', category: 'ACT III / SHARED TECHNOLOGY',
    description: 'Hearth-9’s mirror field does not create sunlight; it catches scattered light during brief atmospheric openings and concentrates it over the thermal basin. Its geometry could help Vesper’s researchers model the veil. The settlement cannot spare the whole array, and a poorly calibrated mirror could ruin the light it depends on.',
    once: true,
    choices: [
      { id: 'mirror-data-cooperation', label: 'Ask for calibration data, not the mirrors', detail: 'Share the model and leave the physical lifeline intact.', deltas: { technology: 10, energy: -10 }, setFlags: ['mirror-field-shared', 'settlement-alliance'], note: 'Hearth-9 shares the geometry and its failure limits. No equipment leaves the settlement, but the data can be independently tested.', storyEffects: { relationships: { elias: 5, mara: 3, ilya: 3 }, discoverEvidence: ['remote-mirror-geometry'] } },
      { id: 'mirror-repair-trade', label: 'Offer repair crews in exchange for a test mirror', detail: 'Make the alliance tangible and share the workload.', deltas: { food: -10, energy: -10 }, setFlags: ['mirror-repair-trade', 'mirror-field-shared', 'settlement-alliance'], note: 'Vesper’s engineers repair two damaged mounts; Hearth-9 lends a test mirror under a return agreement.', storyEffects: { relationships: { mara: 5, elias: 3, ilya: 4 }, discoverEvidence: ['remote-mirror-geometry', 'mirror-field-repair-record'] } },
      { id: 'mirror-refuse', label: 'Decline to risk the settlement’s only light source', detail: 'Keep the relationship intact without committing to a joint test.', deltas: { order: 10, technology: 10 }, setFlags: ['mirror-field-not-borrowed'], note: 'The mirror stays in place. You keep the settlement’s trust, but lose an immediate opportunity to test its geometry.', storyEffects: { relationships: { ilya: 2, vale: 3 }, discoverEvidence: ['remote-mirror-geometry'] } },
    ],
  },
  {
    id: 'third-signal-clue', title: 'The voice after the schedule', location: 'HEARTH-9 · RELAY LISTENING ROOM', category: 'ACT III / PERSONAL SIGNAL',
    description: 'A new pulse arrives after the old nine-hour schedule. It is not part of the automated sequence: the timing drifts, pauses, then repeats a human maintenance challenge. The key is registered to Jorel Sen. Someone at the far relay has answered with his code—but the expedition still has to decide whether to respond and reveal its position.',
    once: true,
    choices: [
      { id: 'answer-jorel-code', label: 'Answer with Jorel’s verified work key', detail: 'Confirm the channel while revealing that his records have been found.', deltas: { energy: -10, technology: -10 }, setFlags: ['jorel-current-signal-confirmed', 'jorel-maintenance-channel-open'], note: 'The reply returns with a second challenge signed by Jorel’s active key. This confirms he was transmitting from K-17 after the team left Vesper; his physical safety remains unverified.', storyEffects: { meetCharacters: ['jorel'], relationships: { jorel: 10, ilya: 8, elias: 5 }, discoverEvidence: ['jorel-maintenance-code'], revealTruths: ['jorel-current-signal-confirmed'] } },
      { id: 'record-without-reply', label: 'Record the waveform without answering', detail: 'Preserve the proof and avoid exposing the team’s position.', deltas: { technology: 10, order: 10 }, setFlags: ['jorel-signal-recorded'], note: 'The waveform is preserved with its timing and key signature. You have a credible human-origin signal, but you have not established a live two-way channel.', storyEffects: { relationships: { elias: 3, vale: 2 }, discoverEvidence: ['jorel-maintenance-code'] } },
      { id: 'broadcast-pattern', label: 'Release the signal pattern to both communities', detail: 'Prevent either side from quietly suppressing the new clue.', deltas: { order: 10, energy: -10 }, setFlags: ['signal-pattern-public'], note: 'The timing pattern appears on both civic feeds. The data can be independently checked, but the source may now know that Vesper has recognised the code.', storyEffects: { relationships: { ilya: 5, nadia: 3, vale: -3 }, discoverEvidence: ['jorel-maintenance-code', 'public-jorel-signal-copy'] } },
    ],
  },
  {
    id: 'dawnline-archive-fragment', title: 'A protocol signed by nobody', location: 'HEARTH-9 · WEATHER ARCHIVE', category: 'ACT III / DAWNLINE EVIDENCE',
    description: 'The station logs contain a command header signed by no current operator. Its certificate is valid, but the last human authorisation predates the First Night by minutes. The network has been executing the same protective sequence through thirteen years of disconnected cycles.',
    once: true,
    choices: [
      { id: 'decode-autonomous-header', label: 'Decode the autonomous header', detail: 'Reveal what the network is doing, even if the answer alarms both cities.', deltas: { technology: -10, energy: -10 }, setFlags: ['dawnline-header-decoded'], note: 'The protocol’s control loop is autonomous. Its rules persist even when the original operators are absent.', storyEffects: { meetCharacters: ['elias', 'nadia'], relationships: { elias: 5, nadia: 4, mara: -2 }, discoverEvidence: ['dawnline-header-fragment'], revealTruths: ['dawnline-is-autonomous'] } },
      { id: 'verify-header-with-quill', label: 'Ask Nadia to verify the archive chain first', detail: 'Spend time on provenance before announcing the conclusion.', deltas: { technology: -10, order: -10 }, setFlags: ['dawnline-header-verified'], note: 'Nadia matches the certificate to the surviving index. The network’s commands are valid under an authority that no longer actively answers.', storyEffects: { meetCharacters: ['nadia', 'elias'], relationships: { nadia: 6, ilya: 2, vale: -2 }, discoverEvidence: ['dawnline-header-fragment'], revealTruths: ['dawnline-is-autonomous'] } },
      { id: 'seal-header-fragment', label: 'Preserve the header under technical custody', detail: 'Keep the evidence safe while withholding a claim that cannot yet be acted on.', deltas: { order: 10, technology: 10 }, setFlags: ['dawnline-header-sealed'], note: 'The fragment is copied and sealed. It remains evidence, but the city has not been told what it implies.', storyEffects: { discoverEvidence: ['dawnline-header-fragment'], relationships: { vale: 3, nadia: 2 } } },
    ],
  },
  {
    id: 'proof-of-veil', title: 'The veil has a schedule', location: 'HEARTH-9 · JOINT ANALYSIS TABLE', category: 'ACT III / SCIENTIFIC REVIEW',
    description: 'Weather-station telemetry, the Line 9 timing table and the mirror-field geometry fit one model: the atmospheric veil is not simply frozen in place. A repeating control cycle is actively preserving the conditions around the planet. A final check could strengthen the claim, but waiting carries its own risk.',
    once: true,
    choices: [
      { id: 'peer-review-veil', label: 'Request an independent joint review', detail: 'Take longer and build evidence both cities can trust.', deltas: { technology: -10, order: 10 }, setFlags: ['veil-peer-reviewed'], note: 'Independent analysts reproduce the cycle from separate instruments. The conclusion is no longer based on one city’s clock or one compromised archive.', storyEffects: { relationships: { elias: 5, nadia: 5, ilya: 3 }, discoverEvidence: ['peer-reviewed-veil-cycle'], revealTruths: ['veil-is-maintained'] } },
      { id: 'act-on-provisional-veil', label: 'Act on the provisional model', detail: 'Move quickly, knowing the next experiment must be more conservative.', deltas: { technology: 10, order: -10 }, setFlags: ['veil-model-provisional'], note: 'The team accepts the model as a working hypothesis. It is strong enough to guide a test, but not yet a public scientific consensus.', storyEffects: { relationships: { elias: 3, mara: 2 }, discoverEvidence: ['provisional-veil-model'] } },
      { id: 'keep-veil-analysis-private', label: 'Keep the analysis between the two technical teams', detail: 'Protect the evidence from a premature political fight.', deltas: { order: 10, technology: 10 }, setFlags: ['veil-analysis-restricted'], note: 'Both teams retain their raw data. The public conclusion is delayed, but the technical path remains open.', storyEffects: { relationships: { nadia: 2, vale: 3 }, discoverEvidence: ['restricted-veil-analysis'] } },
      { id: 'third-party-replication', label: 'Commission a third-party replication', detail: 'The raw station drive and Elias’s trust make an independent test possible.', requiresEvidence: ['weather-station-drive'], requiresRelationship: [{ character: 'elias', min: 8 }], deltas: { technology: -10, energy: -10, order: 10 }, setFlags: ['veil-replication-commissioned'], delay: { turns: 2, deltas: { technology: 10, order: 10 }, message: 'Hearth-9 reviewers independently reproduce the timing cycle. The result is admissible at the joint safety table.', setFlags: ['veil-replication-complete'], storyEffects: { discoverEvidence: ['peer-reviewed-veil-cycle'], revealTruths: ['veil-is-maintained'] } }, note: 'Elias sends the raw drive to analysts who were not involved in the original model. You accept a delay in exchange for evidence that can survive political pressure.', storyEffects: { relationships: { elias: 4, nadia: 2 }, discoverEvidence: ['provisional-veil-model'] } },
    ],
  },
  {
    id: 'ridge-envoy', title: 'A representative at the wall', location: 'HEARTH-9 · EASTERN GATE', category: 'ACT III / DIPLOMACY',
    description: 'Hearth-9’s council sends an envoy to establish what contact means. The settlement will not transfer its mirror field to Vesper, but it may share a maintenance window or take part in a joint safety procedure. The envoy asks whether you intend to cooperate as equals or treat the settlement as a resource depot.',
    once: true,
    choices: [
      { id: 'welcome-envoy-publicly', label: 'Welcome the envoy before both communities', detail: 'Make the relationship accountable to the people who will bear its cost.', deltas: { order: 10, energy: -10 }, setFlags: ['ridge-envoy-public', 'settlement-alliance'], note: 'The envoy is received in public. Both sides can now hold their representatives to the same words.', storyEffects: { relationships: { ilya: 5, nadia: 3, vale: -4 }, discoverEvidence: ['hearth9-diplomatic-record'] } },
      { id: 'negotiate-envoy-privately', label: 'Negotiate through Elias and Nadia', detail: 'Build trust through technical work before a public commitment.', deltas: { technology: 10, order: -10 }, setFlags: ['ridge-envoy-private', 'settlement-alliance'], note: 'A quiet technical channel opens. It is faster, but later public approval will depend on what the agreement delivers.', storyEffects: { relationships: { elias: 5, nadia: 5, ilya: 1 }, discoverEvidence: ['hearth9-diplomatic-record'] } },
      { id: 'refuse-envoy', label: 'Decline a formal agreement for now', detail: 'Preserve Vesper’s independence and accept a colder relationship.', deltas: { order: 10, technology: -10 }, setFlags: ['ridge-envoy-refused'], note: 'The envoy leaves without a compact. Contact remains possible, but the settlement will not contribute to a shared operation on trust alone.', storyEffects: { relationships: { vale: 4, ilya: -5, nadia: -2 } } },
    ],
  },
  {
    id: 'cross-settlement-compact', title: 'One protocol, two cities', location: 'HEARTH-9 · JOINT OPERATIONS ROOM', category: 'ACT III / ALLIANCE',
    description: 'With the mirror geometry and the station’s timing data on the same table, the two cities can agree on a common safety protocol. No one is being asked to shut down their own life-support system. The compact would require shared timing data, reciprocal inspection, and a human confirmation before any planetary command is attempted.',
    once: true,
    choices: [
      { id: 'sign-reciprocal-compact', label: 'Sign a reciprocal safety compact', detail: 'Share control data and require both cities to confirm every dangerous step.', deltas: { energy: 10, technology: 10, order: 10 }, setFlags: ['settlement-compact-signed', 'safe-reset-coordination'], note: 'The compact is signed by both councils. It cannot restore sunlight by itself, but it creates a credible path to a coordinated test.', storyEffects: { relationships: { mara: 4, ilya: 5, elias: 5, nadia: 4, vale: -2 }, discoverEvidence: ['settlement-compact-signatures'], revealTruths: ['safe-reset-requires-coordination'] } },
      { id: 'keep-vesper-command', label: 'Keep the operation under Vesper command', detail: 'Retain speed and secrecy at the cost of shared control.', deltas: { energy: 10, technology: 10, order: -10 }, setFlags: ['compact-vesper-command'], note: 'Hearth-9 shares only a limited timing window. It will not authorise a remote command without reciprocal oversight.', storyEffects: { relationships: { vale: 5, ilya: -5, elias: -3 }, discoverEvidence: ['limited-settlement-timing-window'] } },
      { id: 'defer-compact', label: 'Defer until the outer relay is secured', detail: 'Do not promise a joint reset while Jorel’s location remains exposed.', deltas: { order: 10, food: -10 }, setFlags: ['compact-deferred'], note: 'The principles are recorded but not signed. The outer mirror post becomes the next priority.', storyEffects: { relationships: { ilya: 3, jorel: 2, vale: 2 }, discoverEvidence: ['compact-draft'] } },
    ],
  },
  {
    id: 'act-three-outlook', title: 'The outer post is still calling', location: 'HEARTH-9 · NORTHERN OPERATIONS TABLE', category: 'ACT III / CLIMAX',
    description: 'The expedition has confirmed that Hearth-9 survives, recovered evidence that the atmospheric veil follows an active control cycle, and traced Jorel’s last authenticated work record to outer mirror post K-17. A live reply may have confirmed he is still transmitting; either way, the post is exposed and the Dawn Engine cannot wait indefinitely. Vesper must decide what to risk next: a rescue, a reciprocal agreement, or the deeper relay investigation.',
    once: true,
    choices: [
      { id: 'prioritise-jorel-rescue', label: 'Prepare a rescue team for K-17', detail: 'Put the missing mechanic first and accept a costly journey to the outer post.', deltas: { energy: -10, food: -20, order: -10 }, setFlags: ['act-three-complete', 'jorel-rescue-ordered', 'act-four-rescue-priority'], note: 'A rescue plan is authorised. The record proves Jorel worked at K-17 recently; if he answered the live code, the team has an active channel, but his physical safety still needs confirmation.', storyEffects: { chapter: 4, relationships: { ilya: 6, mara: 3, jorel: 3 }, discoverEvidence: ['outer-mirror-post-coordinates'] } },
      { id: 'prioritise-shared-protocol', label: 'Secure the two-city safety compact first', detail: 'Build a reliable coordination system before risking people on the outer post.', deltas: { order: 10, technology: -10, energy: -10 }, setFlags: ['act-three-complete', 'act-four-compact-priority'], note: 'The next operation begins with the relationship between Vesper and Hearth-9. A signed compact gives it a stronger foundation; if the draft remains unsigned, you will have to negotiate under pressure.', storyEffects: { chapter: 4, relationships: { ilya: 4, nadia: 3, elias: 3 }, discoverEvidence: ['outer-mirror-post-coordinates'] } },
      { id: 'trace-outer-relay', label: 'Trace the autonomous command route first', detail: 'Follow the DAWNLINE command path before sending another team into the storm.', deltas: { technology: 15, order: -10 }, setFlags: ['act-three-complete', 'act-four-relay-priority'], note: 'The operation shifts toward the source of the control signal. Jorel’s trail remains active, but Vesper will need a second mission to reach the post physically.', storyEffects: { chapter: 4, relationships: { elias: 6, mara: 3, ilya: -3 }, discoverEvidence: ['outer-mirror-post-coordinates'] } },
    ],
  },
  {
    id: 'outer-relay-briefing', title: 'The relay has a human lock', location: 'VESPER · JOINT OPERATIONS ROOM', category: 'ACT IV / OPENING',
    description: 'The route beyond Hearth-9 ends at a relay with a physical safety lock that requires a human presence. The next phase must decide whether to reach Jorel, negotiate a shared reset procedure, or trace the command that has kept the atmospheric veil in its protective cycle. All three tasks now depend on what the expedition brought back—and on who still trusts the people making the decisions.',
    once: true,
    choices: [
      { id: 'brief-rescue-first', label: 'Put the K-17 rescue on the operations board', detail: 'Make the missing mechanic and the outer post the immediate priority.', deltas: { food: -10, order: 10 }, setFlags: ['act-four-opened', 'act-four-rescue-boarded'], note: 'The rescue plan receives a public slot on the operations board. The team must still prepare for the exposure and the relay’s human lock.', storyEffects: { relationships: { ilya: 3, jorel: 2 } } },
      { id: 'brief-protocol-first', label: 'Bring Hearth-9 into the relay plan', detail: 'Build the joint procedure before the next dangerous operation.', deltas: { technology: 10, energy: -10 }, setFlags: ['act-four-opened', 'act-four-joint-board'], note: 'Hearth-9 receives a formal request to prepare a reciprocal relay test. Both cities keep control of their own life-support systems.', storyEffects: { relationships: { elias: 3, nadia: 3, ilya: 2 } } },
      { id: 'brief-command-route', label: 'Map the autonomous command chain', detail: 'Trace what DAWNLINE is protecting before touching its controls.', deltas: { technology: 10, order: -10 }, setFlags: ['act-four-opened', 'act-four-command-board'], note: 'The engineering team begins mapping DAWNLINE’s control chain. The next operation will need an authenticated human lock release.', storyEffects: { relationships: { mara: 3, elias: 4 } } },
    ],
  },
];

const ACT_FOUR_EVENTS: GameEvent[] = [
  {
    "id": "act-four-council",
    "title": "Two cities, one dangerous switch",
    "location": "VESPER · JOINT CIVIC CHAMBER",
    "category": "ACT IV / MANDATE",
    "description": "The Act III expedition brought back enough evidence to prove the veil is being maintained, but it did not give Vesper the right to command Hearth-9’s mirrors. The council asks what kind of authority will govern the next operation: public oversight, a protected technical cell, or emergency command under Vale. The decision will shape what the city accepts when the evidence becomes harder to hide.",
    "once": true,
    "choices": [
      {
        "id": "council-public-mandate",
        "label": "Publish the evidence and hold the operation in public",
        "detail": "Let citizens witness the costs and limits before the network is touched.",
        "deltas": {
          "order": 10,
          "technology": -10
        },
        "note": "The mandate is public. The council will have to explain every risk, and Vale loses room to act alone.",
        "setFlags": [
          "act-four-public-mandate"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 5,
            "nadia": 4,
            "vale": -4
          },
          "meetCharacters": [
            "ilya",
            "nadia"
          ],
          "discoverEvidence": [
            "public-operation-mandate"
          ]
        }
      },
      {
        "id": "council-technical-cell",
        "label": "Give a small technical cell temporary authority",
        "detail": "Protect the work from panic, but accept a narrower circle of trust.",
        "deltas": {
          "technology": 10,
          "order": -10
        },
        "note": "Mara and Elias gain operating room. Nadia warns that a secret justified by safety can become permanent.",
        "setFlags": [
          "act-four-technical-cell"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "elias": 4,
            "nadia": -3
          },
          "meetCharacters": [
            "mara",
            "elias"
          ]
        }
      },
      {
        "id": "council-joint-compact",
        "label": "Renew a binding compact with Hearth-9",
        "detail": "Neither city may issue a planetary command alone; Hearth-9 also reserves emergency provisions for the operation.",
        "deltas": {
          "technology": 10,
          "order": 10,
          "food": 10
        },
        "note": "The compact makes the operation slower, but prevents Vesper from treating Hearth-9 as a tool. Hearth-9 releases an emergency food reserve for the shared work.",
        "setFlags": [
          "act-four-joint-mandate",
          "settlement-compact-signed"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 4,
            "nadia": 3,
            "elias": 4,
            "vale": -2
          },
          "meetCharacters": [
            "ilya",
            "nadia",
            "elias"
          ],
          "discoverEvidence": [
            "settlement-compact-signatures"
          ],
          "revealTruths": [
            "safe-reset-requires-coordination"
          ]
        }
      }
    ]
  },
  {
    "id": "dawnline-access",
    "title": "The facility behind the false wall",
    "location": "NORTHWORKS · SEALED CONTROL SUBLEVEL",
    "category": "ACT IV / INVESTIGATION",
    "description": "The cargo route ends at a sealed sublevel beneath the old Northworks array. Its doors have drawn maintenance power for thirteen years, though every official map calls the room decommissioned. The lock is not military hardware: it is a legal and technical safeguard designed to require a human operator and a witness from another system.",
    "once": true,
    "choices": [
      {
        "id": "facility-public-warrant",
        "label": "Enter with a public warrant",
        "detail": "Preserve chain of custody and let both communities see what is opened.",
        "deltas": {
          "energy": -10,
          "order": 10
        },
        "note": "The door opens under a witnessed warrant. The room contains command traces, not a master off-switch.",
        "setFlags": [
          "dawnline-access-open",
          "dawnline-access-public"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 3,
            "nadia": 4,
            "vale": -2
          },
          "discoverEvidence": [
            "dawnline-facility-map",
            "archive-access-log"
          ]
        }
      },
      {
        "id": "facility-vale-order",
        "label": "Use Vale’s emergency authority",
        "detail": "Gain immediate access and accept security control over the site.",
        "deltas": {
          "energy": 10,
          "order": -10
        },
        "note": "Vale opens the door quickly. The record is intact, but he insists the room remain under security guard.",
        "setFlags": [
          "dawnline-access-open",
          "dawnline-access-security",
          "security-holds-facility"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 7,
            "ilya": -5,
            "nadia": -3
          },
          "discoverEvidence": [
            "dawnline-facility-map",
            "archive-access-log"
          ]
        }
      },
      {
        "id": "facility-covert-entry",
        "label": "Send a small team through the service duct",
        "detail": "Avoid a public standoff, but leave the access record incomplete.",
        "deltas": {
          "technology": 10,
          "order": -10
        },
        "note": "The team enters without triggering the main alarm. A copied command map survives, but Nadia notes the evidence will need independent authentication.",
        "setFlags": [
          "dawnline-access-open",
          "dawnline-access-covert"
        ],
        "storyEffects": {
          "relationships": {
            "elias": 4,
            "nadia": -2,
            "mara": 2
          },
          "discoverEvidence": [
            "dawnline-facility-map"
          ]
        }
      }
    ]
  },
  {
    "id": "mara-override-confession",
    "title": "The override with her name on it",
    "location": "NORTHWORKS · ENGINEERING RECORD ROOM",
    "category": "ACT IV / CHARACTER REVELATION",
    "description": "Mara finds her signature in the First Night command log. When the solar emergency arrived early, she authorised a local override to protect Vesper’s western heat loop. The override diverted a planetary timing signal through an unverified relay. She did not create the veil, but her decision became one link in the cascade that trapped DAWNLINE in its protective cycle. She kept silent because she believed the city would treat a partial cause as the whole truth.",
    "once": true,
    "choices": [
      {
        "id": "mara-testify-openly",
        "label": "Let Mara testify in full",
        "detail": "Accountability costs trust in the short term, but leaves the record intact.",
        "deltas": {
          "order": -10,
          "technology": 10
        },
        "note": "Mara names the choice she made and the information she did not have. It explains one link in the cascade, not the entire First Night.",
        "setFlags": [
          "mara-override-public"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 8,
            "ilya": 3,
            "nadia": 3,
            "vale": -2
          },
          "discoverEvidence": [
            "mara-override-record",
            "northworks-override-log"
          ],
          "revealTruths": [
            "mara-override-saved-west",
            "first-night-was-an-emergency-response"
          ]
        }
      },
      {
        "id": "mara-protected-testimony",
        "label": "Protect the testimony until independent review",
        "detail": "Keep Mara working while requiring a second source before public judgment.",
        "deltas": {
          "technology": 10,
          "order": 10
        },
        "note": "Mara agrees to a recorded, protected statement. She will help design the repair, but asks that no one call her either a hero or the sole culprit.",
        "setFlags": [
          "mara-override-protected"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 10,
            "nadia": 5,
            "elias": 3,
            "ilya": 1
          },
          "discoverEvidence": [
            "mara-override-record",
            "northworks-override-log"
          ],
          "revealTruths": [
            "mara-override-saved-west",
            "first-night-was-an-emergency-response"
          ]
        }
      },
      {
        "id": "mara-bury-override",
        "label": "Bury the record and keep Mara at the controls",
        "detail": "Avoid an immediate scandal, but leave the city vulnerable to a later leak.",
        "deltas": {
          "order": 10,
          "technology": -10
        },
        "note": "The file is sealed, not destroyed. Mara remains on the project, while Nadia keeps an independent copy of the signature.",
        "setFlags": [
          "mara-override-buried"
        ],
        "storyEffects": {
          "relationships": {
            "mara": -5,
            "ilya": -6,
            "vale": 5,
            "nadia": -3
          },
          "discoverEvidence": [
            "mara-override-record"
          ]
        }
      }
    ]
  },
  {
    "id": "quill-full-archive",
    "title": "The pages she kept",
    "location": "VESPER · MUNICIPAL ARCHIVE VAULT",
    "category": "ACT IV / HISTORICAL REVELATION",
    "description": "Nadia opens the surviving First Night transcript beside the new Northworks record. The original emergency order was genuine: DAWNLINE was activated to protect Earth from an incoming solar catastrophe. The critical failure came after the network lost confirmation from its human operators. A protective routine became a permanent rule, and every city inherited only a fragment of the truth.",
    "once": true,
    "choices": [
      {
        "id": "quill-publish-archive",
        "label": "Publish the full transcript with the evidence trail",
        "detail": "Give people the facts and let them see where uncertainty remains.",
        "deltas": {
          "order": -10,
          "technology": 10
        },
        "note": "The record goes public with its gaps annotated. Anger rises, but rumours no longer have to substitute for evidence.",
        "setFlags": [
          "first-night-record-public"
        ],
        "storyEffects": {
          "relationships": {
            "nadia": 6,
            "ilya": 5,
            "vale": -5,
            "elias": 3
          },
          "discoverEvidence": [
            "first-night-transcript-fragment",
            "orbital-autonomous-header"
          ],
          "revealTruths": [
            "first-night-was-an-emergency-response",
            "dawnline-is-autonomous"
          ]
        }
      },
      {
        "id": "quill-independent-review",
        "label": "Have both cities annotate the transcript independently",
        "detail": "Accept a delay to protect the integrity of the historical record.",
        "deltas": {
          "order": 10,
          "technology": 10
        },
        "note": "Vesper and Hearth-9 produce matching annotations. The emergency activation is verified; the later autonomous lockout remains the central danger.",
        "setFlags": [
          "first-night-record-reviewed"
        ],
        "storyEffects": {
          "relationships": {
            "nadia": 8,
            "elias": 5,
            "ilya": 3
          },
          "discoverEvidence": [
            "first-night-transcript-fragment",
            "orbital-autonomous-header"
          ],
          "revealTruths": [
            "first-night-was-an-emergency-response",
            "dawnline-is-autonomous"
          ]
        }
      },
      {
        "id": "quill-restrict-sensitive-pages",
        "label": "Release a summary and retain the raw transcript",
        "detail": "Protect vulnerable families and disputed names, accepting suspicion.",
        "deltas": {
          "order": 10,
          "technology": 10
        },
        "note": "The public receives the verified technical explanation, but the raw transcript remains under joint custody. Trust depends on whether that restriction has an expiry date.",
        "setFlags": [
          "first-night-record-restricted"
        ],
        "storyEffects": {
          "relationships": {
            "nadia": 4,
            "vale": 3,
            "ilya": -2
          },
          "discoverEvidence": [
            "first-night-index",
            "first-night-transcript-fragment"
          ],
          "revealTruths": [
            "first-night-was-an-emergency-response"
          ]
        }
      }
    ]
  },
  {
    "id": "relay-lock-authenticated",
    "title": "The lock recognises a living operator",
    "location": "OUTER MIRROR POST K-17 · AUTHENTICATION BAY",
    "category": "ACT IV / HUMAN INTERLOCK",
    "description": "The verified maintenance key from Jorel matches the physical relay’s challenge. It does not give Vesper ownership of the system; it allows an authenticated person to witness and approve a specific operation. The lock has two independent inputs: a human confirmation at K-17 and a second-city timing receipt.",
    "once": true,
    "choices": [
      {
        "id": "lock-authenticate-jointly",
        "label": "Authenticate with Jorel’s key and Hearth-9’s witness",
        "detail": "Preserve the two-person safety rule even if it takes longer.",
        "deltas": {
          "technology": 10,
          "energy": -10,
          "order": 10
        },
        "note": "The relay accepts the challenge but remains in read-only mode until the network model is verified. The human lock is understood, not defeated.",
        "setFlags": [
          "human-interlock-understood",
          "relay-lock-authenticated"
        ],
        "storyEffects": {
          "relationships": {
            "jorel": 6,
            "elias": 4,
            "ilya": 3
          },
          "discoverEvidence": [
            "human-interlock-procedure",
            "jorel-message-auth"
          ],
          "revealTruths": [
            "human-override-required"
          ]
        }
      },
      {
        "id": "lock-use-code-as-root",
        "label": "Try to reuse the maintenance key as a command credential",
        "detail": "Gain more data quickly, at the risk of triggering the lockout.",
        "deltas": {
          "technology": 15,
          "order": -10
        },
        "note": "The code is accepted only as identity, not authority. The relay records the attempt and increases its defensive scrutiny.",
        "setFlags": [
          "relay-lock-credential-refused",
          "dawnline-security-alert"
        ],
        "storyEffects": {
          "relationships": {
            "jorel": -2,
            "elias": 2
          },
          "discoverEvidence": [
            "human-interlock-procedure"
          ],
          "revealTruths": [
            "human-override-required"
          ]
        }
      }
    ],
    "requiresEvidence": [
      "jorel-maintenance-code"
    ]
  },
  {
    "id": "relay-lock-manual",
    "title": "The human lock cannot be spoofed",
    "location": "OUTER MIRROR POST K-17 · MANUAL SERVICE BAY",
    "category": "ACT IV / HUMAN INTERLOCK",
    "description": "The relay will not accept a command without a current human maintenance challenge. The team has Jorel’s recent work record but not an authenticated key exchange. A mechanical bypass could open the cabinet, but it cannot safely impersonate the person the system expects.",
    "once": true,
    "choices": [
      {
        "id": "lock-request-hearth-witness",
        "label": "Ask Hearth-9 to witness a manual maintenance procedure",
        "detail": "Keep the safety boundary and request a local operator to supervise.",
        "deltas": {
          "technology": -10,
          "order": 10,
          "energy": -10
        },
        "note": "Hearth-9 supplies a local witness and a paper procedure. The lock opens to diagnostics, not direct control.",
        "setFlags": [
          "human-interlock-understood",
          "relay-lock-manual-witnessed"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 4,
            "elias": 4,
            "nadia": 3
          },
          "discoverEvidence": [
            "human-interlock-procedure",
            "human-lock-witness-record"
          ],
          "revealTruths": [
            "human-override-required"
          ]
        }
      },
      {
        "id": "lock-force-mechanical-bypass",
        "label": "Open the service panel mechanically",
        "detail": "Get access before the weather window closes, accepting a damaged safety circuit.",
        "deltas": {
          "energy": -15,
          "technology": 10,
          "order": -10
        },
        "note": "The cabinet opens, but a redundant interlock is damaged. DAWNLINE will require a slower reset and an independent safety proof.",
        "setFlags": [
          "relay-lock-bypassed",
          "relay-lock-unstable"
        ],
        "storyEffects": {
          "relationships": {
            "mara": -2,
            "vale": 3
          },
          "discoverEvidence": [
            "human-interlock-procedure"
          ]
        }
      }
    ]
  },
  {
    "id": "jorel-reunion",
    "title": "A voice from the far station",
    "location": "OUTER MIRROR POST K-17 · NARROWBAND CHANNEL",
    "category": "ACT IV / PERSONAL STAKES",
    "description": "A second authenticated signal comes through the relay. Jorel is alive, but the outer post is locked into a thermal safety compartment after its last uncontrolled pulse. He can guide the team through the maintenance process; opening the compartment before the pressure equalises could kill him. Ilya hears her brother’s voice for the first time in thirteen years, but the rescue is not complete.",
    "once": true,
    "choices": [
      {
        "id": "jorel-protected-channel",
        "label": "Keep a protected two-way channel open",
        "detail": "Let Jorel guide the technical work without exposing his location publicly.",
        "deltas": {
          "energy": -10,
          "order": 10
        },
        "note": "Jorel confirms the relay’s manual sequence and asks the team not to rush the door. Ilya supports the delay because it keeps him alive.",
        "setFlags": [
          "jorel-two-way-contact",
          "jorel-rescue-coordinated"
        ],
        "storyEffects": {
          "relationships": {
            "jorel": 10,
            "ilya": 8,
            "mara": 3
          },
          "discoverEvidence": [
            "jorel-message-auth",
            "outer-relay-maintenance-record"
          ],
          "revealTruths": [
            "jorel-current-signal-confirmed"
          ]
        }
      },
      {
        "id": "jorel-public-proof",
        "label": "Broadcast a short authenticated proof of life",
        "detail": "Protect Jorel from being erased again, while revealing that the channel is active.",
        "deltas": {
          "order": 10,
          "energy": -10
        },
        "note": "Both cities verify the key and hear Jorel’s voice. The proof protects his identity, but may draw attention to the outer post.",
        "setFlags": [
          "jorel-proof-public",
          "jorel-two-way-contact"
        ],
        "storyEffects": {
          "relationships": {
            "jorel": 6,
            "ilya": 6,
            "nadia": 4,
            "vale": -3
          },
          "discoverEvidence": [
            "jorel-message-auth",
            "public-jorel-signal-copy",
            "outer-relay-maintenance-record"
          ],
          "revealTruths": [
            "jorel-current-signal-confirmed"
          ]
        }
      },
      {
        "id": "jorel-keep-channel-technical",
        "label": "Keep the exchange strictly technical",
        "detail": "Use his knowledge while postponing family contact until the compartment is safe.",
        "deltas": {
          "technology": 10,
          "order": -10
        },
        "note": "Jorel provides the pressure and timing sequence. He understands the reason for caution, but Ilya asks you to remember that he is a person, not a component.",
        "setFlags": [
          "jorel-channel-technical"
        ],
        "storyEffects": {
          "relationships": {
            "jorel": 4,
            "ilya": -3,
            "elias": 4
          },
          "discoverEvidence": [
            "jorel-message-auth",
            "outer-relay-maintenance-record"
          ],
          "revealTruths": [
            "jorel-current-signal-confirmed"
          ]
        }
      }
    ],
    "requiresAnyFlags": [
      "jorel-current-signal-confirmed",
      "jorel-maintenance-channel-open"
    ]
  },
  {
    "id": "jorel-search-plan",
    "title": "The person behind the missing record",
    "location": "VESPER · JOINT RESCUE DESK",
    "category": "ACT IV / PERSONAL STAKES",
    "description": "The records confirm Jorel reached Hearth-9 and worked at the outer post, but no authenticated live exchange has been completed. The team must choose between a physical search built from the last roster, and a slower request for Hearth-9 to authenticate the relay on its side. The evidence is strong enough to justify a search, not to claim that a reunion has happened.",
    "once": true,
    "choices": [
      {
        "id": "jorel-search-expedition",
        "label": "Prepare a physical search from the last roster",
        "detail": "Give the rescue team route authority, but spend supplies before the outcome is known.",
        "deltas": {
          "energy": -10,
          "food": -10,
          "order": 10
        },
        "note": "The search team receives K-17 coordinates and a safety brief. The next authenticated response may come from Jorel or from the relay itself.",
        "setFlags": [
          "jorel-search-authorised"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 5,
            "jorel": 3,
            "mara": 2
          },
          "discoverEvidence": [
            "jorel-location-request",
            "outer-relay-maintenance-record"
          ]
        }
      },
      {
        "id": "jorel-search-hearth9",
        "label": "Ask Hearth-9 to authenticate the next maintenance window",
        "detail": "Avoid another blind crossing and share the responsibility with the settlement.",
        "deltas": {
          "technology": 10,
          "order": 10,
          "energy": -10
        },
        "note": "Hearth-9 agrees to check its roster and challenge logs. This is slower, but creates a second source for any future claim about Jorel.",
        "setFlags": [
          "jorel-joint-search"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 4,
            "nadia": 4,
            "elias": 3
          },
          "discoverEvidence": [
            "jorel-location-request",
            "human-lock-witness-record"
          ]
        }
      },
      {
        "id": "jorel-search-restrict",
        "label": "Keep the search quiet until the relay is safe",
        "detail": "Protect the channel from opportunists, at the cost of public reassurance.",
        "deltas": {
          "order": -10,
          "technology": 10
        },
        "note": "The search remains restricted to the joint team. Ilya accepts the caution only after the rescue is formally added to the operations log.",
        "setFlags": [
          "jorel-search-restricted"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": -2,
            "vale": 4,
            "jorel": 1
          },
          "discoverEvidence": [
            "jorel-location-request"
          ]
        }
      }
    ]
  },
  {
    "id": "gantry-workshop",
    "title": "A repair crew from both cities",
    "location": "VESPER · HELIOSTAT GANTRY WORKSHOP",
    "category": "ACT IV / ENGINEERING",
    "description": "The original gantry has no redundancy: a single power fault can blind the array and its atmospheric transmitter at once. Mara proposes a second loop, built from Vesper’s copper stock and Hearth-9’s mirror brackets. The project is expensive, and the people who build it will expect a say in how the system is used.",
    "once": true,
    "choices": [
      {
        "id": "gantry-public-crew",
        "label": "Build a mixed public repair crew",
        "detail": "Give engineers and district workers shared ownership of the safety work.",
        "deltas": {
          "energy": -15,
          "food": -10,
          "technology": 10,
          "order": 10
        },
        "note": "The second loop is slower but independently testable. A safe-cycle calculation is added to the file; the city feed shows new repair lights around the gantry.",
        "setFlags": [
          "grid-redundancy-built",
          "gantry-built",
          "pulse-safety-margin"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 5,
            "ilya": 4,
            "elias": 3
          },
          "meetCharacters": [
            "mara",
            "ilya"
          ],
          "discoverEvidence": [
            "redundant-grid-plan",
            "safe-cycle-calculation"
          ],
          "districts": {
            "core": "recovering"
          }
        }
      },
      {
        "id": "gantry-contractor",
        "label": "Hire the fast contractor team",
        "detail": "Finish before the next window but allow the guild to control the test schedule.",
        "deltas": {
          "energy": -10,
          "technology": 10,
          "order": -10
        },
        "note": "The gantry is braced quickly, but the work is not independently redundant. It improves capacity without guaranteeing a safe pulse.",
        "setFlags": [
          "grid-redundancy-limited",
          "gantry-built"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 4,
            "mara": -3,
            "ilya": -3
          },
          "discoverEvidence": [
            "redundant-grid-plan"
          ],
          "districts": {
            "core": "recovering"
          }
        }
      },
      {
        "id": "gantry-defer",
        "label": "Defer the rebuild and conserve power",
        "detail": "Keep reserves now, accepting that the pulse will have less margin.",
        "deltas": {
          "energy": 10,
          "food": 10,
          "technology": -10
        },
        "note": "No new redundancy is built. Mara marks the array as unsuitable for a full-strength test until more material arrives.",
        "setFlags": [
          "grid-build-deferred"
        ],
        "storyEffects": {
          "relationships": {
            "mara": -3,
            "vale": 2
          }
        }
      }
    ]
  },
  {
    "id": "orbital-telemetry",
    "title": "The network answers back",
    "location": "NORTHWORKS · UPLINK CHAMBER",
    "category": "ACT IV / TECHNICAL REVELATION",
    "description": "The command header is transmitted to a passive receiver. The uplink answers with an authenticated but ownerless handshake: DAWNLINE has been making decisions without a live operator, treating its last valid emergency protection rule as permanent authority. A closure command is queued for the next atmospheric cycle, and it will classify an unauthorised reset as a planetary security breach.",
    "once": true,
    "choices": [
      {
        "id": "telemetry-decode-handshake",
        "label": "Decode the handshake in read-only mode",
        "detail": "Learn the system’s rule set without sending a command back.",
        "deltas": {
          "technology": -10,
          "energy": -10
        },
        "note": "The autonomous header is verified. DAWNLINE is not a conscious antagonist; it is faithfully enforcing a stale rule without the human context needed to stop.",
        "setFlags": [
          "orbital-handshake-decoded",
          "dawnline-security-alert"
        ],
        "storyEffects": {
          "relationships": {
            "elias": 5,
            "nadia": 3,
            "mara": 2
          },
          "discoverEvidence": [
            "orbital-autonomous-header",
            "dawnline-safety-model"
          ],
          "revealTruths": [
            "dawnline-is-autonomous",
            "veil-is-maintained"
          ]
        }
      },
      {
        "id": "telemetry-isolate-uplink",
        "label": "Isolate the uplink before reading the response",
        "detail": "Reduce exposure, accepting that the next cycle will have to be inferred locally.",
        "deltas": {
          "energy": 10,
          "technology": -10
        },
        "note": "The uplink is isolated. A partial header survives, enough to establish autonomy but not enough to predict every defensive action.",
        "setFlags": [
          "uplink-isolated"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "vale": 3,
            "elias": -2
          },
          "discoverEvidence": [
            "orbital-autonomous-header"
          ],
          "revealTruths": [
            "dawnline-is-autonomous"
          ]
        }
      },
      {
        "id": "telemetry-publish-handshake",
        "label": "Publish the handshake to both cities",
        "detail": "Make it impossible for either council to quietly suppress the machine’s reply.",
        "deltas": {
          "order": 10,
          "technology": -10
        },
        "note": "Both cities see the same autonomous signature. Public confidence falls briefly, but no one can claim that one city fabricated the finding.",
        "setFlags": [
          "orbital-handshake-public"
        ],
        "storyEffects": {
          "relationships": {
            "nadia": 5,
            "ilya": 4,
            "vale": -5
          },
          "discoverEvidence": [
            "orbital-autonomous-header",
            "public-handshake-copy"
          ],
          "revealTruths": [
            "dawnline-is-autonomous",
            "veil-is-maintained"
          ]
        }
      }
    ]
  },
  {
    "id": "veil-model",
    "title": "The safety model that never ended",
    "location": "HEARTH-9 · JOINT MODEL ROOM",
    "category": "ACT IV / SCIENTIFIC CONSENSUS",
    "description": "The signal schedule, station readings, mirror geometry and DAWNLINE header now fit a single model. The atmospheric veil is actively maintained as a safety shield, originally meant to deflect the solar catastrophe. Without a coordinated handoff, removing it could expose the planet to the danger the original emergency system was designed to prevent.",
    "once": true,
    "choices": [
      {
        "id": "veil-peer-reviewed-model",
        "label": "Commission a joint peer review",
        "detail": "Accept scrutiny and time in exchange for a result neither city has to take on faith.",
        "deltas": {
          "technology": -10,
          "order": 10
        },
        "note": "Independent analysts reproduce the model. The veil is maintained, the network is autonomous, and a reset requires coordinated human confirmation.",
        "setFlags": [
          "veil-model-peer-reviewed"
        ],
        "storyEffects": {
          "relationships": {
            "elias": 6,
            "nadia": 6,
            "ilya": 3,
            "mara": 3
          },
          "discoverEvidence": [
            "signed-safety-model",
            "peer-reviewed-veil-cycle"
          ],
          "revealTruths": [
            "veil-is-maintained",
            "dawnline-is-autonomous",
            "safe-reset-requires-coordination"
          ]
        }
      },
      {
        "id": "veil-technical-council",
        "label": "Accept the technical council’s provisional model",
        "detail": "Move more quickly, but require a final verification before full reset.",
        "deltas": {
          "technology": 10,
          "order": -10
        },
        "note": "The model is strong enough to calibrate a small test. It is not yet a public consensus, so the final reset must remain gated.",
        "setFlags": [
          "veil-model-provisional-act4"
        ],
        "storyEffects": {
          "relationships": {
            "elias": 4,
            "mara": 4,
            "nadia": -2
          },
          "discoverEvidence": [
            "dawnline-safety-model",
            "provisional-veil-model"
          ],
          "revealTruths": [
            "veil-is-maintained",
            "dawnline-is-autonomous"
          ]
        }
      },
      {
        "id": "veil-keep-model-restricted",
        "label": "Keep the full model under joint technical custody",
        "detail": "Protect a fragile city from panic, but accept a transparency debt.",
        "deltas": {
          "order": 10,
          "technology": 10
        },
        "note": "Both teams hold raw data. The model remains usable by the engineers, while the public explanation is delayed.",
        "setFlags": [
          "veil-model-restricted-act4"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 4,
            "nadia": 2,
            "ilya": -2
          },
          "discoverEvidence": [
            "dawnline-safety-model"
          ],
          "revealTruths": [
            "veil-is-maintained"
          ]
        }
      }
    ]
  },
  {
    "id": "mirror-calibration",
    "title": "Point the mirrors at the gap",
    "location": "HELIOSTAT ARRAY · CALIBRATION DECK",
    "category": "ACT IV / FIELD TEST PREPARATION",
    "description": "A narrow atmospheric window appears on the model. The mirrors must focus into it without collapsing the veil’s surrounding protection. A calibration based on independently checked data is safer than copying old coordinates or increasing power until something happens.",
    "once": true,
    "choices": [
      {
        "id": "calibrate-from-model",
        "label": "Use the verified cycle model",
        "detail": "Apply the timing model and keep a second-city witness on the alignment.",
        "deltas": {
          "energy": -10,
          "technology": -10
        },
        "note": "The mirror geometry aligns with the verified window. This is a calibrated test, not a promise that the network will accept the handoff.",
        "setFlags": [
          "calibration-safe",
          "light-corridor-calibrated"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "elias": 3
          },
          "discoverEvidence": [
            "light-corridor-telemetry"
          ],
          "revealTruths": [
            "narrow-light-corridor-confirmed"
          ]
        },
        "requiresEvidence": [
          "safe-cycle-calculation"
        ]
      },
      {
        "id": "calibrate-from-hearth9",
        "label": "Use Hearth-9’s empirical mirror method",
        "detail": "Let the settlement’s operators align the physical array from their own working field.",
        "deltas": {
          "energy": -10,
          "order": 10,
          "technology": -10
        },
        "note": "Hearth-9’s mirror team confirms the same corridor from the ridge. It adds an independent physical check to the city model.",
        "setFlags": [
          "calibration-safe",
          "light-corridor-calibrated"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 3,
            "elias": 4,
            "mara": 3
          },
          "discoverEvidence": [
            "light-corridor-telemetry",
            "remote-mirror-geometry"
          ],
          "revealTruths": [
            "narrow-light-corridor-confirmed"
          ]
        },
        "requiresEvidence": [
          "remote-mirror-geometry"
        ]
      },
      {
        "id": "calibrate-approximation",
        "label": "Use a fast approximation",
        "detail": "Save time and keep the array running, but accept a narrower safety margin.",
        "deltas": {
          "energy": -10,
          "technology": 10
        },
        "note": "The beam points toward the window, but its margin is unverified. A test now may reveal the error at the cost of a mirror bank.",
        "setFlags": [
          "calibration-rough"
        ],
        "storyEffects": {
          "relationships": {
            "mara": -3,
            "vale": 2
          },
          "discoverEvidence": [
            "approximate-calibration-log"
          ]
        }
      }
    ]
  },
  {
    "id": "first-test-pulse",
    "title": "Five seconds against the veil",
    "location": "HELIOSTAT ARRAY · CONTROL GANTRY",
    "category": "ACT IV / FIRST TEST",
    "description": "For the first time, Vesper can attempt a narrow test pulse that does not ask the whole planetary network to reset. The team has to decide whether to test with the current margin or reinforce the grid first. The result will determine which options remain credible at the final vote.",
    "once": true,
    "choices": [
      {
        "id": "test-pulse-now",
        "label": "Run the five-second test now",
        "detail": "Get a direct measurement before DAWNLINE closes its next window.",
        "deltas": {
          "energy": -15,
          "technology": 10
        },
        "note": "The pulse is authorised. The city feed will reflect the measured outcome, not the intention behind the command.",
        "setFlags": [
          "test-pulse-attempted",
          "pulse-test-authorised"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 2,
            "elias": 2
          }
        }
      },
      {
        "id": "test-pulse-defer",
        "label": "Delay the pulse and reinforce the grid",
        "detail": "Spend another cycle securing a fallback before touching the veil.",
        "deltas": {
          "energy": 10,
          "order": 10
        },
        "note": "The test is delayed. The city retains the option to reinforce its loops and attempt a smaller pulse in the next window.",
        "setFlags": [
          "test-pulse-deferred"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "ilya": 2
          }
        }
      }
    ]
  },
  {
    "id": "grid-rebuild",
    "title": "A grid that can survive a reset",
    "location": "VESPER · REDUNDANT POWER LOOP",
    "category": "ACT IV / SAFETY ENGINEERING",
    "description": "The engineers split the array into two independently isolatable loops. This does not solve DAWNLINE’s autonomous authority, but it means a failed test need not take the city’s heating system with it. The alternative is to keep the reserve high and abandon the second loop for now.",
    "once": true,
    "choices": [
      {
        "id": "rebuild-redundant-loops",
        "label": "Build the redundant power loop",
        "detail": "Spend energy and food on a physical fallback before another test.",
        "deltas": {
          "energy": -10,
          "food": -10,
          "technology": 10
        },
        "note": "A second loop comes online under a separate breaker. The city feed shows linked repair lights across the core.",
        "setFlags": [
          "grid-redundancy-built",
          "gantry-built",
          "pulse-safety-margin"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 5,
            "ilya": 3,
            "elias": 2
          },
          "discoverEvidence": [
            "redundant-grid-plan",
            "safe-cycle-calculation"
          ],
          "districts": {
            "core": "recovering"
          }
        }
      },
      {
        "id": "reserve-for-test",
        "label": "Keep the reserve and test at lower intensity",
        "detail": "Preserve resources rather than build a full fallback.",
        "deltas": {
          "energy": 10,
          "technology": 10
        },
        "note": "The reserve is stronger, but the physical redundancy is still incomplete. DAWNLINE’s response remains less predictable.",
        "setFlags": [
          "grid-redundancy-limited"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 3,
            "mara": -2
          }
        }
      },
      {
        "id": "abort-test-plan",
        "label": "Cancel the pulse and preserve the artificial dawn",
        "detail": "Do not expose the city to a test the grid cannot safely support.",
        "deltas": {
          "energy": 10,
          "order": 10
        },
        "note": "The test is cancelled. Vesper will enter the final vote with a preservation option, but without proof that a light corridor can be opened safely.",
        "setFlags": [
          "pulse-aborted"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "ilya": 3,
            "vale": -2
          }
        }
      }
    ]
  },
  {
    "id": "second-test-window",
    "title": "The second test window",
    "location": "HELIOSTAT ARRAY · BACKUP CONTROL DECK",
    "category": "ACT IV / SECOND TEST",
    "description": "The reinforced loop is ready, but the timing window is narrower now. Jorel’s maintenance record and Hearth-9’s relay clock are the only independent confirmations of the interval. This is the last low-power test window before the full network begins its next autonomous closure cycle.",
    "once": true,
    "choices": [
      {
        "id": "second-test-run",
        "label": "Run the test with the redundant loop",
        "detail": "Use the safety margin you have built and keep the command narrow.",
        "deltas": {
          "energy": -15,
          "technology": 10
        },
        "note": "A second pulse is initiated with the backup loop armed. A separate outcome check will determine whether the timing and alignment held.",
        "setFlags": [
          "test-pulse-attempted",
          "pulse-test-authorised"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 2,
            "elias": 2
          }
        }
      },
      {
        "id": "second-test-abort",
        "label": "Abort the test and retain the local system",
        "detail": "Keep the city running rather than gamble the last safe window.",
        "deltas": {
          "energy": 10,
          "order": 10
        },
        "note": "The array remains local-only. DAWNLINE’s deeper reset will not be attempted without a better window.",
        "setFlags": [
          "pulse-aborted",
          "local-system-preservation"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 3,
            "mara": 3,
            "vale": 2
          }
        }
      }
    ]
  },
  {
    "id": "test-pulse-success",
    "title": "A seam of morning",
    "location": "HELIOSTAT ARRAY · CORRIDOR READOUT",
    "category": "ACT IV / TEST RESULT",
    "description": "For five seconds, a narrow corridor opens through the veil. The city receives a brief band of natural light—not enough to thaw the streets or end winter, but enough to prove the window is real. The safe result depended on calibration, a fallback loop or verified coordination, and a narrow command. A full reset is still a separate decision.",
    "once": true,
    "choices": [
      {
        "id": "pulse-measure-corridor",
        "label": "Measure the corridor before announcing it",
        "detail": "Secure the timing record so the next attempt can be planned safely.",
        "deltas": {
          "energy": -10,
          "technology": 10
        },
        "note": "The brief light fades, but its timing is repeatable. The evidence supports a coordinated reset only if the network’s human safeguards are preserved.",
        "setFlags": [
          "test-pulse-succeeded",
          "pulse-result-recorded"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "elias": 4,
            "nadia": 2
          },
          "discoverEvidence": [
            "light-corridor-telemetry",
            "reset-test-telemetry"
          ],
          "revealTruths": [
            "narrow-light-corridor-confirmed",
            "safe-reset-tested-once"
          ]
        }
      },
      {
        "id": "pulse-broadcast-success",
        "label": "Broadcast the success to both cities",
        "detail": "Let citizens witness the result while accepting a rush of expectations.",
        "deltas": {
          "order": 15,
          "technology": -10
        },
        "note": "Both cities see the same five seconds of light. The public record protects the finding but adds pressure to move quickly.",
        "setFlags": [
          "test-pulse-succeeded",
          "pulse-result-public",
          "pulse-result-recorded"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 5,
            "nadia": 4,
            "vale": -2
          },
          "discoverEvidence": [
            "light-corridor-telemetry",
            "reset-test-telemetry"
          ],
          "revealTruths": [
            "narrow-light-corridor-confirmed",
            "safe-reset-tested-once"
          ]
        }
      },
      {
        "id": "pulse-give-hearth9-witness",
        "label": "Let Hearth-9 hold the independent copy",
        "detail": "Make the successful test jointly verifiable, even if Vesper does not control the entire record.",
        "deltas": {
          "energy": -10,
          "order": 10
        },
        "note": "Hearth-9 retains its own signed telemetry. Neither city can quietly exaggerate or erase the result.",
        "setFlags": [
          "test-pulse-succeeded",
          "pulse-result-jointly-verified",
          "pulse-result-recorded"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 4,
            "elias": 5,
            "nadia": 4
          },
          "discoverEvidence": [
            "light-corridor-telemetry",
            "reset-test-telemetry",
            "settlement-compact-signatures"
          ],
          "revealTruths": [
            "narrow-light-corridor-confirmed",
            "safe-reset-tested-once",
            "safe-reset-requires-coordination"
          ]
        }
      }
    ]
  },
  {
    "id": "test-pulse-failure",
    "title": "The light came back wrong",
    "location": "HELIOSTAT ARRAY · SAFETY SHUTDOWN",
    "category": "ACT IV / TEST FAILURE",
    "description": "The pulse catches the edge of the window and returns as a pressure wave through the mirror bank. The automatic shutdown prevents a city-wide collapse, but several mirrors are out of alignment. The failure proves the timing window is real and the present setup was not safe enough; it does not prove natural light is impossible.",
    "once": true,
    "choices": [
      {
        "id": "pulse-failure-abort-repair",
        "label": "Abort, repair the mirror bank, and preserve the telemetry",
        "detail": "Accept the loss and use the data to avoid repeating the same failure.",
        "deltas": {
          "technology": 10,
          "order": 10
        },
        "note": "The array returns to local mode. The city feed shows a damaged red edge around the artificial sun, while engineers keep the failure record.",
        "setFlags": [
          "test-pulse-failed",
          "pulse-result-recorded",
          "array-repair-required"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 4,
            "elias": 3,
            "ilya": 2
          },
          "discoverEvidence": [
            "reset-test-telemetry",
            "pulse-failure-report"
          ],
          "revealTruths": [
            "test-pulse-failure-documented"
          ]
        }
      },
      {
        "id": "pulse-failure-conceal",
        "label": "Conceal the failure to prevent panic",
        "detail": "Keep the immediate order, but create a dangerous public-trust debt.",
        "deltas": {
          "order": 10,
          "technology": -10
        },
        "note": "The public sees only a brief power fluctuation. The raw telemetry survives in the archive; if it is exposed later, concealment will deepen the crisis.",
        "setFlags": [
          "test-pulse-failed",
          "pulse-failure-concealed"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 5,
            "nadia": -5,
            "ilya": -4
          },
          "discoverEvidence": [
            "reset-test-telemetry"
          ]
        }
      },
      {
        "id": "pulse-failure-publish",
        "label": "Publish the failure and the safety report",
        "detail": "Show why the test failed before anyone can call it a miracle or sabotage.",
        "deltas": {
          "order": -10,
          "technology": 10
        },
        "note": "The public response is tense, but both cities see exactly where the safety margin failed. The next decision can be made from evidence rather than a rumour.",
        "setFlags": [
          "test-pulse-failed",
          "pulse-result-public",
          "pulse-result-recorded"
        ],
        "storyEffects": {
          "relationships": {
            "nadia": 5,
            "ilya": 3,
            "vale": -4
          },
          "discoverEvidence": [
            "reset-test-telemetry",
            "pulse-failure-report"
          ],
          "revealTruths": [
            "test-pulse-failure-documented"
          ]
        }
      }
    ]
  },
  {
    "id": "act4-final-vote",
    "title": "The reset is not a switch",
    "location": "VESPER · JOINT OPERATIONS CHAMBER",
    "category": "ACT IV / CLIMAX",
    "description": "DAWNLINE announces that its next closure cycle will classify an unauthorised reset as a planetary security breach. The test has shown that a narrow corridor is possible, but a complete handoff must preserve the original protective shield, use an authenticated human lock, and coordinate two independent cities. The vote determines what Vesper is prepared to attempt—not whether the danger disappears.",
    "once": true,
    "choices": [
      {
        "id": "vote-coordinated-reset",
        "label": "Approve a coordinated human-supervised reset",
        "detail": "Proceed only with verified telemetry, shared safeguards and a tested corridor.",
        "deltas": {
          "technology": 10,
          "order": 10
        },
        "note": "The vote authorises a staged reset under dual-city verification. DAWNLINE still has to accept the human handoff; success is not yet guaranteed.",
        "setFlags": [
          "act-four-complete",
          "act-five-opened",
          "final-strategy-coordinated-reset"
        ],
        "storyEffects": {
          "chapter": 5,
          "relationships": {
            "mara": 4,
            "elias": 3,
            "ilya": 3,
            "nadia": 3
          },
          "discoverEvidence": [
            "control-vote-record"
          ],
          "revealTruths": [
            "both-cities-control-protocol"
          ]
        },
        "requiresFlags": [
          "test-pulse-succeeded",
          "settlement-compact-signed"
        ],
        "requiresTruths": [
          "safe-reset-requires-coordination"
        ]
      },
      {
        "id": "vote-preserve-artificial-dawn",
        "label": "Preserve the artificial suns and defer the full reset",
        "detail": "Keep the verified local system running while building a safer long-term model.",
        "deltas": {
          "energy": 10,
          "order": 10,
          "technology": 10
        },
        "note": "Vesper will not issue a full planetary command in this window. The city chooses a stable artificial dawn over a poorly understood global intervention.",
        "setFlags": [
          "act-four-complete",
          "act-five-opened",
          "final-strategy-eternal-city"
        ],
        "storyEffects": {
          "chapter": 5,
          "relationships": {
            "mara": 4,
            "vale": 3,
            "ilya": 2
          },
          "discoverEvidence": [
            "control-vote-record"
          ]
        }
      },
      {
        "id": "vote-stage-evacuation",
        "label": "Prepare a staged evacuation toward Hearth-9",
        "detail": "Protect people against a possible lockout, accepting that the city may lose control of its own future.",
        "deltas": {
          "food": -10,
          "order": -10,
          "population": 10
        },
        "note": "Evacuation becomes the fallback while the technical team keeps a local system running. The operation is no longer only about a machine; it is about who can leave and who must stay.",
        "setFlags": [
          "act-four-complete",
          "act-five-opened",
          "final-strategy-evacuation"
        ],
        "storyEffects": {
          "chapter": 5,
          "relationships": {
            "ilya": 5,
            "jorel": 2,
            "vale": -3
          },
          "discoverEvidence": [
            "control-vote-record"
          ]
        }
      }
    ]
  },
  {
    "id": "act-five-briefing",
    "title": "The last window",
    "location": "VESPER · FINAL OPERATIONS ROOM",
    "category": "ACT V / OPENING",
    "description": "The vote is recorded. DAWNLINE’s closure window is approaching, the city has chosen a strategy, and Hearth-9 has its own copy of the evidence. The remaining campaign will decide whether the human handoff succeeds, whether Jorel can be brought home, and what political order survives the outcome. There is no clean way to make every risk disappear.",
    "once": true,
    "choices": [
      {
        "id": "final-brief-coordinated",
        "label": "Mobilise the coordinated reset team",
        "detail": "Put engineers, civic witnesses and Hearth-9 operators on the same schedule.",
        "deltas": {
          "energy": -10,
          "food": -10,
          "technology": 10
        },
        "note": "The team moves to the shared control window. The next operation will depend on the quality of the safeguards you built.",
        "setFlags": [
          "act-five-opening-coordinated"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 2,
            "elias": 2,
            "ilya": 2
          }
        }
      },
      {
        "id": "final-brief-preserve",
        "label": "Reinforce the local artificial dawn",
        "detail": "Prepare the city to survive if DAWNLINE refuses the handoff.",
        "deltas": {
          "energy": 10,
          "order": 10
        },
        "note": "Vesper prepares local heat and mirror reserves. It may not restore the natural sky, but it will not leave the city without a fallback.",
        "setFlags": [
          "act-five-opening-preserve"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 3,
            "vale": 2
          }
        }
      },
      {
        "id": "final-brief-evacuate",
        "label": "Open the protected route to Hearth-9",
        "detail": "Prepare transport and civilian manifests while the control team works.",
        "deltas": {
          "food": -10,
          "population": 10,
          "order": -10
        },
        "note": "The northern route becomes a real contingency, not just an expedition line. The final operation must account for people who cannot remain in Vesper.",
        "setFlags": [
          "act-five-opening-evacuation"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 3,
            "jorel": 2,
            "nadia": 2
          }
        }
      }
    ]
  }
];
const ACT_FIVE_EVENTS: GameEvent[] = [
  {
    "id": "act-five-commitments",
    "title": "Who stands at the final console?",
    "location": "VESPER · FINAL OPERATIONS ROOM",
    "category": "ACT V / CHARACTER COMMITMENTS",
    "description": "The strategy is chosen, but a vote is not a team. The last operation needs people willing to own its risks. Mara wants a repair crew who can abort without permission; Ilya wants civilian witnesses; Vale wants a single chain of command; the transport guild asks whether evacuation is a real plan or a bargaining tactic. You can build one coalition now. The others will remember being left outside the room.",
    "once": true,
    "choices": [
      {
        "id": "commit-engineering-coalition",
        "label": "Trust the engineers and independent operators",
        "detail": "Give Mara and Elias control of calibration, with Nadia recording each step.",
        "deltas": {
          "energy": -10,
          "technology": 10,
          "order": -10
        },
        "note": "Mara accepts only if the abort conditions remain public. Elias places the verified timing table beside the controls.",
        "setFlags": [
          "final-commitment-engineering"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 8,
            "elias": 8,
            "nadia": 2,
            "vale": -2
          },
          "meetCharacters": [
            "mara",
            "elias"
          ],
          "discoverEvidence": [
            "final-operation-roster"
          ]
        }
      },
      {
        "id": "commit-civic-coalition",
        "label": "Put civilians and witnesses beside the controls",
        "detail": "Ilya and Nadia will make the operation answerable to the people who bear its cost.",
        "deltas": {
          "energy": -10,
          "order": 10,
          "technology": -10
        },
        "note": "Ilya accepts a seat only if emergency powers expire when the operation ends. Nadia insists that the raw log be copied to both cities.",
        "setFlags": [
          "final-commitment-civic",
          "final-public-mandate"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 8,
            "nadia": 8,
            "mara": 2,
            "vale": -6
          },
          "meetCharacters": [
            "ilya",
            "nadia"
          ],
          "discoverEvidence": [
            "final-operation-roster",
            "public-operation-mandate"
          ]
        }
      },
      {
        "id": "commit-security-chain",
        "label": "Give Vale the unified command",
        "detail": "A single chain of command may act fast, but dissent will be treated as an operational risk.",
        "deltas": {
          "energy": 10,
          "order": -10,
          "technology": -10
        },
        "note": "Vale accepts responsibility for the whole operation. He orders every corridor guarded and every alternative plan placed under his seal.",
        "setFlags": [
          "final-commitment-security",
          "final-security-command"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 10,
            "ilya": -8,
            "nadia": -4
          },
          "meetCharacters": [
            "vale"
          ],
          "discoverEvidence": [
            "final-operation-roster"
          ]
        }
      },
      {
        "id": "commit-evacuation-convoy",
        "label": "Make the evacuation convoy a real commitment",
        "detail": "Reserve transport, heat cells and space at Hearth-9 before the closure window.",
        "deltas": {
          "food": -10,
          "population": 10,
          "order": 10
        },
        "note": "The transport guild receives names rather than estimates. The convoy can move people if Vesper cannot safely hold the line.",
        "setFlags": [
          "final-commitment-evacuation",
          "final-convoy-prepared"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 5,
            "jorel": 4,
            "nadia": 3,
            "vale": -2
          },
          "meetCharacters": [
            "ilya"
          ],
          "discoverEvidence": [
            "final-evacuation-manifest"
          ]
        }
      }
    ]
  },
  {
    "id": "act-five-jorel-dispatch",
    "title": "A voice at the outer relay",
    "location": "HEARTH-9 ↔ K-17 · NARROWBAND CHANNEL",
    "category": "ACT V / PERSONAL STAKES",
    "description": "The final closure window is narrowing. A burst of maintenance telemetry carries Jorel’s old checksum, but a checksum alone cannot tell you whether he is at the other end of the line. If the current signal was authenticated, an extraction can be attempted now. Otherwise, Hearth-9 can send a query to his last verified work post—or you can keep every watt on the main operation and accept that the search may end in silence.",
    "once": true,
    "choices": [
      {
        "id": "final-jorel-extraction",
        "label": "Use the live code to bring Jorel through the pressure lock",
        "detail": "Divert the outer team for one last extraction while the relay is still answering.",
        "deltas": {
          "energy": -10,
          "food": -10,
          "order": 10
        },
        "note": "The code returns with the correct human challenge. Hearth-9 opens the pressure lock and receives Jorel and the relay technician. The rescue costs reserves, but the city no longer has to infer his fate.",
        "requiresTruths": [
          "jorel-current-signal-confirmed"
        ],
        "minStats": {
          "energy": 15,
          "food": 15
        },
        "setFlags": [
          "jorel-rescued",
          "jorel-final-extraction"
        ],
        "storyEffects": {
          "relationships": {
            "jorel": 15,
            "ilya": 12,
            "elias": 3
          },
          "discoverEvidence": [
            "jorel-return-record"
          ],
          "revealTruths": [
            "jorel-rescued"
          ]
        }
      },
      {
        "id": "final-jorel-request",
        "label": "Ask Hearth-9 to dispatch a team to the last verified post",
        "detail": "Use the roster and transfer record; do not claim a rescue that has not happened.",
        "deltas": {
          "energy": -10,
          "technology": 10,
          "order": 10
        },
        "note": "Hearth-9 accepts the request and starts a search against the last verified coordinates. Jorel’s fate remains unresolved, but his name is now on an acknowledged rescue manifest.",
        "requiresTruths": [
          "jorel-survived"
        ],
        "setFlags": [
          "jorel-rescue-requested",
          "jorel-final-extraction-pending"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 5,
            "jorel": 3,
            "nadia": 2
          },
          "discoverEvidence": [
            "jorel-return-record"
          ]
        }
      },
      {
        "id": "final-jorel-hold",
        "label": "Keep the relay team on station until the operation closes",
        "detail": "Protect the only live handoff channel; defer the personal rescue.",
        "deltas": {
          "energy": 10,
          "order": -10
        },
        "note": "The relay remains staffed through the window. Ilya does not forgive the delay, but she sees the decision recorded rather than hidden.",
        "setFlags": [
          "jorel-rescue-deferred"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": -4,
            "jorel": -2
          },
          "discoverEvidence": [
            "jorel-return-record"
          ]
        }
      }
    ]
  },
  {
    "id": "act-five-final-operation",
    "title": "Afterlight",
    "location": "DAWNLINE · FINAL CONTROL WINDOW",
    "category": "ACT V / FINAL DECISION",
    "description": "DAWNLINE begins its closure sequence. The five-second corridor proved that natural light can enter the atmosphere, but it did not prove that the planetary shield can be reset safely. At the console are the evidence you preserved, the coalition you chose, the fallback systems you built, and the cities that agreed—or refused—to share control. There is no option without a cost. What future will Vesper commit itself to?",
    "once": true,
    "choices": [
      {
        "id": "ending-first-morning",
        "label": "Attempt the coordinated human-supervised reset",
        "detail": "Open the tested corridor, preserve the protective shield, and transfer control only on reciprocal confirmation.",
        "deltas": {
          "energy": -10,
          "food": -10,
          "technology": 10,
          "order": 10
        },
        "note": "The two cities confirm the timing receipt. A human witness holds the interlock while DAWNLINE releases the maintained veil cycle in stages. Natural light reaches Vesper—not as a miracle, but as a process that can be measured, stopped and continued.",
        "requiresFlags": [
          "test-pulse-succeeded",
          "settlement-compact-signed",
          "human-interlock-understood",
          "final-commitment-engineering"
        ],
        "requiresTruths": [
          "safe-reset-requires-coordination",
          "both-cities-control-protocol",
          "safe-reset-tested-once",
          "human-override-required"
        ],
        "minStats": {
          "technology": 35,
          "energy": 15
        },
        "setFlags": [
          "act-five-complete",
          "ending-first-morning",
          "dawn-reached"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 8,
            "elias": 8,
            "ilya": 5,
            "nadia": 6,
            "jorel": 4
          },
          "discoverEvidence": [
            "final-reset-record"
          ],
          "revealTruths": [
            "dawnline-human-handoff-complete"
          ],
          "districts": {
            "west": "recovering",
            "lower": "recovering",
            "core": "recovering"
          }
        }
      },
      {
        "id": "ending-eternal-city",
        "label": "Preserve the artificial dawn and refuse a planetary reset",
        "detail": "Keep Vesper’s proven local system, publish the limits, and continue a slower reconstruction.",
        "deltas": {
          "energy": 10,
          "food": 10,
          "order": 10,
          "technology": 10
        },
        "note": "Vesper declines the global command. Engineers isolate the local array from the autonomous network and begin a long programme of repair, food production and controlled research. The sky remains dark, but the city is no longer waiting for a single dangerous switch.",
        "setFlags": [
          "act-five-complete",
          "ending-eternal-city",
          "local-dawn-preserved"
        ],
        "storyEffects": {
          "relationships": {
            "mara": 5,
            "vale": 3,
            "ilya": 2
          },
          "discoverEvidence": [
            "local-dawn-charter"
          ],
          "districts": {
            "west": "recovering",
            "core": "stable"
          }
        }
      },
      {
        "id": "ending-peoples-dawn",
        "label": "Transfer control to a civilian recovery assembly",
        "detail": "Make the network evidence public, end emergency rule and let both cities share the next decision.",
        "deltas": {
          "energy": -10,
          "food": -10,
          "order": 15,
          "technology": -10
        },
        "note": "The public archive, safety record and command logs are opened to both cities. Emergency authority expires under a witnessed vote. The reset is not completed tonight; the achievement is that no one can make the next planetary decision alone.",
        "requiresFlags": [
          "final-commitment-civic"
        ],
        "setFlags": [
          "act-five-complete",
          "ending-peoples-dawn",
          "civilian-recovery-assembly"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 12,
            "nadia": 10,
            "mara": 2,
            "vale": -8
          },
          "discoverEvidence": [
            "civilian-recovery-charter"
          ],
          "districts": {
            "south": "recovering",
            "lower": "recovering"
          }
        }
      },
      {
        "id": "ending-iron-winter",
        "label": "Place the city under permanent emergency command",
        "detail": "Keep the local sun running through surveillance, ration discipline and one chain of authority.",
        "deltas": {
          "energy": 15,
          "food": 10,
          "order": -15,
          "population": -10
        },
        "note": "The lights stay on. Checkpoints become permanent and the archive is placed under guard. Vale calls it stability; the citizens learn to whisper beneath a functioning artificial dawn.",
        "requiresFlags": [
          "final-commitment-security"
        ],
        "setFlags": [
          "act-five-complete",
          "ending-iron-winter",
          "permanent-emergency-rule"
        ],
        "storyEffects": {
          "relationships": {
            "vale": 12,
            "ilya": -12,
            "nadia": -8
          },
          "districts": {
            "south": "sealed",
            "lower": "strained"
          }
        }
      },
      {
        "id": "ending-beyond-ridge",
        "label": "Lead the evacuation toward Hearth-9",
        "detail": "Move people before the closure sequence, accepting the loss of Vesper as the centre of civilisation.",
        "deltas": {
          "food": -10,
          "energy": -10,
          "population": 10,
          "order": -10
        },
        "note": "The convoy leaves in staggered groups along the protected ridge route. Not everyone can travel, and Vesper’s skyline recedes behind the storm. Hearth-9 accepts the survivors under the compact—or under a fragile emergency arrangement if the compact was never signed.",
        "requiresFlags": [
          "final-commitment-evacuation"
        ],
        "setFlags": [
          "act-five-complete",
          "ending-beyond-ridge",
          "evacuation-launched"
        ],
        "storyEffects": {
          "relationships": {
            "ilya": 8,
            "jorel": 5,
            "nadia": 4,
            "vale": -5
          },
          "discoverEvidence": [
            "final-evacuation-manifest"
          ],
          "districts": {
            "north": "recovering",
            "core": "sealed"
          }
        }
      },
      {
        "id": "ending-last-light",
        "label": "Force an unverified hard reset",
        "detail": "Override the remaining interlocks and send one command before the closure window ends.",
        "deltas": {
          "energy": -50,
          "technology": -30,
          "order": -20,
          "population": -15
        },
        "note": "The command reaches the network without the required reciprocal witness. DAWNLINE triggers its protective closure. The artificial sun fractures into isolated beams; the city’s last chance to recover becomes a record of why the safeguards existed.",
        "setFlags": [
          "act-five-complete",
          "ending-last-light",
          "dawnline-catastrophic-lockout"
        ],
        "storyEffects": {
          "relationships": {
            "mara": -10,
            "elias": -10,
            "ilya": -10,
            "nadia": -10,
            "vale": -5
          },
          "discoverEvidence": [
            "catastrophic-lockout-record"
          ],
          "districts": {
            "core": "sealed",
            "west": "dark",
            "north": "sealed"
          }
        }
      }
    ]
  }
];

EVENTS.push(...ACT_FOUR_EVENTS, ...ACT_FIVE_EVENTS);

export const EVENT_BY_ID = Object.fromEntries(EVENTS.map((event) => [event.id, event])) as Record<string, GameEvent>;
