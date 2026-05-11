import { useCharacterStore } from '../../stores/character-store';

interface SlotState {
  total: number;
  used: number;
}

export function SpellSlotTracker() {
  const { activeCharacter, consumeSpellSlot, recoverSpellSlot } = useCharacterStore();

  if (!activeCharacter || !activeCharacter.spells?.spellSlots) return null;

  const slots = activeCharacter.spells.spellSlots;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 py-3 px-4 bg-bg-primary/50 border-b border-border">
      {Object.entries(slots).map(([level, slot]) => {
        const spellSlot = slot as SlotState;
        const lvl = parseInt(level);
        if (lvl === 0 || spellSlot.total === 0) return null;

        return (
          <div key={level} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Level {level}</span>
            <div className="flex gap-1">
              {Array.from({ length: spellSlot.total }).map((_, i) => (
                <button
                  key={i}
                  title={i < (spellSlot.total - spellSlot.used) ? `Consume Level ${level} slot` : `Recover Level ${level} slot`}
                  onClick={() => i < (spellSlot.total - spellSlot.used) ? consumeSpellSlot(lvl) : recoverSpellSlot(lvl)}
                  className={`
                    w-4 h-4 rounded-sm border transition-all
                    ${i < (spellSlot.total - spellSlot.used) 
                      ? 'bg-primary-500 border-primary-600 shadow-sm' 
                      : 'bg-bg-tertiary border-border opacity-30'}
                  `}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
