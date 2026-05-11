import { CharacterService } from '../character-service';

async function runTests() {
  console.log('Running manual integration tests...');

  const mockParams = {
    name: 'Test Wizard',
    speciesId: 'Human',
    backgroundId: 'sage',
    classId: 'Wizard',
    classLevel: 1,
    abilityScores: {
      Strength: 10,
      Dexterity: 12,
      Constitution: 14,
      Intelligence: 16,
      Wisdom: 13,
      Charisma: 8
    }
  };

  try {
    const character = CharacterService.createCharacter(mockParams);
    console.log('✅ Character creation success');
    
    if (character.spells.spellSaveDC === 13) {
      console.log('✅ Spell DC calculation (13) success');
    } else {
      console.log('❌ Spell DC calculation failed. Expected 13, got:', character.spells.spellSaveDC);
    }

    if (character.spells.spellAttackBonus === 5) {
      console.log('✅ Spell Attack calculation (5) success');
    } else {
      console.log('❌ Spell Attack calculation failed. Expected 5, got:', character.spells.spellAttackBonus);
    }

    const spellId = 'fireball';
    const preparedChar = CharacterService.prepareSpell(character, spellId);
    if (preparedChar.spells.preparedSpells.includes(spellId)) {
      console.log('✅ Spell preparation success');
    }

    const consumedChar = CharacterService.consumeSpellSlot(character, 1);
    if (consumedChar.spells.spellSlots[1].used === 1) {
      console.log('✅ Slot consumption success');
    }

    const restedChar = CharacterService.longRest(consumedChar);
    if (restedChar.spells.spellSlots[1].used === 0) {
      console.log('✅ Long rest success');
    }

    const spellId2 = 'haste';
    const concentratingChar = CharacterService.startConcentration(character, spellId2);
    const concentrationCondition = concentratingChar.conditions.find(c => c.id === 'Concentrating');
    if (concentrationCondition && (concentrationCondition as any).source === spellId2) {
      console.log('✅ Concentration start success');
    } else {
      console.log('❌ Concentration failed. Conditions:', JSON.stringify(concentratingChar.conditions));
    }

  } catch (err) {
    console.error('❌ Tests failed with error:', err);
  }
}

runTests();
