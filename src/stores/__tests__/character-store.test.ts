import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCharacterStore } from '../character-store';
import { StorageService } from '../../core/storage-service';

// Mock StorageService
vi.mock('../../core/storage-service', () => ({
  StorageService: {
    loadCharacters: vi.fn(() => []),
    saveCharacter: vi.fn(),
    deleteCharacter: vi.fn(),
    savePreferences: vi.fn(),
    loadPreferences: vi.fn(() => ({})),
  }
}));

describe('CharacterStore', () => {
  beforeEach(() => {
    // Reset store state before each test if possible
    // Zustand stores persist state in tests unless cleared
    useCharacterStore.setState({
      activeCharacter: null,
      characters: [],
      isLoading: false,
      error: null
    });
    vi.clearAllMocks();
  });

  it('should set active character', () => {
    const mockChar = { id: '1', name: 'Test' } as any;
    useCharacterStore.getState().setActiveCharacter(mockChar);
    expect(useCharacterStore.getState().activeCharacter).toEqual(mockChar);
  });

  it('should learn a spell and save to storage', () => {
    const mockChar = { 
      id: '1', 
      name: 'Test',
      spells: { knownSpells: [], preparedSpells: [] },
      conditions: [],
      updatedAt: ''
    } as any;
    
    useCharacterStore.getState().setActiveCharacter(mockChar);
    useCharacterStore.getState().learnSpell('magic-missile');
    
    const updatedChar = useCharacterStore.getState().activeCharacter;
    expect(updatedChar?.spells.knownSpells).toContain('magic-missile');
    expect(StorageService.saveCharacter).toHaveBeenCalled();
  });

  it('should prepare a spell', () => {
    const mockChar = { 
      id: '1', 
      name: 'Test',
      spells: { knownSpells: ['magic-missile'], preparedSpells: [] },
      classes: [{ classId: 'Wizard', level: 1 }],
      abilityScores: { base: { Intelligence: 16 } },
      conditions: [],
      updatedAt: ''
    } as any;
    
    useCharacterStore.getState().setActiveCharacter(mockChar);
    useCharacterStore.getState().prepareSpell('magic-missile');
    
    const updatedChar = useCharacterStore.getState().activeCharacter;
    expect(updatedChar?.spells.preparedSpells).toContain('magic-missile');
  });
});
