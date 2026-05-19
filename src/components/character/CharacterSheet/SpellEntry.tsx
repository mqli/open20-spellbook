import { Star, Shield, Zap, Flame } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Surface } from '../../ui/Surface';
import { Text } from '../../ui/Text';
import { useCharacterStore } from '../../../stores/character-store';
import { useRollStore } from '../../../stores/roll-store';
import { characterService } from '../../../core/character-service';
import { getCasterTypeForClass } from '../../../core/character-service';
import type { Spell } from '../../../core/types';

interface SpellEntryProps {
  spell: Spell;
  classId: string;
  prepared: string[];
  alwaysPrepared: string[];
  onTogglePrepare: (classId: string, spellId: string, isManuallyPrepared: boolean) => void;
  onSelectSpell: (spell: Spell) => void;
  onCloseSheet: (open: boolean) => void;
}

export function SpellEntry({
  spell, classId, prepared, alwaysPrepared, onTogglePrepare, onSelectSpell, onCloseSheet,
}: SpellEntryProps) {
  const casterType = getCasterTypeForClass(classId);
  const isAlwaysPrepared = alwaysPrepared.includes(spell.id);
  const isManuallyPrepared = prepared.includes(spell.id);
  const isPrepared = isAlwaysPrepared || isManuallyPrepared;

  const activeCharacter = useCharacterStore(s => s.activeCharacter);
  const castSpell = useCharacterStore(s => s.castSpell);
  const addRoll = useRollStore(s => s.addRoll);

  const handleCast = () => {
    castSpell(spell.id, spell.level);
  };

  const hasDamage = spell.damage?.entries && spell.damage.entries.length > 0;

  const handleRollDamage = (index: number = 0) => {
    if (!activeCharacter || !hasDamage) return;
    const result = characterService.rollSpellDamage(activeCharacter, spell.id, index);
    const expression = result.entries
      .map(e => `${e.count}${e.die}${e.type ? ` (${e.type})` : ''}`)
      .join(' + ');
    const modExpr = result.modifiers.length > 0
      ? ` + ${result.modifiers.reduce((s, m) => s + m.value, 0)}`
      : '';
    addRoll({
      label: `Damage: ${spell.name}`,
      expression: `${expression}${modExpr}`,
      total: result.total,
    });
  };

  return (
    <Surface
      variant="default"
      className={`
        group flex items-center justify-between p-2 pl-3 rounded-lg border transition-all cursor-pointer
        ${isPrepared
          ? 'bg-primary-50 border-primary-100 shadow-sm'
          : 'bg-bg-secondary border-border hover:border-primary-200'}
        ${isAlwaysPrepared ? 'ring-1 ring-info/30 bg-info/5' : ''}
      `}
      onClick={() => {
        onSelectSpell(spell);
        onCloseSheet(false);
      }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <Text as="div" weight="bold" className={`truncate ${isPrepared ? 'text-primary-700' : 'text-text-primary'}`}>
            {spell.name}
          </Text>
          {isAlwaysPrepared && (
            <Shield className="w-2.5 h-2.5 text-info fill-current opacity-60" />
          )}
        </div>
        <Text as="div" variant="caption" className="uppercase tracking-tight">
          {spell.school} • {spell.castingTime}
        </Text>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleCast();
          }}
          title="Cast Spell"
          className="p-1.5"
        >
          <Zap className="w-3 h-3" />
        </Button>

        {hasDamage && (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation();
            handleRollDamage();
          }}
          title="Roll Damage"
          className="p-1.5"
        >
          <Flame className="w-3 h-3" />
        </Button>
        )}
        {hasDamage && spell.damage.entries.slice(1).map((entry, i) => (
          <Button
            key={entry.dice + entry.type}
            variant="ghost"
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              handleRollDamage(i + 1);
            }}
            title={`Roll ${entry.dice} ${entry.type} Damage`}
            className="p-1.5 text-[10px] font-bold"
          >
            {entry.dice}
          </Button>
        ))}

        {casterType.canPrepare && (
          <Button
            variant={isManuallyPrepared ? 'primary' : 'ghost'}
            size="sm"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (isAlwaysPrepared) return;
              onTogglePrepare(classId, spell.id, isManuallyPrepared);
            }}
            disabled={isAlwaysPrepared}
            className={`p-1.5 border text-[10px] font-bold ${
              isAlwaysPrepared
                ? 'bg-info/20 text-info border-info/30 cursor-default'
                : isManuallyPrepared
                ? 'border-primary-600 shadow-sm'
                : 'bg-bg-tertiary text-text-tertiary hover:bg-primary-100 hover:text-primary-700 border-border'
            }`}
            title={isAlwaysPrepared ? 'Always Prepared' : isManuallyPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
          >
            {isAlwaysPrepared ? (
              <Shield className="w-3 h-3 fill-current" />
            ) : (
              <Star className={`w-3 h-3 ${isManuallyPrepared ? 'fill-current' : ''}`} />
            )}
          </Button>
        )}
      </div>
    </Surface>
  );
}
