import type { Spell, SpellFilter } from 'open20-core/browser';
import type { AppCharacter } from './types';
import { dataLoader } from './data-loader';

import { SchemaService } from './schema-service';

/**
 * Service for querying and managing spells.
 * Ensures all spells are sanitized and normalized for use in the UI.
 */
export class SpellService {
  private static cachedSpells: Spell[] | null = null;

  static getAllSpells(): Spell[] {
    if (!this.cachedSpells) {
      const rawSpells = dataLoader.getAllSpells();
      this.cachedSpells = SchemaService.transformSpells(rawSpells);
    }
    return this.cachedSpells;
  }

  static getSpell(id: string): Spell | undefined {
    return this.getAllSpells().find(s => s.id === id);
  }

  static searchSpells(filter: SpellFilter): Spell[] {
    let results = this.getAllSpells();
    
    if (filter?.query) {
      const q = filter.query.toLowerCase();
      results = results.filter(s => s.name.toLowerCase().includes(q));
    }

    if (filter?.level !== undefined) {
      results = results.filter(s => s.level === filter.level);
    }

    if (filter?.classes && filter.classes.length > 0) {
      results = results.filter(s => 
        s.classes?.some(c => filter.classes?.includes(c))
      );
    }
    
    return results;
  }

  static getSpellsForCharacter(_character: AppCharacter): Spell[] {
    return this.getAllSpells();
  }

  static isSpellPrepared(character: AppCharacter, spellId: string): boolean {
    const isManual = character.spells?.preparedSpells?.includes(spellId) ?? false;
    const isAlways = character.spells?.alwaysPreparedSpells?.includes(spellId) ?? false;
    return isManual || isAlways;
  }
}
