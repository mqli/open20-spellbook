import { useEffect } from 'react';
import { useSpellStore } from '../../stores/spell-store';
import { SpellService } from '../../core/spell-service';
import { SearchBar } from '../spell-library/SearchBar';
import { LevelTabs } from '../spell-library/LevelTabs';
import { FilterChips } from '../spell-library/FilterChips';
import { SpellCard } from '../spell-library/SpellCard';
import { SpellDetailFlyout } from '../spell-library/SpellDetailFlyout';

import { useCharacterStore } from '../../stores/character-store';
import { CharacterBar } from '../character/CharacterBar';
import { SpellSlotTracker } from '../character/SpellSlotTracker';

export function SpellLibraryLayout() {
  const {
    setSpells, filteredSpells,
    showPreparedOnly, setShowPreparedOnly,
    showKnownOnly, setShowKnownOnly,
  } = useSpellStore();
  const { activeCharacter, loadCharacters } = useCharacterStore();

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  useEffect(() => {
    const spells = SpellService.searchSpells({});
    setSpells(spells);
  }, [setSpells]);

  // Cross-store filtering: apply known/prepared filters here where we have both stores
  let spellsToDisplay = filteredSpells;
  if ((showPreparedOnly || showKnownOnly) && !activeCharacter) {
    spellsToDisplay = [];
  } else if (showPreparedOnly && activeCharacter) {
    spellsToDisplay = filteredSpells.filter(s =>
      SpellService.isSpellPrepared(activeCharacter, s.id)
    );
  } else if (showKnownOnly && activeCharacter) {
    spellsToDisplay = filteredSpells.filter(s =>
      SpellService.isSpellKnown(activeCharacter, s.id) &&
      SpellService.isSpellForCharacter(activeCharacter, s)
    );
  }

  const activeFilter = showPreparedOnly ? 'prepared' : showKnownOnly ? 'known' : null;

  const emptyMessage = activeFilter === 'prepared'
    ? 'No prepared spells. Open a spell and click "Prepare".'
    : activeFilter === 'known'
    ? 'No known spells yet. Open a spell and click "Learn".'
    : 'No spells found matching your criteria.';

  return (
    <div className="flex flex-col h-screen bg-bg-primary overflow-hidden">
      <CharacterBar />
      <SpellSlotTracker />

      {/* Sticky Header */}
      <header className="flex-shrink-0 bg-bg-primary border-b border-border px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-medium text-text-primary">Spell Library</h1>

          {/* Filter toggle pills — mutually exclusive */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowKnownOnly(!showKnownOnly)}
              className={`
                text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all
                ${showKnownOnly
                  ? 'bg-info text-white border-info shadow-sm'
                  : 'bg-transparent text-text-tertiary border-border hover:bg-bg-tertiary'}
              `}
            >
              Known
            </button>
            <button
              onClick={() => setShowPreparedOnly(!showPreparedOnly)}
              className={`
                text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border transition-all
                ${showPreparedOnly
                  ? 'bg-primary-500 text-white border-primary-600 shadow-sm'
                  : 'bg-transparent text-text-tertiary border-border hover:bg-bg-tertiary'}
              `}
            >
              Prepared
            </button>
          </div>
        </div>
        <SearchBar />
        <LevelTabs />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-4 md:px-6 relative">
        <FilterChips />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-12">
          {spellsToDisplay.map(spell => (
            <SpellCard key={spell.id} spell={spell} />
          ))}

          {spellsToDisplay.length === 0 && (
            <div className="col-span-full py-16 text-center space-y-2">
              <p className="text-text-secondary">{emptyMessage}</p>
            </div>
          )}
        </div>
      </main>

      <SpellDetailFlyout />
    </div>
  );
}
