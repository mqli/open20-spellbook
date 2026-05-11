import { useCharacterStore } from '../../stores/character-store';

export function SpellSlotTracker() {
  const { activeCharacter, consumeSpellSlot, recoverSpellSlot } = useCharacterStore();

  if (!activeCharacter || !activeCharacter.spells?.spellSlots) return null;

  const slots = activeCharacter.spells.spellSlots;

  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 py-3 px-4 bg-bg-primary/50 border-b border-border">
      {Object.entries(slots).map(([level, slot]: [string, any]) => {
        const lvl = parseInt(level);
        if (lvl === 0 || slot.total === 0) return null;

        return (
          <div key={level} className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-text-tertiary uppercase tracking-widest">Level {level}</span>
            <div className="flex gap-1">
              {Array.from({ length: slot.total }).map((_, i) => (
                <button
                  key={i}
                  title={i < (slot.total - slot.used) ? `Consume Level ${level} slot` : `Recover Level ${level} slot`}
                  onClick={() => i < (slot.total - slot.used) ? consumeSpellSlot(lvl) : recoverSpellSlot(lvl)}
                  className={`
                    w-4 h-4 rounded-sm border transition-all
                    ${i < (slot.total - slot.used) 
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
