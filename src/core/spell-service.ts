/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Spell } from 'open20-core/browser';
import type { AppCharacter } from './types';
import { dataLoader } from './data-loader';

const ALL_CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer'];

// Map the raw JSON spell to ensure components and classes are formatted correctly
function sanitizeSpell(rawSpell: any): Spell {
  const components: string[] = [];
  if (Array.isArray(rawSpell.components)) {
    components.push(...rawSpell.components);
  } else if (typeof rawSpell.components === 'object' && rawSpell.components !== null) {
    if (rawSpell.components.V) components.push('V');
    if (rawSpell.components.S) components.push('S');
    if (rawSpell.components.M) components.push('M');
  }
  
  // The SRD data often lacks a structured 'classes' array but includes it in the description
  let classes = rawSpell.classes;
  if (!classes || classes.length === 0) {
    const desc = rawSpell.description || '';
    classes = ALL_CLASSES.filter(cls => {
      const regex = new RegExp(`\\b${cls}\\b`, 'i');
      return regex.test(desc);
    });
  }
  
  return {
    ...rawSpell,
    components,
    classes,
  } as Spell;
}

// Cache the sanitized spells
let cachedSpells: Spell[] | null = null;
function getAllSpells(): Spell[] {
  if (!cachedSpells) {
    cachedSpells = dataLoader.getAllSpells().map(sanitizeSpell);
  }
  return cachedSpells;
}

export class SpellService {
  static getSpell(id: string): Spell | undefined {
    return getAllSpells().find(s => s.id === id);
  }

  static searchSpells(filter: any): Spell[] {
    let results = getAllSpells();
    
    // Quick and dirty filter implementation
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      results = results.filter(s => s.name.toLowerCase().includes(q));
    }
    
    return results;
  }

  static getSpellsForCharacter(_character: AppCharacter): Spell[] {
    return getAllSpells();
  }

  static isSpellPrepared(character: AppCharacter, spellId: string): boolean {
    return character.spells?.preparedSpells?.includes(spellId) ?? false;
  }
}
