import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCharacterStore } from '../character-store';
import { storageService } from '../../core/storage-service';
import type { AppCharacter } from '../../core/types';

// Mock the storage-service module
vi.mock('../../core/storage-service', () => ({
  StorageService: vi.fn(),
  storageService: {
    loadCharacters: vi.fn(() => []),
    saveCharacter: vi.fn(),
    deleteCharacter: vi.fn(),
    savePreferences: vi.fn(),
    loadPreferences: vi.fn(() => ({})),
    clearAll: vi.fn(),
  }
}));

describe('CharacterStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useCharacterStore.setState({
      activeCharacter: null,
      characters: [],
      isLoading: false,
      error: null
    });
    vi.clearAllMocks();
  });

  it('should set active character', () => {
    const mockChar = { id: '1', name: 'Test' } as unknown as AppCharacter;
    useCharacterStore.getState().setActiveCharacter(mockChar);
    expect(useCharacterStore.getState().activeCharacter).toEqual(mockChar);
  });

  it('should delete a character from storage', () => {
    const mockChar = { id: '1', name: 'Test' } as unknown as AppCharacter;
    useCharacterStore.setState({
      activeCharacter: mockChar,
      characters: [mockChar],
    });

    useCharacterStore.getState().deleteCharacter('1');

    expect(useCharacterStore.getState().characters).toEqual([]);
    expect(useCharacterStore.getState().activeCharacter).toBeNull();
    expect(storageService.deleteCharacter).toHaveBeenCalledWith('1');
  });

  it('should learn a spell and save to storage', () => {
    const mockChar = { 
      id: '1', 
      name: 'Test',
      spells: { knownSpells: [], preparedSpells: [] },
      classes: [{ classId: 'Wizard', level: 1 }],
      abilityScores: { 
        base: { Intelligence: 16, Constitution: 10, Wisdom: 10, Charisma: 10, Strength: 10, Dexterity: 10 },
        racialBonuses: {},
        featBonuses: {},
        temporaryBonuses: {}
      },
      conditions: [],
      updatedAt: ''
    } as unknown as AppCharacter;
    
    useCharacterStore.getState().setActiveCharacter(mockChar);
    useCharacterStore.getState().learnSpell('magic-missile');
    
    const updatedChar = useCharacterStore.getState().activeCharacter;
    expect(updatedChar?.spells.knownSpells).toContain('magic-missile');
    expect(storageService.saveCharacter).toHaveBeenCalled();
  });

  it('should prepare a spell', () => {
    const mockChar = { 
      id: '1', 
      name: 'Test',
      spells: { knownSpells: ['magic-missile'], preparedSpells: [] },
      classes: [{ classId: 'Wizard', level: 1 }],
      abilityScores: { 
        base: { Intelligence: 16, Constitution: 10, Wisdom: 10, Charisma: 10, Strength: 10, Dexterity: 10 },
        racialBonuses: {},
        featBonuses: {},
        temporaryBonuses: {}
      },
      conditions: [],
      updatedAt: ''
    } as unknown as AppCharacter;
    
    useCharacterStore.getState().setActiveCharacter(mockChar);
    useCharacterStore.getState().prepareSpell('magic-missile');
    
    const updatedChar = useCharacterStore.getState().activeCharacter;
    expect(updatedChar?.spells.preparedSpells).toContain('magic-missile');
  });
});
