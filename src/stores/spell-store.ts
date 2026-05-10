import { create } from 'zustand';
import type { Spell } from 'open20-core/browser';

interface SpellLibraryState {
  spells: Spell[];
  filteredSpells: Spell[];
  searchQuery: string;
  selectedLevel: number | null;
  selectedClasses: string[];
  selectedSchools: string[];
  showRitualOnly: boolean;
  showConcentrationOnly: boolean;
  
  selectedSpell: Spell | null;
  isDetailOpen: boolean;

  setSpells: (spells: Spell[]) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLevel: (level: number | null) => void;
  toggleClassFilter: (className: string) => void;
  toggleSchoolFilter: (school: string) => void;
  setShowRitualOnly: (show: boolean) => void;
  setShowConcentrationOnly: (show: boolean) => void;
  selectSpell: (spell: Spell | null) => void;
  closeDetail: () => void;
  
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

  setSpells: (spells) => {
    set({ spells, filteredSpells: spells });
  },

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().applyFilters();
  },

  setSelectedLevel: (level) => {
    set({ selectedLevel: level });
    get().applyFilters();
  },

  toggleClassFilter: (className) => {
    const { selectedClasses } = get();
    if (selectedClasses.includes(className)) {
      set({ selectedClasses: selectedClasses.filter(c => c !== className) });
    } else {
      set({ selectedClasses: [...selectedClasses, className] });
    }
    get().applyFilters();
  },

  toggleSchoolFilter: (school) => {
    const { selectedSchools } = get();
    if (selectedSchools.includes(school)) {
      set({ selectedSchools: selectedSchools.filter(s => s !== school) });
    } else {
      set({ selectedSchools: [...selectedSchools, school] });
    }
    get().applyFilters();
  },

  setShowRitualOnly: (show) => {
    set({ showRitualOnly: show });
    get().applyFilters();
  },

  setShowConcentrationOnly: (show) => {
    set({ showConcentrationOnly: show });
    get().applyFilters();
  },

  applyFilters: () => {
    const { spells, searchQuery, selectedLevel, selectedClasses, selectedSchools, showRitualOnly, showConcentrationOnly } = get();
    
    let filtered = [...spells];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query)
      );
    }
    
    if (selectedLevel !== null) {
      filtered = filtered.filter(s => s.level === selectedLevel);
    }
    
    if (selectedClasses.length > 0) {
      filtered = filtered.filter(s =>
        s.classes?.some((c: string) => selectedClasses.includes(c))
      );
    }
    
    if (selectedSchools.length > 0) {
      filtered = filtered.filter(s => selectedSchools.includes(s.school));
    }

    if (showRitualOnly) {
      filtered = filtered.filter(s => s.ritual);
    }

    if (showConcentrationOnly) {
      filtered = filtered.filter(s => s.concentration);
    }
    
    set({ filteredSpells: filtered });
  },

  selectSpell: (spell) => {
    set({ selectedSpell: spell, isDetailOpen: !!spell });
  },

  closeDetail: () => {
    set({ selectedSpell: null, isDetailOpen: false });
  },
}));
