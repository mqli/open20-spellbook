import { useEffect } from 'react';
import { useSpellStore } from '../../stores/spell-store';
import { SpellService } from '../../core/spell-service';
import { SearchBar } from '../spell-library/SearchBar';
import { LevelTabs } from '../spell-library/LevelTabs';
import { FilterChips } from '../spell-library/FilterChips';
import { SpellCard } from '../spell-library/SpellCard';
import { SpellDetailFlyout } from '../spell-library/SpellDetailFlyout';

export function SpellLibraryLayout() {
  const { setSpells, filteredSpells } = useSpellStore();

  useEffect(() => {
    const spells = SpellService.searchSpells({});
    setSpells(spells);
  }, [setSpells]);

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-bg-primary border-b border-border px-4 py-3 md:px-6 md:py-4">
        <h1 className="text-xl font-medium text-text-primary mb-4">Spell Library</h1>
        <SearchBar />
        <LevelTabs />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 relative">
        <FilterChips />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {filteredSpells.map(spell => (
            <SpellCard key={spell.id} spell={spell} />
          ))}
          
          {filteredSpells.length === 0 && (
            <div className="col-span-full py-12 text-center text-text-secondary">
              No spells found matching your criteria.
            </div>
          )}
        </div>
      </main>

      <SpellDetailFlyout />
    </div>
  );
}
