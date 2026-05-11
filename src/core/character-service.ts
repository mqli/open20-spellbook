/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createCharacter as open20CreateCharacter,
  prepareSpell as open20PrepareSpell,
  unprepareSpell as open20UnprepareSpell,
  consumeSpellSlot as open20ConsumeSpellSlot,
  recoverSpellSlot as open20RecoverSpellSlot,
  longRest as open20LongRest,
  shortRest as open20ShortRest,
  type CreateCharacterParams
} from 'open20-core/browser';
import type { AppCharacter } from './types';
import { dataLoader } from './data-loader';

export class CharacterService {
  static createCharacter(params: CreateCharacterParams): AppCharacter {
    const char = open20CreateCharacter(params, dataLoader as any);
    return { ...char, id: crypto.randomUUID() };
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
}
