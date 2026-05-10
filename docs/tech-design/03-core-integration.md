## 4. Core Integration Layer

### 4.1 open20-core API Usage

The core integration layer wraps open20-core functions with UI-friendly abstractions.

```typescript
// src/core/types.ts
// Re-export core types for use throughout the app
export type {
  Character,
  Spell,
  SpellSlotMap,
  AbilityScores,
  SpellSchool,
  DamageType,
} from 'open20-core';

// src/core/spell-service.ts
import { getSpell, searchSpells, type SpellFilter } from 'open20-core';
import type { Spell } from 'open20-core';

export class SpellService {
  /**
   * Get a single spell by ID
   * Wraps: open20-core getSpell()
   */
  static getSpell(id: string): Spell | undefined {
    return getSpell(id);
  }

  /**
   * Search spells with filters
   * Wraps: open20-core searchSpells()
   */
  static searchSpells(filter: SpellFilter): Spell[] {
    return searchSpells(filter);
  }

  /**
   * Get spells for a character (known/prepared)
   * Wraps: open20-core getSpellsForCharacter()
   */
  static getSpellsForCharacter(character: Character): Spell[] {
    return getSpellsForCharacter(character);
  }

  /**
   * Check if a spell is prepared
   * Wraps: open20-core isSpellPrepared()
   */
  static isSpellPrepared(character: Character, spellId: string): boolean {
    return isSpellPrepared(character, spellId);
  }
}

// src/core/character-service.ts
import {
  createCharacter,
  prepareSpell,
  unprepareSpell,
  consumeSpellSlot,
  recoverSpellSlot,
  longRest,
  shortRest,
  type Character,
  type CreateCharacterParams,
} from 'open20-core';

export class CharacterService {
  /**
   * Create a new character
   * Wraps: open20-core createCharacter()
   */
  static createCharacter(params: CreateCharacterParams): Character {
    return createCharacter(params);
  }

  /**
   * Prepare a spell for a character
   * Wraps: open20-core prepareSpell()
   * Returns new Character (immutable)
   */
  static prepareSpell(character: Character, spellId: string): Character {
    return prepareSpell(character, spellId);
  }

  /**
   * Unprepare a spell
   * Wraps: open20-core unprepareSpell()
   */
  static unprepareSpell(character: Character, spellId: string): Character {
    return unprepareSpell(character, spellId);
  }

  /**
   * Consume a spell slot
   * Wraps: open20-core consumeSpellSlot()
   */
  static consumeSpellSlot(character: Character, level: number): Character {
    return consumeSpellSlot(character, level);
  }

  /**
   * Recover a spell slot
   * Wraps: open20-core recoverSpellSlot()
   */
  static recoverSpellSlot(character: Character, level: number): Character {
    return recoverSpellSlot(character, level);
  }

  /**
   * Long rest - recover all slots
   * Wraps: open20-core longRest()
   */
  static longRest(character: Character): Character {
    return longRest(character);
  }

  /**
   * Short rest
   * Wraps: open20-core shortRest()
   */
  static shortRest(character: Character): Character {
    return shortRest(character);
  }
}

// src/core/rules-service.ts
import {
  calculateSpellSlots,
  calculateAC,
  type Character,
} from 'open20-core';

export class RulesService {
  /**
   * Calculate spell save DC
   * Formula: 8 + proficiency bonus + spellcasting ability modifier
   */
  static calculateSpellSaveDC(character: Character): number {
    const proficiency = getProficiencyBonus(character.level);
    const abilityMod = getModifier(character.abilityScores[character.spellcastingAbility]);
    return 8 + proficiency + abilityMod;
  }

  /**
   * Calculate spell attack bonus
   * Formula: proficiency bonus + spellcasting ability modifier
   */
  static calculateSpellAttackBonus(character: Character): number {
    const proficiency = getProficiencyBonus(character.level);
    const abilityMod = getModifier(character.abilityScores[character.spellcastingAbility]);
    return proficiency + abilityMod;
  }

  /**
   * Get available spell slots
   * Wraps: open20-core calculateSpellSlots()
   */
  static getSpellSlots(character: Character): SpellSlotMap {
    return calculateSpellSlots(character);
  }
}
```

### 4.2 Data Flow Pattern

```
User Action (UI)
    │
    ▼
Component Event Handler
    │
    ▼
Store Action (Zustand)
    │
    ▼
Core Service (spell-service.ts / character-service.ts)
    │
    ▼
open20-core Function (immutable, returns new state)
    │
    ▼
Store Update (Zustand set())
    │
    ▼
UI Re-render (React)
```
