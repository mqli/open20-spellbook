import * as RadixDialog from '@radix-ui/react-dialog';
import { X, Pencil } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useCharacterStore } from '../../stores/character-store';
import { ConcentrationBanner } from './CharacterSheet/ConcentrationBanner';
import { SpellSlotsSection } from './CharacterSheet/SpellSlotsSection';
import { ClassSpellSection } from './CharacterSheet/ClassSpellSection';

interface ConcentrationCondition {
  id: string;
  source?: string;
}

export function CharacterSheet({ open, onOpenChange, onEdit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const { activeCharacter, consumeSpellSlot, recoverSpellSlot } = useCharacterStore();

  if (!activeCharacter) return null;

  const { spells, classes, conditions } = activeCharacter;
  const classSpellcasting = spells.classSpellcasting ?? {};

  const slotEntries = Object.entries(spells.spellSlots ?? {})
    .map(([lvl, slot]) => ({ lvl: parseInt(lvl, 10), slot: slot as { total: number; used: number } }))
    .filter(({ lvl, slot }) => lvl > 0 && slot.total > 0);

  const isMulticlass = (classes?.length ?? 0) > 1;

  const concentratingSpellId = (conditions?.find(c => c.id === 'Concentrating') as ConcentrationCondition | undefined)?.source;

  const spellcastingClasses = classes?.filter(c => classSpellcasting[c.classId]) ?? [];

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" />
        <RadixDialog.Content className="fixed top-0 right-0 h-full w-full max-w-sm bg-bg-secondary shadow-2xl z-50 border-l border-border animate-in slide-in-from-right duration-300 flex flex-col">

          {/* Header */}
          <header className="p-6 border-b border-border flex justify-between items-start bg-bg-primary/60 backdrop-blur-md flex-shrink-0">
            <div>
              <h2 className="text-xl font-black text-text-primary uppercase tracking-tight leading-tight">
                {activeCharacter.name}
              </h2>
              <div className="flex gap-2 mt-2 flex-wrap">
                {classes?.map((c, i) => (
                  <Badge key={i} variant={i === 0 ? "purple" : "slate"} size="sm">
                    {c.classId} {c.level}
                  </Badge>
                ))}
                <Badge variant="slate" size="sm">{activeCharacter.species}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="p-2 text-text-tertiary hover:text-primary-600"
                title="Edit character"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <RadixDialog.Close asChild>
                <Button variant="ghost" size="sm" className="p-2 text-text-tertiary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </Button>
              </RadixDialog.Close>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

            {/* Concentration */}
            {concentratingSpellId && (
              <ConcentrationBanner concentratingSpellId={concentratingSpellId} />
            )}

            {/* Combined Spell Slots */}
            <SpellSlotsSection
              slotEntries={slotEntries}
              isMulticlass={isMulticlass}
              onConsumeSlot={consumeSpellSlot}
              onRecoverSlot={recoverSpellSlot}
            />

            {/* Per-Class Spellcasting Sections */}
            {spellcastingClasses.length > 0 && (
              <section>
                <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  Class Spellcasting
                </h3>
                <div className="space-y-3">
                  {spellcastingClasses.map(c => (
                    <ClassSpellSection
                      key={c.classId}
                      classId={c.classId}
                      classLevel={c.level}
                      subclassId={c.subclassId}
                      onOpenChange={onOpenChange}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border flex-shrink-0">
            <Button
              variant="ghost"
              onClick={onEdit}
              className="w-full bg-bg-tertiary hover:bg-primary-50 text-text-secondary hover:text-primary-600 rounded-2xl py-3"
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Character Stats
            </Button>
          </div>

        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
