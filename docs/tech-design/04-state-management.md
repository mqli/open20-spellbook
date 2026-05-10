## 5. State Management

### 5.1 Store Definitions

```typescript
// src/stores/character-store.ts
import { create } from 'zustand';
import type { Character } from 'open20-core';

interface CharacterState {
  // State
  activeCharacter: Character | null;
  characters: Character[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setActiveCharacter: (character: Character) => void;
  createCharacter: (params: CreateCharacterParams) => void;
  updateCharacter: (character: Character) => void;
  deleteCharacter: (id: string) => void;
  
  // Spell management
  prepareSpell: (spellId: string) => void;
  unprepareSpell: (spellId: string) => void;
  consumeSpellSlot: (level: number) => void;
  recoverSpellSlot: (level: number) => void;
  longRest: () => void;
  shortRest: () => void;
  
  // Persistence
  loadCharacters: () => Promise<void>;
  saveCharacters: () => Promise<void>;
}

export const useCharacterStore = create<CharacterState>((set, get) => ({
  activeCharacter: null,
  characters: [],
  isLoading: false,
  error: null,

  setActiveCharacter: (character) => set({ activeCharacter: character }),

  prepareSpell: (spellId) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.prepareSpell(activeCharacter, spellId);
    set({ activeCharacter: updated });
    get().saveCharacters();
  },

  consumeSpellSlot: (level) => {
    const { activeCharacter } = get();
    if (!activeCharacter) return;
    
    const updated = CharacterService.consumeSpellSlot(activeCharacter, level);
    set({ activeCharacter: updated });
    get().saveCharacters();
  },

  // ... other actions
}));

// src/stores/spell-store.ts
import { create } from 'zustand';
import type { Spell } from 'open20-core';

interface SpellLibraryState {
  // State
  spells: Spell[];
  filteredSpells: Spell[];
  searchQuery: string;
  selectedLevel: number | null;  // null = all levels
  selectedClasses: string[];
  selectedSchools: string[];
  showRitualOnly: boolean;
  showConcentrationOnly: boolean;
  
  // UI State
  selectedSpell: Spell | null;
  isDetailOpen: boolean;

  // Actions
  setSearchQuery: (query: string) => void;
  setSelectedLevel: (level: number | null) => void;
  toggleClassFilter: (className: string) => void;
  toggleSchoolFilter: (school: string) => void;
  setShowRitualOnly: (show: boolean) => void;
  setShowConcentrationOnly: (show: boolean) => void;
  selectSpell: (spell: Spell | null) => void;
  closeDetail: () => void;
  
  // Derived
  applyFilters: () => void;
}

export const useSpellStore = create<SpellLibraryState>((set, get) => ({
  spells: [],
  filteredSpells: [],
  searchQuery: '',
  selectedLevel: null,
  selectedClasses: [],
  selectedSchools: [],
  showRitualOnly: false,
  showConcentrationOnly: false,
  selectedSpell: null,
  isDetailOpen: false,

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  applyFilters: () => {
    const { spells, searchQuery, selectedLevel, selectedClasses, selectedSchools } = get();
    
    let filtered = [...spells];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query)
      );
    }
    
    // Apply level filter
    if (selectedLevel !== null) {
      filtered = filtered.filter(s => s.level === selectedLevel);
    }
    
    // Apply class filter
    if (selectedClasses.length > 0) {
      filtered = filtered.filter(s =>
        s.classes.some(c => selectedClasses.includes(c))
      );
    }
    
    // Apply school filter
    if (selectedSchools.length > 0) {
      filtered = filtered.filter(s => selectedSchools.includes(s.school));
    }
    
    set({ filteredSpells: filtered });
  },

  selectSpell: (spell) => {
    set({ selectedSpell: spell, isDetailOpen: !!spell });
  },

  closeDetail: () => {
    set({ selectedSpell: null, isDetailOpen: false });
  },

  // ... other actions
}));

// src/stores/ui-store.ts
import { create } from 'zustand';

type Theme = 'light' | 'dark';

interface UIState {
  theme: Theme;
  isSidebarOpen: boolean;
  isMobile: boolean;
  
  setTheme: (theme: Theme) => void;
  toggleSidebar: () => void;
  setMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'dark',
  isSidebarOpen: true,
  isMobile: false,

  setTheme: (theme) => {
    set({ theme });
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMobile: (isMobile) => set({ isMobile }),
}));
```
