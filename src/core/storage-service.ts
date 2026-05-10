import type { AppCharacter } from './types';

const STORAGE_KEY = 'open20-spellbook-characters';
const PREFERENCES_KEY = 'open20-spellbook-preferences';

export class StorageService {
  static saveCharacter(character: AppCharacter): void {
    const characters = this.loadCharacters();
    const index = characters.findIndex(c => c.id === character.id);
    
    if (index >= 0) {
      characters[index] = character;
    } else {
      characters.push(character);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }

  static loadCharacters(): AppCharacter[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    try {
      return JSON.parse(data) as AppCharacter[];
    } catch {
      return [];
    }
  }

  static deleteCharacter(id: string): void {
    const characters = this.loadCharacters();
    const filtered = characters.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }

  static savePreferences(preferences: Record<string, unknown>): void {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  }

  static loadPreferences(): Record<string, unknown> {
    const data = localStorage.getItem(PREFERENCES_KEY);
    if (!data) return {};
    
    try {
      return JSON.parse(data) as Record<string, unknown>;
    } catch {
      return {};
    }
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PREFERENCES_KEY);
  }
}
