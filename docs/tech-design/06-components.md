## 7. Component Specifications

### 7.1 SpellLibrary Component

```typescript
// src/components/spell-library/SpellLibrary.tsx
import { useEffect } from 'react';
import { useSpellStore } from '../../stores';
import { SpellCard } from './SpellCard';
import { SpellDetail } from './SpellDetail';
import { SearchBar } from './SearchBar';
import { FilterChips } from './FilterChips';
import { LevelTabs } from './LevelTabs';

export function SpellLibrary() {
  const {
    spells,
    filteredSpells,
    isDetailOpen,
    selectedSpell,
    loadSpells,
    applyFilters,
  } = useSpellStore();

  useEffect(() => {
    loadSpells();
  }, []);

  return (
    <div className="spell-library">
      <SearchBar />
      <LevelTabs />
      <FilterChips />
      
      <div className="spell-list">
        {filteredSpells.map(spell => (
          <SpellCard key={spell.id} spell={spell} />
        ))}
      </div>

      {isDetailOpen && selectedSpell && (
        <SpellDetail spell={selectedSpell} />
      )}
    </div>
  );
}
```

### 7.2 SpellCard Component

```typescript
// src/components/spell-library/SpellCard.tsx
import type { Spell } from 'open20-core';
import { useSpellStore, useCharacterStore } from '../../stores';
import { getLevelColor, getSchoolColor } from '../../utils/constants';

interface SpellCardProps {
  spell: Spell;
}

export function SpellCard({ spell }: SpellCardProps) {
  const { selectSpell, isSpellPrepared } = useSpellStore();
  const { activeCharacter } = useCharacterStore();

  const isPrepared = activeCharacter 
    ? isSpellPrepared(activeCharacter, spell.id)
    : false;

  const schoolColor = getSchoolColor(spell.school);
  const levelColor = getLevelColor(spell.level);

  return (
    <div 
      className="spell-card cursor-pointer hover:shadow-md transition-all"
      onClick={() => selectSpell(spell)}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="spell-name text-lg font-medium">{spell.name}</h3>
        <span 
          className="badge text-xs px-2 py-1 rounded-full"
          style={{ backgroundColor: `${levelColor}20`, color: levelColor }}
        >
          {spell.level === 0 ? 'Cantrip' : `L${spell.level}`}
        </span>
      </div>

      <div className="spell-card-meta flex gap-2 text-sm">
        <span className="spell-school" style={{ color: schoolColor }}>
          {spell.school}
        </span>
        <span className="spell-components">
          {spell.components.V && 'V'}
          {spell.components.S && 'S'}
          {spell.components.M && 'M'}
        </span>
      </div>

      <div className="spell-card-info flex gap-4 text-sm text-gray-600 mt-1">
        <span>Casting: {spell.castingTime}</span>
        <span>Range: {spell.range}</span>
      </div>

      {isPrepared && (
        <div className="prepared-indicator text-green-600 text-sm mt-1">
          ✓ Prepared
        </div>
      )}

      {spell.concentration && (
        <div className="concentration-indicator text-amber-600 text-sm mt-1">
          ● Concentration
        </div>
      )}
    </div>
  );
}
```

### 7.3 CharacterSheet Component

```typescript
// src/components/character-sheet/CharacterSheet.tsx
import { useCharacterStore } from '../../stores';
import { SpellSlots } from './SpellSlots';
import { ConcentrationIndicator } from './ConcentrationIndicator';
import { PreparedSpells } from './PreparedSpells';
import { DiceRoller } from './DiceRoller';

export function CharacterSheet() {
  const { activeCharacter, longRest, spellSaveDC, spellAttackBonus } = useCharacterStore();

  if (!activeCharacter) {
    return <div>No character selected. Create one!</div>;
  }

  return (
    <div className="character-sheet">
      <header className="character-header">
        <h1>{activeCharacter.name}</h1>
        <span className="character-class">
          Level {activeCharacter.level} {activeCharacter.classes[0].name}
        </span>
        <div className="character-stats">
          <span>INT +{activeCharacter.abilityScores.int}</span>
          <span>Prof +{activeCharacter.proficiencyBonus}</span>
        </div>
      </header>

      <div className="character-stats-bar">
        <div className="stat">
          <label>Spell Save DC</label>
          <value>{spellSaveDC}</value>
        </div>
        <div className="stat">
          <label>Attack Bonus</label>
          <value>{spellAttackBonus}</value>
        </div>
      </div>

      <ConcentrationIndicator />
      <SpellSlots />
      <PreparedSpells />

      <button onClick={() => longRest()}>
        Long Rest — Recover All Slots
      </button>
    </div>
  );
}
```

### 7.4 SpellSlots Component

```typescript
// src/components/character-sheet/SpellSlots.tsx
import { useCharacterStore } from '../../stores';
import type { SpellSlotMap } from 'open20-core';

export function SpellSlots() {
  const { activeCharacter, consumeSpellSlot, recoverSpellSlot } = useCharacterStore();
  
  if (!activeCharacter) return null;

  const slots = activeCharacter.spellSlots;

  return (
    <section className="spell-slots">
      <h2>Spell Slots</h2>

      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(level => {
        const slotInfo = slots[level];
        if (!slotInfo || slotInfo.total === 0) return null;

        return (
          <div key={level} className="slot-row">
            <label>
              {level === 0 ? 'Cantrips' : `Level ${level}`}
            </label>
            <div className="slot-circles">
              {Array.from({ length: slotInfo.total }, (_, i) => (
                <button
                  key={i}
                  className={`slot-circle ${i < slotInfo.used ? 'expended' : 'available'`}
                  onClick={() => {
                    if (i < slotInfo.used) {
                      recoverSpellSlot(level);
                    } else {
                      consumeSpellSlot(level);
                    }
                  }}
                />
              ))}
            </div>
            <span className="slot-count">
              {slotInfo.total - slotInfo.used}/{slotInfo.total}
            </span>
          </div>
        );
      })}
    </section>
  );
}
```
