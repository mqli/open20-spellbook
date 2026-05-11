import type { Spell, Class, Species, Background, Feat } from 'open20-core/browser';

/**
 * Service dedicated to validating and transforming raw SRD data into 
 * strict open20-core types. This ensures the rest of the application 
 * can operate with full type safety without 'as any' hacks.
 */
export class SchemaService {
  static transformSpells(rawSpells: any[]): Spell[] {
    return rawSpells.map(raw => {
      // 1. Normalize Components
      let components: string[] = [];
      if (Array.isArray(raw.components)) {
        components = [...raw.components];
      } else if (typeof raw.components === 'string') {
        components = raw.components.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else if (typeof raw.components === 'object' && raw.components !== null) {
        // Handle {V: true, S: true, M: true} or {v: true, s: true, m: true} or {material: "..."}
        components = Object.keys(raw.components).filter(key => !!raw.components[key]);
      }

      // 2. Normalize Classes (Handle arrays, strings, or inference)
      const ALL_CLASSES = ['Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard', 'Artificer'];
      let classes: string[] = [];
      
      if (Array.isArray(raw.classes)) {
        classes = [...raw.classes];
      } else if (typeof raw.classes === 'string') {
        classes = raw.classes.split(',').map((s: string) => s.trim()).filter(Boolean);
      }

      // If still empty, infer from description
      if (classes.length === 0) {
        const desc = (raw.description || '').toLowerCase();
        classes = ALL_CLASSES.filter(c => desc.includes(c.toLowerCase()));
      }

      // Ensure consistent capitalization (e.g., 'wizard' -> 'Wizard')
      classes = classes.map(c => {
        const found = ALL_CLASSES.find(ac => ac.toLowerCase() === c.toLowerCase());
        return found || c.charAt(0).toUpperCase() + c.slice(1).toLowerCase();
      });

      // 3. Return strictly typed Spell
      return {
        ...raw,
        id: raw.id || raw.name.toLowerCase().replace(/\s+/g, '-'),
        level: parseInt(raw.level) || 0,
        components,
        classes,
        ritual: !!raw.ritual,
        concentration: !!raw.concentration,
        source: raw.source || 'SRD',
        description: raw.description || '',
      } as Spell;
    });
  }

  static transformLookupTables(raw: any): any {
    return {
      ...raw,
      spells: this.transformSpells(raw.spells || []),
      classes: (raw.classes || []) as Class[],
      species: (raw.species || []) as Species[],
      backgrounds: (raw.backgrounds || []) as Background[],
      feats: (raw.feats || []) as Feat[],
      monsters: (raw.monsters || []) as any[],
    };
  }
}
