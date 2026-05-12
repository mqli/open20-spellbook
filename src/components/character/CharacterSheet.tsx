import { useCharacterStore } from '../../stores/character-store';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X, Sparkles, BookOpen, Flame, Wind, Pencil } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { spellService } from '../../core/spell-service';
import { RulesService } from '../../core/rules-service';
import { useSpellStore } from '../../stores/spell-store';
import { getCasterType } from '../../core/character-service';
import { Star, Shield } from 'lucide-react';

const SPELL_LEVEL_LABELS = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

interface ConcentrationCondition {
  id: string;
  source?: string;
}

export function CharacterSheet({ open, onOpenChange, onEdit }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}) {
  const { activeCharacter, consumeSpellSlot, recoverSpellSlot, prepareSpell, unprepareSpell } = useCharacterStore();
  const { selectSpell } = useSpellStore();

  if (!activeCharacter) return null;

  const spells = activeCharacter.spells;
  const stats = RulesService.getProjectedStats(activeCharacter);
  const maxPrepared = stats.maxPreparedSpells;
  const ability = spells.spellcastingAbility;
  const abilityMod = stats.abilityModifiers[ability] ?? 0;

  const concentratingCondition = activeCharacter.conditions?.find(c => c.id === 'Concentrating');
  const concentratingSpellId = (concentratingCondition as ConcentrationCondition | undefined)?.source;

  const slotEntries = Object.entries(spells.spellSlots ?? {})
    .map(([lvl, slot]) => ({ lvl: parseInt(lvl), slot: slot as { total: number; used: number } }))
    .filter(({ lvl, slot }) => lvl > 0 && slot.total > 0);

  const casterType = getCasterType(activeCharacter);

  const knownSpellsList = spells.knownSpells ?? [];
  const alwaysPreparedList = spells.alwaysPreparedSpells ?? [];
  const combinedKnownIds = Array.from(new Set([...knownSpellsList, ...alwaysPreparedList]));

  // For Prepared casters (Cleric, Druid, Paladin), show ALL class spells (they can prepare any from their list)
  // For Known/Spellbook casters, only show known spells
  const inventorySpellIds = casterType.canPrepare && !casterType.isSpellbookCaster
    ? (() => {
        const classIds = activeCharacter.classes?.map(c => c.classId) ?? [];
        return spellService.getAllSpells()
          .filter(s => s.classes?.some(c => classIds.includes(c)))
          .map(s => s.id);
      })()
    : combinedKnownIds;

  // Get and group spells for the inventory
  const inventorySpells = inventorySpellIds
    .map(id => spellService.getSpell(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const spellsByLevel = inventorySpells.reduce((acc, spell) => {
    const level = spell.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(spell);
    return acc;
  }, {} as Record<number, typeof inventorySpells>);

  const handleTogglePrepare = (spellId: string, isPrepared: boolean) => {
    if (isPrepared) unprepareSpell(spellId);
    else prepareSpell(spellId);
  };

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
                <Badge variant="purple" size="sm">
                  {activeCharacter.classes?.[0]?.classId} {activeCharacter.classes?.[0]?.level}
                </Badge>
                <Badge variant="slate" size="sm">{activeCharacter.species}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 hover:bg-bg-tertiary rounded-full transition-colors text-text-tertiary hover:text-primary-600"
                title="Edit character"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <RadixDialog.Close asChild>
                <button className="p-2 hover:bg-bg-tertiary rounded-full transition-colors text-text-tertiary hover:text-text-primary">
                  <X className="w-5 h-5" />
                </button>
              </RadixDialog.Close>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">

            {/* Casting Stats */}
            <section>
              <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-primary-500" />
                Spellcasting
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-bg-primary p-4 rounded-2xl border border-border text-center">
                  <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1">Ability</div>
                  <div className="text-base font-black text-primary-600">{ability.substring(0, 3)}</div>
                  <div className="text-[10px] font-bold text-text-tertiary mt-0.5">
                    {abilityMod >= 0 ? '+' : ''}{abilityMod}
                  </div>
                </div>
                <div className="bg-bg-primary p-4 rounded-2xl border border-border text-center">
                  <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1">Save DC</div>
                  <div className="text-base font-black text-primary-600">{stats.spellSaveDC}</div>
                </div>
                <div className="bg-bg-primary p-4 rounded-2xl border border-border text-center">
                  <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-1">Attack</div>
                  <div className="text-base font-black text-primary-600">+{stats.spellAttackBonus}</div>
                </div>
              </div>
            </section>

            {/* Concentration */}
            {concentratingSpellId && (
              <section className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 flex items-center gap-3">
                <div className="p-2 bg-amber-500/15 rounded-xl text-amber-500 flex-shrink-0">
                  <Wind className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[9px] font-black text-amber-600 uppercase tracking-widest">Concentrating</div>
                  <div className="text-sm font-bold text-text-primary truncate capitalize">
                    {concentratingSpellId.replace(/-/g, ' ')}
                  </div>
                </div>
              </section>
            )}

            {/* Spell Slots */}
            {slotEntries.length > 0 && (
              <section>
                <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Flame className="w-3 h-3 text-primary-500" />
                  Spell Slots
                </h3>
                <div className="space-y-3">
                  {slotEntries.map(({ lvl, slot }) => {
                    const available = slot.total - slot.used;
                    return (
                      <div key={lvl} className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-text-tertiary uppercase w-10 flex-shrink-0">
                          {SPELL_LEVEL_LABELS[lvl]}
                        </span>
                        <div className="flex gap-1.5 flex-1">
                          {Array.from({ length: slot.total }).map((_, i) => {
                            const isAvailable = i < available;
                            return (
                              <button
                                key={i}
                                title={isAvailable ? `Use level ${lvl} slot` : `Recover level ${lvl} slot`}
                                onClick={() => isAvailable ? consumeSpellSlot(lvl) : recoverSpellSlot(lvl)}
                                className={`
                                  w-5 h-5 rounded-md border transition-all duration-150 hover:scale-110
                                  ${isAvailable
                                    ? 'bg-primary-500 border-primary-600 shadow-sm shadow-primary-500/30'
                                    : 'bg-bg-tertiary border-border opacity-30 hover:opacity-60'
                                  }
                                `}
                              />
                            );
                          })}
                        </div>
                        <span className="text-[10px] font-bold text-text-tertiary flex-shrink-0 w-8 text-right">
                          {available}/{slot.total}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Preparation — only for casters who prepare spells */}
            {casterType.canPrepare && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-primary-500" />
                    Preparation
                  </h3>
                  <div className="flex items-center gap-3">
                    {casterType.isSpellbookCaster && (
                      <span className="text-[10px] text-text-tertiary">
                        Known: <span className="font-bold text-info">{spells.knownSpells.filter(id => {
                          const s = spellService.getSpell(id);
                          return s && s.level > 0;
                        }).length}</span>
                      </span>
                    )}
                    {casterType.canPrepare && !casterType.isSpellbookCaster && (
                      <span className="text-[10px] text-text-tertiary">
                        Class Spells: <span className="font-bold text-info">{inventorySpells.filter(s => s.level > 0).length}</span>
                      </span>
                    )}
                    <span className="text-sm font-black text-primary-600">
                      {spells.preparedSpells.length}
                      <span className="text-text-tertiary font-normal text-xs"> / {maxPrepared}</span>
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-bg-primary rounded-full overflow-hidden border border-border">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (spells.preparedSpells.length / Math.max(1, maxPrepared)) * 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-text-tertiary mt-2 text-center">
                  {maxPrepared - spells.preparedSpells.length > 0
                    ? `${maxPrepared - spells.preparedSpells.length} slot${maxPrepared - spells.preparedSpells.length !== 1 ? 's' : ''} remaining`
                    : 'Preparation limit reached'}
                </p>
              </section>
            )}

            {/* Spell Inventory */}
            <section>
              <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4">
                Spell Inventory
              </h3>
              {inventorySpells.length === 0 ? (
                <div className="text-center py-8 bg-bg-primary rounded-2xl border border-dashed border-border">
                  <p className="text-xs text-text-tertiary">No spells available.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(spellsByLevel).map(([level, spellsAtLevel]) => (
                    <div key={level} className="space-y-2">
                      <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest px-1">
                        {SPELL_LEVEL_LABELS[parseInt(level)]}
                      </div>
                      <div className="grid gap-1">
                        {spellsAtLevel.map(spell => {
                          const isAlwaysPrepared = alwaysPreparedList.includes(spell.id);
                          const isManuallyPrepared = spells.preparedSpells.includes(spell.id);
                          const isPrepared = isAlwaysPrepared || isManuallyPrepared;

                          return (
                            <div 
                              key={spell.id}
                              className={`
                                group flex items-center justify-between p-2 pl-3 rounded-xl border transition-all cursor-pointer
                                ${isPrepared 
                                  ? 'bg-primary-50 border-primary-100 shadow-sm' 
                                  : 'bg-bg-primary border-border hover:border-primary-200'}
                                ${isAlwaysPrepared ? 'ring-1 ring-info/30 bg-info/5' : ''}
                              `}
                              onClick={() => {
                                selectSpell(spell);
                                onOpenChange(false);
                              }}
                            >
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <div className={`text-xs font-bold truncate ${isPrepared ? 'text-primary-700' : 'text-text-primary'}`}>
                                    {spell.name}
                                  </div>
                                  {isAlwaysPrepared && (
                                    <Shield className="w-2.5 h-2.5 text-info fill-current opacity-60" />
                                  )}
                                </div>
                                <div className="text-[9px] text-text-tertiary uppercase tracking-tight">
                                  {spell.school} • {spell.castingTime}
                                </div>
                              </div>
                              
                              {casterType.canPrepare && spell.level > 0 && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (isAlwaysPrepared) return;
                                    handleTogglePrepare(spell.id, isManuallyPrepared);
                                  }}
                                  disabled={isAlwaysPrepared}
                                  className={`
                                    p-1.5 rounded-lg transition-all border
                                    ${isAlwaysPrepared
                                      ? 'bg-info/20 text-info border-info/30 cursor-default'
                                      : isManuallyPrepared
                                      ? 'bg-primary-500 text-white border-primary-600 shadow-sm'
                                      : 'bg-bg-tertiary text-text-tertiary hover:bg-primary-100 hover:text-primary-700 border-border'}
                                  `}
                                  title={isAlwaysPrepared ? 'Always Prepared' : isManuallyPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
                                >
                                  {isAlwaysPrepared ? (
                                    <Shield className="w-3.5 h-3.5 fill-current" />
                                  ) : (
                                    <Star className={`w-3.5 h-3.5 ${isManuallyPrepared ? 'fill-current' : ''}`} />
                                  )}
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

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
