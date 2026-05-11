import { describe, it, expect, vi } from 'vitest';
import { SpellService } from '../spell-service';
import { SchemaService } from '../schema-service';
import type { AppCharacter } from '../types';

// Mock the dataLoader to have controlled test data
vi.mock('../data-loader', () => ({
  dataLoader: {
    getAllSpells: () => SchemaService.transformSpells([
      {
        id: 'fireball',
        name: 'Fireball',
        level: 3,
        description: 'A bright streak flashes from your pointing finger...',
        classes: ['Wizard', 'Sorcerer'],
        components: { V: true, S: true, M: true }
      },
      {
        id: 'cure-wounds',
        name: 'Cure Wounds',
        level: 1,
        description: 'A creature you touch regains a number of hit points...',
        components: ['V', 'S']
      },
      {
        id: 'mystic-surge',
        name: 'Mystic Surge',
        level: 2,
        description: 'This is a Bard and Druid spell.',
        classes: [], 
        components: { V: true }
      }
    ])
  }
}));

describe('SpellService', () => {
  it('should get a spell by id', () => {
    const spell = SpellService.getSpell('fireball');
    expect(spell).toBeDefined();
    expect(spell?.name).toBe('Fireball');
  });

  it('should sanitize components correctly', () => {
    const fireball = SpellService.getSpell('fireball');
    expect(fireball?.components).toEqual(['V', 'S', 'M']);

    const cureWounds = SpellService.getSpell('cure-wounds');
    expect(cureWounds?.components).toEqual(['V', 'S']);
  });

  it('should infer classes from description if missing', () => {
    const mysticSurge = SpellService.getSpell('mystic-surge');
    expect(mysticSurge?.classes).toContain('Bard');
    expect(mysticSurge?.classes).toContain('Druid');
    expect(mysticSurge?.classes).not.toContain('Wizard');
  });

  it('should infer classes from SRD header parentheticals', () => {
    const spells = SchemaService.transformSpells([
      {
        id: 'header-spell',
        name: 'Header Spell',
        level: 3,
        description: 'Level 3 Evocation (Sorcerer, Wizard) Casting Time: Action',
        components: { V: true }
      }
    ]);

    expect(spells[0].classes).toEqual(['Sorcerer', 'Wizard']);
  });

  it('should keep classless upstream spells actionable', () => {
    const spells = SchemaService.transformSpells([
      {
        id: 'classless-cantrip',
        name: 'Classless Cantrip',
        level: 0,
        description: 'You create a harmless magical effect.',
        components: { V: true }
      }
    ]);

    expect(spells[0].classes?.length).toBeGreaterThan(0);
    expect(spells[0].classes).toContain('Wizard');
  });

  it('should search spells by name query', () => {
    const results = SpellService.searchSpells({ query: 'fire' });
    expect(results).toHaveLength(1);
    expect(results[0].id).toBe('fireball');
  });

  it('should check if a spell is prepared', () => {
    const mockCharacter = {
      spells: {
        preparedSpells: ['fireball']
      }
    } as unknown as AppCharacter;
    
    expect(SpellService.isSpellPrepared(mockCharacter, 'fireball')).toBe(true);
    expect(SpellService.isSpellPrepared(mockCharacter, 'cure-wounds')).toBe(false);
  });
});
