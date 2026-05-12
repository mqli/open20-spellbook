import { useEffect } from 'react';
import { useSpellStore } from '../../stores/spell-store';
import { spellService } from '../../core/spell-service';
import { SearchBar } from '../spell-library/SearchBar';
import { LevelTabs } from '../spell-library/LevelTabs';
import { FilterChips } from '../spell-library/FilterChips';
import { SpellCard } from '../spell-library/SpellCard';
import { SpellDetailFlyout } from '../spell-library/SpellDetailFlyout';

import { useCharacterStore } from '../../stores/character-store';
import { CharacterBar } from '../character/CharacterBar';

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
    const spells = spellService.searchSpells({});
    setSpells(spells);
  }, [setSpells]);

  // Cross-store filtering: apply known/prepared filters here where we have both stores
  let spellsToDisplay = filteredSpells;
  if ((showPreparedOnly || showKnownOnly) && !activeCharacter) {
    spellsToDisplay = [];
  } else if (showPreparedOnly && activeCharacter) {
    spellsToDisplay = filteredSpells.filter(s =>
      spellService.isSpellPrepared(activeCharacter, s.id)
    );
  } else if (showKnownOnly && activeCharacter) {
    spellsToDisplay = filteredSpells.filter(s =>
      spellService.isSpellKnown(activeCharacter, s.id) &&
      spellService.isSpellForCharacter(activeCharacter, s)
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

      {/* Compact Header */}
      <header className="flex-shrink-0 bg-bg-primary border-b border-border px-3 md:px-4 py-2">
        {/* Row 1: title + search + filter toggles */}
        <div className="flex items-center gap-2 mb-1.5">
          <h1 className="text-base font-bold text-text-primary whitespace-nowrap">Spells</h1>
          <div className="flex-1 min-w-0">
            <SearchBar />
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setShowKnownOnly(!showKnownOnly)}
              className={`
                text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all
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
                text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border transition-all
                ${showPreparedOnly
                  ? 'bg-primary-500 text-white border-primary-600 shadow-sm'
                  : 'bg-transparent text-text-tertiary border-border hover:bg-bg-tertiary'}
              `}
            >
              Prep
            </button>
          </div>
        </div>

        {/* Row 2: level chips */}
        <LevelTabs />
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto px-3 md:px-4 relative">
        <FilterChips />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pb-8">
          {spellsToDisplay.map(spell => (
            <SpellCard key={spell.id} spell={spell} />
          ))}

          {spellsToDisplay.length === 0 && (
            <div className="col-span-full py-12 text-center space-y-1">
              <p className="text-text-secondary text-sm">{emptyMessage}</p>
            </div>
          )}
        </div>
      </main>

      <SpellDetailFlyout />
    </div>
  );
}
