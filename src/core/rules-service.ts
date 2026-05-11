import type { AppCharacter } from './types';
import { getModifier, getProficiencyBonus, getTotalScore } from 'open20-core/browser';

export interface ProjectedStats {
  abilityModifiers: Record<string, number>;
  spellSaveDC: number;
  spellAttackBonus: number;
  maxPreparedSpells: number;
  proficiencyBonus: number;
}

export class RulesService {
  static getProjectedStats(character: AppCharacter): ProjectedStats {
    const totalLevel = character.classes.reduce((sum, c) => sum + c.level, 0);
    const pb = getProficiencyBonus(totalLevel);
    
    const abilityModifiers: Record<string, number> = {};
    Object.entries(character.abilityScores.base).forEach(([ability]) => {
      abilityModifiers[ability] = getModifier(getTotalScore(character.abilityScores, ability as any));
    });

    const spellcastingAbility = character.spells.spellcastingAbility;
    const spellMod = abilityModifiers[spellcastingAbility] ?? 0;

    return {
      abilityModifiers,
      spellSaveDC: 8 + pb + spellMod,
      spellAttackBonus: pb + spellMod,
      maxPreparedSpells: Math.max(1, (character.classes?.[0]?.level ?? 1) + spellMod),
      proficiencyBonus: pb,
    };
  }
}
