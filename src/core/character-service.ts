/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCharacter as open20CreateCharacter,
  prepareSpell as open20PrepareSpell,
  unprepareSpell as open20UnprepareSpell,
  consumeSpellSlot as open20ConsumeSpellSlot,
  recoverSpellSlot as open20RecoverSpellSlot,
  longRest as open20LongRest,
  shortRest as open20ShortRest,
  recomputeDerivedStats as open20Recompute,
  rollSpellAttack,
  rollSpellDamage,
  defaultRandom,
  type AttackRollResult,
  type DamageRollResult
} from 'open20-core/browser';
import type { AppCharacter } from './types';
import { dataLoader } from './data-loader';

import { SpellService } from './spell-service';

const SPELL_SIDE_EFFECTS: Record<string, any> = {
  'goodberry': {
    resource: {
      id: 'goodberry-pool',
      name: 'Goodberries',
      max: 10,
      current: 10,
      reset: 'Long Rest'
    }
  }
};

export class CharacterService {
  static createCharacter(params: any): AppCharacter {
    const raw = open20CreateCharacter(params, dataLoader as any);
    const char = open20Recompute(raw, dataLoader as any);
    return { ...char, id: crypto.randomUUID() } as AppCharacter;
  }

  static recompute(character: AppCharacter): AppCharacter {
    if (!character.classes || !character.abilityScores || !character.abilityScores.base || !character.hitPoints) {
      return character;
    }
    const recomputed = open20Recompute(character, dataLoader as any);
    return { ...recomputed, id: character.id } as AppCharacter;
  }

  static prepareSpell(character: AppCharacter, spellId: string): AppCharacter {
    return { ...open20PrepareSpell(character, spellId) as any, id: character.id };
  }

  static unprepareSpell(character: AppCharacter, spellId: string): AppCharacter {
    return { ...open20UnprepareSpell(character, spellId) as any, id: character.id };
  }

  static consumeSpellSlot(character: AppCharacter, level: number): AppCharacter {
    return { ...open20ConsumeSpellSlot(character, level) as any, id: character.id };
  }

  static recoverSpellSlot(character: AppCharacter, level: number): AppCharacter {
    return { ...open20RecoverSpellSlot(character, level) as any, id: character.id };
  }

  static longRest(character: AppCharacter): AppCharacter {
    return { ...open20LongRest(character, dataLoader as any) as any, id: character.id };
  }

  static shortRest(character: AppCharacter): AppCharacter {
    return { ...open20ShortRest(character, 0, dataLoader as any) as any, id: character.id };
  }

  static startConcentration(character: AppCharacter, spellId: string): AppCharacter {
    const withoutConcentrating = character.conditions.filter(c => c.id !== 'Concentrating');
    const newCondition = {
      id: 'Concentrating' as any,
      source: spellId,
      appliedAt: new Date().toISOString(),
    };
    return { 
      ...character, 
      conditions: [...withoutConcentrating, newCondition],
      updatedAt: new Date().toISOString()
    };
  }

  static endConcentration(character: AppCharacter): AppCharacter {
    return { 
      ...character, 
      conditions: character.conditions.filter(c => c.id !== 'Concentrating'),
      updatedAt: new Date().toISOString()
    };
  }

  static learnSpell(character: AppCharacter, spellId: string): AppCharacter {
    if (character.spells.knownSpells.includes(spellId)) return character;
    return {
      ...character,
      spells: { ...character.spells, knownSpells: [...character.spells.knownSpells, spellId] },
      updatedAt: new Date().toISOString()
    };
  }

  static unlearnSpell(character: AppCharacter, spellId: string): AppCharacter {
    return {
      ...character,
      spells: {
        ...character.spells,
        knownSpells: character.spells.knownSpells.filter(id => id !== spellId),
        // also unprepare if it was prepared
        preparedSpells: character.spells.preparedSpells.filter(id => id !== spellId),
      },
      updatedAt: new Date().toISOString()
    };
  }


  static castSpell(character: AppCharacter, spellId: string, level: number): AppCharacter {
    // 1. Consume slot
    let char = { ...open20ConsumeSpellSlot(character, level) as any, id: character.id };
    
    // 2. Apply side effects
    const effect = SPELL_SIDE_EFFECTS[spellId.toLowerCase()];
    if (effect?.resource) {
      const existing = char.resources.find((r: any) => r.id === effect.resource.id);
      if (existing) {
        char.resources = char.resources.map((r: any) => 
          r.id === effect.resource.id ? { ...r, current: effect.resource.max } : r
        );
      } else {
        char.resources = [...char.resources, effect.resource];
      }
    }

    return this.recompute(char);
  }

  static rollSpellAttack(character: AppCharacter, _spellName: string): AttackRollResult {
    return rollSpellAttack({ 
      character, 
      spellcastingAbility: character.spells.spellcastingAbility as any || 'Intelligence',
      rng: defaultRandom
    });
  }

  static rollSpellDamage(character: AppCharacter, spellId: string, _damageIndex: number): DamageRollResult {
    const spell = SpellService.getSpell(spellId);
    if (!spell) throw new Error(`Spell not found: ${spellId}`);

    return rollSpellDamage({ 
      character, 
      spell, 
      slotLevel: spell.level,
      rng: defaultRandom
    });
  }
}
