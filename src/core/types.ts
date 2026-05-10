import type { Character, Spell, AbilityScores } from 'open20-core/browser';

export type AppCharacter = Character & { id: string };

export type {
  Character,
  Spell,
  AbilityScores,
};
