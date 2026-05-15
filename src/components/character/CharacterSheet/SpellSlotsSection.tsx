import { Flame } from 'lucide-react';
import { SlotPips } from '../../ui/SlotPips';
import { SectionHeader } from '../../ui/SectionHeader';

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
      <SectionHeader
        icon={<Flame className="w-3 h-3" />}
        title="Spell Slots"
        action={isMulticlass ? <span className="text-[8px]">(Combined)</span> : undefined}
      />
      <div className="space-y-3">
        {slotEntries.map(({ lvl, slot }) => (
          <div key={lvl} className="flex items-center gap-3">
            <span className="text-[10px] font-black text-text-tertiary uppercase w-10 flex-shrink-0">
              {SPELL_LEVEL_LABELS[lvl]}
            </span>
            <SlotPips
              total={slot.total}
              used={slot.used}
              onPipClick={(_index, isUsed) => isUsed ? onRecoverSlot(lvl) : onConsumeSlot(lvl)}
            />
            <span className="text-[10px] font-bold text-text-tertiary flex-shrink-0 w-8 text-right">
              {slot.total - slot.used}/{slot.total}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
