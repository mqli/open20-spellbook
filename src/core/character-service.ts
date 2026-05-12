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
  addKnownSpell,
  removeKnownSpell,
  knowsSpell,
  type AttackRollResult,
  type DamageRollResult
} from 'open20-core';
import type { AppCharacter } from './types';
import { SpellService } from './spell-service';

import { dataLoader } from './data-loader';

// D&D 5e caster types:
// - Known casters: learn a fixed list; cast any known (no preparation)
// - Prepared casters: prepare from full class list after each long rest
// - Spellbook casters: learn spells into a spellbook, then prepare from it daily
const KNOWN_ONLY_CLASSES = new Set(['bard', 'sorcerer', 'warlock', 'ranger']);
const PREPARED_ONLY_CLASSES = new Set(['cleric', 'druid', 'paladin']);
const SPELLBOOK_CLASSES = new Set(['wizard', 'artificer']);

export function getCasterType(character: AppCharacter): {
  canLearn: boolean;
  canPrepare: boolean;
  isSpellbookCaster: boolean;
} {
  const classIds = character.classes?.map(c => c.classId.toLowerCase()) ?? [];
  const canLearn = classIds.some(id => KNOWN_ONLY_CLASSES.has(id) || SPELLBOOK_CLASSES.has(id));
  const canPrepare = classIds.some(id => PREPARED_ONLY_CLASSES.has(id) || SPELLBOOK_CLASSES.has(id));
  const isSpellbookCaster = classIds.some(id => SPELLBOOK_CLASSES.has(id));
  return { canLearn, canPrepare, isSpellbookCaster };
}

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
  private spellService: SpellService;

  constructor(spellService: SpellService) {
    this.spellService = spellService;
  }

  createCharacter(params: any): AppCharacter {
    const raw = open20CreateCharacter(params, dataLoader as any);
    const char = open20Recompute(raw, dataLoader as any);
    return { ...char, id: crypto.randomUUID() } as AppCharacter;
  }

  recompute(character: AppCharacter): AppCharacter {
    if (!character.classes || !character.abilityScores || !character.abilityScores.base || !character.hitPoints) {
      return character;
    }
    const recomputed = open20Recompute(character, dataLoader as any) as any;
    return { ...recomputed, id: character.id } as AppCharacter;
  }

  prepareSpell(character: AppCharacter, spellId: string): AppCharacter {
    return { ...open20PrepareSpell(character, spellId) as any, id: character.id };
  }

  unprepareSpell(character: AppCharacter, spellId: string): AppCharacter {
    return { ...open20UnprepareSpell(character, spellId) as any, id: character.id };
  }

  consumeSpellSlot(character: AppCharacter, level: number): AppCharacter {
    return { ...open20ConsumeSpellSlot(character, level) as any, id: character.id };
  }

  recoverSpellSlot(character: AppCharacter, level: number): AppCharacter {
    return { ...open20RecoverSpellSlot(character, level) as any, id: character.id };
  }

  longRest(character: AppCharacter): AppCharacter {
    return { ...open20LongRest(character, dataLoader as any) as any, id: character.id };
  }

  shortRest(character: AppCharacter): AppCharacter {
    return { ...open20ShortRest(character, 0, dataLoader as any) as any, id: character.id };
  }

  startConcentration(character: AppCharacter, spellId: string): AppCharacter {
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

  endConcentration(character: AppCharacter): AppCharacter {
    return { 
      ...character, 
      conditions: character.conditions.filter(c => c.id !== 'Concentrating'),
      updatedAt: new Date().toISOString()
    };
  }

  learnSpell(character: AppCharacter, spellId: string): AppCharacter {
    if (knowsSpell(character, spellId)) return character;
    const castingClass = Object.keys(character.spells.classSpellcasting)[0];
    if (!castingClass) return character; // can't learn if we don't know the class spellcasting type
    return {
      ...addKnownSpell(character, castingClass, spellId) as any,
      updatedAt: new Date().toISOString()
    };
  }

  unlearnSpell(character: AppCharacter, spellId: string): AppCharacter {
    if (!knowsSpell(character, spellId)) return character;
    const castingClass = Object.keys(character.spells.classSpellcasting)[0];
    if (!castingClass) return character; // can't unlearn if we don't know the class spellcasting type
    return {
      ...removeKnownSpell(character, castingClass, spellId) as any,
      updatedAt: new Date().toISOString()
    };
  }

  castSpell(character: AppCharacter, spellId: string, level: number): AppCharacter {
    // 1. Consume slot
    const char = { ...open20ConsumeSpellSlot(character, level) as any, id: character.id };
    
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

  rollSpellAttack(character: AppCharacter, spellName: string): AttackRollResult {
    void spellName;
    return rollSpellAttack({ 
      character, 
      spellcastingAbility: character.spells.spellcastingAbility as any || 'Intelligence',
      rng: defaultRandom
    });
  }

  rollSpellDamage(character: AppCharacter, spellId: string, damageIndex: number): DamageRollResult {
    void damageIndex;
    const spell = this.spellService.getSpell(spellId);
    if (!spell) throw new Error(`Spell not found: ${spellId}`);

    return rollSpellDamage({ 
      character, 
      spell, 
      slotLevel: spell.level,
      rng: defaultRandom
    });
  }
}

// Create default instance (will be replaced in tests)
const spellService = new SpellService();
export const characterService = new CharacterService(spellService);
