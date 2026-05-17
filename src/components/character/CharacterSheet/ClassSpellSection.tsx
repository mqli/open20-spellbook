import { ChevronDown, ChevronRight, Shield } from 'lucide-react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Surface } from '../../ui/Surface';
import { Text } from '../../ui/Text';
import { spellService } from '../../../core/spell-service';
import { RulesService } from '../../../core/rules-service';
import { getCasterTypeForClass } from '../../../core/character-service';
import { useCharacterStore } from '../../../stores/character-store';
import { useSpellStore } from '../../../stores/spell-store';
import type { Spell } from '../../../core/types';
import { SpellEntry } from './SpellEntry';
import { useState } from 'react';


const SPELL_LEVEL_LABELS = ['Cantrip', '1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];

interface ClassSpellSectionProps {
  classId: string;
  classLevel: number;
  subclassId?: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ClassSpellSection({ classId, classLevel, subclassId, onOpenChange }: ClassSpellSectionProps) {
  const { activeCharacter, prepareSpellForClass, unprepareSpellForClass } = useCharacterStore();
  const { selectSpell } = useSpellStore();
  const [isExpanded, setIsExpanded] = useState(true);

  if (!activeCharacter) return null;

  const classData = activeCharacter.spells.classSpellcasting[classId];
  if (!classData) return null;

  const casterType = getCasterTypeForClass(classId);
  const ability = classData.spellcastingAbility;
  const stats = RulesService.getProjectedStats(activeCharacter);
  const abilityMod = stats.abilityModifiers[ability] ?? 0;
  const spellSaveDC = classData.spellSaveDC;
  const spellAttack = classData.spellAttackBonus;

  const known = [...classData.knownSpells];
  const prepared = [...classData.preparedSpells];
  const alwaysPrepared = [...(classData.alwaysPreparedSpells ?? [])];
  const allPrepared = [...prepared, ...alwaysPrepared];
  const maxPrepared = classData.maxPrepared;

  const subclassDisplay = subclassId ? subclassId : null;

  const inventorySpells = known
    .map(id => spellService.getSpell(id))
    .filter((s): s is NonNullable<typeof s> => !!s)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name));

  const spellsByLevel = inventorySpells.reduce((acc, spell) => {
    const level = spell.level;
    if (!acc[level]) acc[level] = [];
    acc[level].push(spell);
    return acc;
  }, {} as Record<number, Spell[]>);

  const handleTogglePrepare = (cid: string, spellId: string, isManuallyPrepared: boolean) => {
    if (isManuallyPrepared) unprepareSpellForClass(cid, spellId);
    else prepareSpellForClass(cid, spellId);
  };

  return (
    <Surface variant="default" padding="none" className="overflow-hidden">
      {/* Class Header */}
      <Button
        variant="ghost"
        onClick={() => setIsExpanded(prev => !prev)}
        className="w-full p-4 bg-bg-primary hover:bg-bg-tertiary transition-colors flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary-500/10 text-primary-600">
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <Text as="span" weight="black" className="capitalize">{classId} {classLevel}</Text>
              {subclassDisplay && (
                <span className="text-[10px] font-normal text-primary-600 bg-primary-500/10 px-2 py-0.5 rounded-full">
                  {subclassDisplay}
                </span>
              )}
            </div>
            <Text variant="caption" className="uppercase tracking-widest text-[9px]">
              {ability.substring(0, 3)} • DC {spellSaveDC} • +{spellAttack}
            </Text>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {casterType.canPrepare && (
            <Badge variant="purple" size="sm">
              {allPrepared.length}/{maxPrepared}
            </Badge>
          )}
        </div>
      </Button>

      {/* Class Content */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t border-border">
          {/* Class Stats */}
          <div className="grid grid-cols-3 gap-2">
            <Surface variant="default" padding="sm" className="text-center">
              <Text variant="label" className="mb-1">Ability</Text>
              <Text weight="black" color="accent">{ability.substring(0, 3)}</Text>
              <Text variant="caption" weight="bold" className="mt-0.5">
                {abilityMod >= 0 ? '+' : ''}{abilityMod}
              </Text>
            </Surface>
            <Surface variant="default" padding="sm" className="text-center">
              <Text variant="label" className="mb-1">Save DC</Text>
              <Text weight="black" color="accent">{spellSaveDC}</Text>
            </Surface>
            <Surface variant="default" padding="sm" className="text-center">
              <Text variant="label" className="mb-1">Attack</Text>
              <Text weight="black" color="accent">+{spellAttack}</Text>
            </Surface>
          </div>

          {/* Preparation Progress */}
          {casterType.canPrepare && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <Text variant="label">Preparation Slots</Text>
                <Text weight="bold" size="sm" color="accent">
                  {allPrepared.length}/{maxPrepared}
                </Text>
              </div>
              <div className="h-2.5 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(100, (allPrepared.length / Math.max(1, maxPrepared || 1)) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Known Spells Count */}
          {casterType.isSpellbookCaster && (
            <div className="text-[10px] text-text-tertiary">
              Known Spells: <Text weight="bold" className="text-info">
                {known.filter(id => {
                  const s = spellService.getSpell(id);
                  return s && s.level > 0;
                }).length}
              </Text>
            </div>
          )}

          {/* Always Prepared Spells */}
          {alwaysPrepared.length > 0 && (
            <div>
              <Text as="div" variant="label" className="mb-2 flex items-center gap-1">
                <Shield className="w-2.5 h-2.5 text-info" />
                Always Prepared
              </Text>
              <div className="flex flex-wrap gap-1">
                {alwaysPrepared.map(spellId => {
                  const spell = spellService.getSpell(spellId);
                  if (!spell) return null;
                  return (
                    <Badge key={spellId} variant="info" size="sm" className="cursor-pointer hover:bg-info/30"
                      onClick={() => selectSpell(spell)}
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
                <Text as="div" variant="label" className="text-[8px] px-1">
                  {SPELL_LEVEL_LABELS[parseInt(level, 10)]}
                </Text>
                <div className="grid gap-1">
                  {spellsAtLevel.map(spell => (
                    <SpellEntry
                      key={spell.id}
                      spell={spell}
                      classId={classId}
                      prepared={prepared}
                      alwaysPrepared={alwaysPrepared}
                      onTogglePrepare={handleTogglePrepare}
                      onSelectSpell={(s) => selectSpell(s)}
                      onCloseSheet={onOpenChange}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Surface>
  );
}
