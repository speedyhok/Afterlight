export type StatKey = 'population' | 'energy' | 'food' | 'order' | 'technology';
export type Stats = Record<StatKey, number>;
export type Deltas = Partial<Stats>;
export type CharacterId = 'mara' | 'ilya' | 'vale' | 'elias' | 'nadia' | 'jorel';
export type DistrictId = 'west' | 'lower' | 'south' | 'north' | 'core';
export type DistrictCondition = 'stable' | 'strained' | 'dark' | 'recovering' | 'sealed';

export interface StoryState {
  chapter: number;
  relationships: Record<CharacterId, number>;
  metCharacters: CharacterId[];
  evidence: string[];
  truths: string[];
  districts: Record<DistrictId, DistrictCondition>;
}

export interface StoryEffects {
  relationships?: Partial<Record<CharacterId, number>>;
  meetCharacters?: CharacterId[];
  discoverEvidence?: string[];
  revealTruths?: string[];
  districts?: Partial<Record<DistrictId, DistrictCondition>>;
  chapter?: number;
}

export interface DelayedEffect {
  id: string;
  dueDay: number;
  deltas: Deltas;
  message: string;
  setFlags?: string[];
  storyEffects?: StoryEffects;
}

export interface Choice {
  id: string;
  requiresFlags?: string[];
  requiresEvidence?: string[];
  requiresTruths?: string[];
  requiresRelationship?: { character: CharacterId; min?: number; max?: number }[];
  minStats?: Partial<Stats>;
  label: string;
  detail: string;
  deltas: Deltas;
  setFlags?: string[];
  clearFlags?: string[];
  delay?: { turns: number; deltas: Deltas; message: string; setFlags?: string[]; storyEffects?: StoryEffects };
  note?: string;
  storyEffects?: StoryEffects;
}

export interface GameEvent {
  id: string;
  title: string;
  location: string;
  category: string;
  description: string;
  quote?: string;
  choices: Choice[];
  minDay?: number;
  requiresFlags?: string[];
  excludesFlags?: string[];
  requiresAnyFlags?: string[];
  requiresEvidence?: string[];
  requiresTruths?: string[];
  requiresRelationship?: { character: CharacterId; min?: number; max?: number }[];
  priority?: number;
  minTechnology?: number;
  maxTechnology?: number;
  once?: boolean;
}

export interface HistoryEntry {
  day: number;
  eventId: string;
  eventTitle: string;
  choiceLabel: string;
  deltas: Deltas;
  note?: string;
  delayedMessages?: string[];
}

export interface GameState {
  day: number;
  stats: Stats;
  flags: string[];
  seenEvents: string[];
  history: HistoryEntry[];
  pending: DelayedEffect[];
  currentEventId: string;
  status: 'playing' | 'lost' | 'won';
  endingTitle?: string;
  endingText?: string;
  lastFeedback?: { title: string; text: string; deltas: Deltas };
  story: StoryState;
}
