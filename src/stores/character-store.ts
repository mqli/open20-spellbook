/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import type { AppCharacter } from '../core/types';
import { CharacterService } from '../core/character-service';
import { StorageService } from '../core/storage-service';

interface CharacterState {
  activeCharacter: AppCharacter | null;
  characters: AppCharacter[];
  isLoading: boolean;
  error: string | null;

  setActiveCharacter: (character: AppCharacter) => void;
  createCharacter: (params: any) => void;
  updateCharacter: (character: AppCharacter) => void;
  deleteCharacter: (id: string) => void;
  
  prepareSpell: (spellId: string) => void;
  unprepareSpell: (spellId: string) => void;
  consumeSpellSlot: (level: number) => void;
  recoverSpellSlot: (level: number) => void;
  longRest: () => void;
  shortRest: () => void;
  
  loadCharacters: () => void;
  saveCharacters: () => void;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  activeCharacter: null,
  characters: [],
  isLoading: false,
  error: null,

  setActiveCharacter: (character) => set({ activeCharacter: character }),

  createCharacter: (params) => {
    try {
      const newChar = CharacterService.createCharacter(params);
      const { characters } = get();
      set({ 
        characters: [...characters, newChar],
        activeCharacter: newChar
      });
      get().saveCharacters();
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Failed to create character' });
    }
  },

  updateCharacter: (character) => {
    const { characters, activeCharacter } = get();
    const updatedChars = characters.map(c => c.id === character.id ? character : c);
    set({ 
      characters: updatedChars,
      activeCharacter: activeCharacter?.id === character.id ? character : activeCharacter
    });
    get().saveCharacters();
  },

  deleteCharacter: (id) => {
    const { characters, activeCharacter } = get();
    const updatedChars = characters.filter(c => c.id !== id);
    set({
      characters: updatedChars,
      activeCharacter: activeCharacter?.id === id ? null : activeCharacter
    });
    get().saveCharacters();
  },

  prepareSpell: (spellId) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.prepareSpell(activeCharacter, spellId);
    get().updateCharacter(updated);
  },

  unprepareSpell: (spellId) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.unprepareSpell(activeCharacter, spellId);
    get().updateCharacter(updated);
  },

  consumeSpellSlot: (level) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.consumeSpellSlot(activeCharacter, level);
    get().updateCharacter(updated);
  },

  recoverSpellSlot: (level) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.recoverSpellSlot(activeCharacter, level);
    get().updateCharacter(updated);
  },

  longRest: () => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.longRest(activeCharacter);
    get().updateCharacter(updated);
  },

  shortRest: () => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.shortRest(activeCharacter);
    get().updateCharacter(updated);
  },

  loadCharacters: () => {
    const chars = StorageService.loadCharacters();
    set({ characters: chars, activeCharacter: chars[0] || null });
  },

  saveCharacters: () => {
    const { characters } = get();
    characters.forEach(c => StorageService.saveCharacter(c));
  }
}));
