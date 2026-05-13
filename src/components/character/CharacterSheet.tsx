import { useCharacterStore } from '../../stores/character-store';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X, BookOpen, Flame, Wind, Pencil, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { spellService } from '../../core/spell-service';
import { RulesService } from '../../core/rules-service';
import { useSpellStore } from '../../stores/spell-store';
import { Star, Shield } from 'lucide-react';
import { useState } from 'react';
import { dataLoader } from '../../core/data-loader';

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
  const { activeCharacter, consumeSpellSlot, recoverSpellSlot, prepareSpellForClass, unprepareSpellForClass } = useCharacterStore();
  const { selectSpell } = useSpellStore();
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});

  if (!activeCharacter) return null;

  const spells = activeCharacter.spells;
  const classSpellcasting = spells.classSpellcasting;
  const stats = RulesService.getProjectedStats(activeCharacter);
  const concentratingCondition = activeCharacter.conditions?.find(c => c.id === 'Concentrating');
  const concentratingSpellId = (concentratingCondition as ConcentrationCondition | undefined)?.source;

  const slotEntries = Object.entries(spells.spellSlots ?? {})
    .map(([lvl, slot]) => ({ lvl: parseInt(lvl), slot: slot as { total: number; used: number } }))
    .filter(({ lvl, slot }) => lvl > 0 && slot.total > 0);

  const isMulticlass = (activeCharacter.classes?.length ?? 0) > 1;

  // Get all classes that have spellcasting
  const spellcastingClasses = activeCharacter.classes?.filter(c => 
    classSpellcasting[c.classId]
  ) ?? [];
  const toggleClassExpand = (classId: string) => {
    setExpandedClasses(prev => ({
      ...prev,
      [classId]: !prev[classId]
    }));
  };

  const handleTogglePrepare = (classId: string, spellId: string, isManuallyPrepared: boolean) => {
    if (isManuallyPrepared) unprepareSpellForClass(classId, spellId);
    else prepareSpellForClass(classId, spellId);
  };

  // Get spells for a specific class
  const getSpellsForClass = (classId: string) => {
    const classData = classSpellcasting[classId];
    if (!classData) return { known: [], prepared: [], alwaysPrepared: [] };
    // All data comes from the character's classSpellcasting
    return {
      known: [...classData.knownSpells],
      prepared: [...classData.preparedSpells],
      alwaysPrepared: [...(classData.alwaysPreparedSpells ?? [])]
    };
  };

  // Get all spell IDs for a class (for inventory display)
  const getInventorySpellIdsForClass = (classId: string) => {
    const classData = classSpellcasting[classId];
    if (!classData) return [];

    const casterType = getCasterTypeForClass(classId);

    // For prepared casters (non-spellbook), show all class spells
    if (casterType.canPrepare && !casterType.isSpellbookCaster) {
      return spellService.getAllSpells()
        .filter(s => s.classes?.includes(classId))
        .map(s => s.id);
    }
    // For known/spellbook casters, show only known spells
    return [...classData.knownSpells];
  };

  const getCasterTypeForClass = (classId: string) => {
    const classIds = [classId];
    const KNOWN_ONLY_CLASSES = new Set(['Ward', 'Sorcerer', 'Warlock', 'Ranger']);
    const PREPARED_ONLY_CLASSES = new Set(['Cleric', 'Druid', 'Paladin']);
    const SPELLBOOK_CLASSES = new Set(['Wizard', 'Artificer']);

    const canLearn = classIds.some(id => KNOWN_ONLY_CLASSES.has(id) || SPELLBOOK_CLASSES.has(id));
    const canPrepare = classIds.some(id => PREPARED_ONLY_CLASSES.has(id) || SPELLBOOK_CLASSES.has(id));
    const isSpellbookCaster = classIds.some(id => SPELLBOOK_CLASSES.has(id));

    return { canLearn, canPrepare, isSpellbookCaster };
  };

  // Render spells for a specific class
  const renderClassSpells = (classId: string, classLevel: number, subclassId?: string | null) => {
    const classData = classSpellcasting[classId];
    if (!classData) return null;

    const casterType = getCasterTypeForClass(classId);
    const ability = classData.spellcastingAbility;
    const abilityMod = stats.abilityModifiers[ability] ?? 0;
    const spellSaveDC = classData.spellSaveDC;
    const spellAttack = classData.spellAttackBonus;

    const { known, prepared, alwaysPrepared } = getSpellsForClass(classId);
    const allPrepared = [...prepared, ...alwaysPrepared];
    const maxPrepared = classData.maxPrepared;

    // Get subclass name from dataLoader (id is the display name in open20-core)
    const subclassDisplay = subclassId ? (dataLoader.getSubclass(subclassId)?.id ?? subclassId) : null;

    const inventoryIds = getInventorySpellIdsForClass(classId);
    const inventorySpells = inventoryIds
      .map(id => spellService.getSpell(id))
      .filter((s): s is NonNullable<typeof s> => !!s)
      .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

    const spellsByLevel = inventorySpells.reduce((acc, spell) => {
      const level = spell.level;
      if (!acc[level]) acc[level] = [];
      acc[level].push(spell);
      return acc;
    }, {} as Record<number, typeof inventorySpells>);

    const isExpanded = expandedClasses[classId] ?? true;

    return (
      <section key={classId} className="border border-border rounded-2xl overflow-hidden">
        {/* Class Header */}
        <button
          onClick={() => toggleClassExpand(classId)}
          className="w-full p-4 bg-bg-primary hover:bg-bg-tertiary transition-colors flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </div>
            <div className="text-left">
              <div className="text-sm font-black text-text-primary capitalize flex items-center gap-2">
                {classId} {classLevel}
                {subclassDisplay && (
                  <span className="text-[10px] font-normal text-primary-600 bg-primary-500/10 px-2 py-0.5 rounded-full">
                    {subclassDisplay}
                  </span>
                )}
              </div>
              <div className="text-[9px] text-text-tertiary uppercase tracking-widest">
                {ability.substring(0, 3)} • DC {spellSaveDC} • +{spellAttack}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {casterType.canPrepare && (
              <Badge variant="purple" size="sm">
                {allPrepared.length}/{maxPrepared}
              </Badge>
            )}
          </div>
        </button>

        {/* Class Content */}
        {isExpanded && (
          <div className="p-4 space-y-4 border-t border-border">
            {/* Class Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-bg-secondary p-3 rounded-xl border border-border text-center">
                <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Ability</div>
                <div className="text-sm font-black text-primary-600">{ability.substring(0, 3)}</div>
                <div className="text-[9px] font-bold text-text-tertiary mt-0.5">
                  {abilityMod >= 0 ? '+' : ''}{abilityMod}
                </div>
              </div>
              <div className="bg-bg-secondary p-3 rounded-xl border border-border text-center">
                <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Save DC</div>
                <div className="text-sm font-black text-primary-600">{spellSaveDC}</div>
              </div>
              <div className="bg-bg-secondary p-3 rounded-xl border border-border text-center">
                <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest mb-1">Attack</div>
                <div className="text-sm font-black text-primary-600">+{spellAttack}</div>
              </div>
            </div>

            {/* Preparation Progress (for prepared casters) */}
            {casterType.canPrepare && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">
                    Preparation Slots
                  </span>
                  <span className="text-xs font-bold text-primary-600">
                    {allPrepared.length}/{maxPrepared}
                  </span>
                </div>
                <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-400 transition-all duration-500"
                    style={{ width: `${Math.min(100, (allPrepared.length / Math.max(1, maxPrepared)) * 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Known Spells Count (for spellbook/known casters) */}
            {casterType.isSpellbookCaster && (
              <div className="text-[10px] text-text-tertiary">
                Known Spells: <span className="font-bold text-info">
                  {known.filter(id => {
                    const s = spellService.getSpell(id);
                    return s && s.level > 0;
                  }).length}
                </span>
              </div>
            )}

            {/* Always Prepared Spells (from subclass or class features) */}
            {alwaysPrepared.length > 0 && (
              <div>
                <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mb-2 flex items-center gap-1">
                  <Shield className="w-2.5 h-2.5 text-info" />
                  Always Prepared
                </div>
                <div className="flex flex-wrap gap-1">
                  {alwaysPrepared.map(spellId => {
                    const spell = spellService.getSpell(spellId);
                    if (!spell) return null;
                    return (
                      <Badge key={spellId} variant="info" size="sm" className="cursor-pointer hover:bg-info/30"
                        onClick={() => {
                          selectSpell(spell);
                          onOpenChange(false);
                        }}
                      >
                        {spell.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Spell List */}
            <div className="space-y-4">
              {Object.entries(spellsByLevel).map(([level, spellsAtLevel]) => (
                <div key={level} className="space-y-1">
                  <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest px-1">
                    {SPELL_LEVEL_LABELS[parseInt(level)]}
                  </div>
                  <div className="grid gap-1">
                    {spellsAtLevel.map(spell => {
                      const isAlwaysPrepared = alwaysPrepared.includes(spell.id);
                      const isManuallyPrepared = prepared.includes(spell.id);
                      const isPrepared = isAlwaysPrepared || isManuallyPrepared;

                      return (
                        <div
                          key={spell.id}
                          className={`
                            group flex items-center justify-between p-2 pl-3 rounded-lg border transition-all cursor-pointer
                            ${isPrepared
                              ? 'bg-primary-50 border-primary-100 shadow-sm'
                              : 'bg-bg-secondary border-border hover:border-primary-200'}
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

                          {casterType.canPrepare && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isAlwaysPrepared) return;
                                handleTogglePrepare(classId, spell.id, isManuallyPrepared);
                              }}
                              disabled={isAlwaysPrepared}
                              className={`
                                p-1.5 rounded-lg transition-all border text-[10px] font-bold
                                ${isAlwaysPrepared
                                  ? 'bg-info/20 text-info border-info/30 cursor-default'
                                  : isManuallyPrepared
                                  ? 'bg-primary-500 text-white border-primary-600 shadow-sm'
                                  : 'bg-bg-tertiary text-text-tertiary hover:bg-primary-100 hover:text-primary-700 border-border'}
                              `}
                              title={isAlwaysPrepared ? 'Always Prepared' : isManuallyPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
                            >
                              {isAlwaysPrepared ? (
                                <Shield className="w-3 h-3 fill-current" />
                              ) : (
                                <>
                                  <Star className={`w-3 h-3 ${isManuallyPrepared ? 'fill-current' : ''}`} />
                                  {casterType.canPrepare && (
                                    <span className="ml-1">
                                      ({allPrepared.length}/{maxPrepared ?? 0})
                                    </span>
                                  )}
                                </>
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
          </div>
        )}
      </section>
    );
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
                {activeCharacter.classes?.map((c, i) => (
                  <Badge key={i} variant={i === 0 ? "purple" : "slate"} size="sm">
                    {c.classId} {c.level}
                  </Badge>
                ))}
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

          <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6">

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

            {/* Combined Spell Slots (for multiclass) */}
            {slotEntries.length > 0 && (
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

            {/* Per-Class Spellcasting Sections */}
            {spellcastingClasses.length > 0 && (
              <section>
                <h3 className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <BookOpen className="w-3 h-3 text-primary-500" />
                  Class Spellcasting
                </h3>
                <div className="space-y-3">
                  {spellcastingClasses.map(c => renderClassSpells(c.classId, c.level, c.subclassId))}
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
