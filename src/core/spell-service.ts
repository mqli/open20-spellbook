import type { Spell } from 'open20-core/browser';
import type { AppCharacter } from './types';
import { dataLoader } from './data-loader';

import { SchemaService } from './schema-service';

interface SpellSearchFilter {
  query?: string;
  level?: number;
  classes?: string[];
}

/**
 * Service for querying and managing spells.
 * Ensures all spells are sanitized and normalized for use in the UI.
 */
export class SpellService {
  private cachedSpells: Spell[] | null = null;

  getAllSpells(): Spell[] {
    if (!this.cachedSpells) {
      const rawSpells = dataLoader.getAllSpells();
      this.cachedSpells = SchemaService.transformSpells(rawSpells);
    }
    return this.cachedSpells;
  }

  getSpell(id: string): Spell | undefined {
    return this.getAllSpells().find(s => s.id === id);
  }

  searchSpells(filter: SpellSearchFilter): Spell[] {
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

  getSpellsForCharacter(character: AppCharacter): Spell[] {
    void character;
    return this.getAllSpells();
  }

  isSpellPrepared(character: AppCharacter, spellId: string): boolean {
    const isManual = character.spells?.preparedSpells?.includes(spellId) ?? false;
    const isAlways = character.spells?.alwaysPreparedSpells?.includes(spellId) ?? false;
    return isManual || isAlways;
  }

  isSpellKnown(character: AppCharacter, spellId: string): boolean {
    const spell = this.getSpell(spellId);
    if (!spell) return false;
    if (!this.isSpellForCharacter(character, spell)) return false;

    const isKnown = character.spells?.knownSpells?.includes(spellId) ?? false;
    const isAlwaysPrepared = character.spells?.alwaysPreparedSpells?.includes(spellId) ?? false;
    if (isKnown || isAlwaysPrepared) return true;

    // Auto-known cantrips for non-spellbook casters
    // For multiclass: only auto-known if the spell belongs to a non-spellbook class
    if (spell.level !== 0) return false;
    
    const spellbookClasses = ['wizard', 'artificer'];
    const spellClasses = spell.classes?.map(c => c.toLowerCase()) ?? [];
    const belongsToSpellbookClass = spellClasses.some(c => spellbookClasses.includes(c));
    
    // If spell belongs to a spellbook class (Wizard/Artificer), must be learned
    if (belongsToSpellbookClass) return false;
    
    // Cantrip belongs to non-spellbook caster - auto-known
    return true;
  }

  isSpellForCharacter(character: AppCharacter, spell: Spell): boolean {
    const characterClassIds = character.classes?.map(c => c.classId.toLowerCase()) ?? [];
    return spell.classes?.some(c => characterClassIds.includes(c.toLowerCase())) ?? false;
  }
}

// Export a default instance for easy use
export const spellService = new SpellService();
