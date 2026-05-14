import { Flame } from 'lucide-react';
import { SpellSlotPips } from './SpellSlotPips';

const SPELL_LEVEL_LABELS = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

interface SlotEntry {
  lvl: number;
  slot: { total: number; used: number };
}

interface SpellSlotsSectionProps {
  slotEntries: SlotEntry[];
  isMulticlass: boolean;
  onConsumeSlot: (level: number) => void;
  onRecoverSlot: (level: number) => void;
}

export function SpellSlotsSection({
  slotEntries, isMulticlass, onConsumeSlot, onRecoverSlot,
}: SpellSlotsSectionProps) {
  if (slotEntries.length === 0) return null;

  return (
    <section>
      <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
        <Flame className="w-3 h-3 text-primary-500" />
        Spell Slots
        {isMulticlass && (
          <span className="text-[8px] font-normal text-text-tertiary normal-case">(Combined)</span>
        )}
      </h3>
      <div className="space-y-3">
        {slotEntries.map(({ lvl, slot }) => {
          const available = slot.total - slot.used;
          return (
            <div key={lvl} className="flex items-center gap-3">
              <span className="text-[10px] font-black text-text-tertiary uppercase w-10 flex-shrink-0">
                {SPELL_LEVEL_LABELS[lvl]}
              </span>
              <SpellSlotPips
                level={lvl}
                total={slot.total}
                used={slot.used}
                onConsume={onConsumeSlot}
                onRecover={onRecoverSlot}
              />
              <span className="text-[10px] font-bold text-text-tertiary flex-shrink-0 w-8 text-right">
                {available}/{slot.total}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
