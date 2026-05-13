import { Sparkles, BookOpen } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { Spell } from 'open20-core';
import type { AppCharacter } from '../../../core/types';
import { getCasterType } from '../../../core/character-service';

interface SpellActionPanelProps {
  spell: Spell;
  character: AppCharacter | null;
  isKnown: boolean;
  isPrepared: boolean;
  preparedCount: number;
  maxPrepared: number;
  onCast: () => void;
  onAttackRoll: () => void;
  onDamageRoll: (index: number, label: string) => void;
  onPrepareToggle: () => void;
}

export function SpellActionPanel({
  spell,
  character,
  isKnown,
  isPrepared,
  preparedCount,
  maxPrepared,
  onCast,
  onAttackRoll,
  onDamageRoll,
  onPrepareToggle,
}: SpellActionPanelProps) {
  if (!character) return null;

  const classSpellcasting = character.spells.classSpellcasting;
  const primaryClassId = Object.keys(classSpellcasting)[0];
  const spellAttackBonus = primaryClassId
    ? classSpellcasting[primaryClassId].spellAttackBonus
    : 0;

  const casterType = getCasterType(character);
  const canPrepare = casterType.canPrepare;

  const canCast = (isKnown || spell.level === 0) && (spell.level === 0 || isPrepared) && (
    spell.level === 0 || 
    (character.spells.spellSlots[spell.level]?.total ?? 0) > (character.spells.spellSlots[spell.level]?.used ?? 0)
  );

  return (
    <div className="mb-8 p-6 bg-primary-500/5 rounded-2xl border border-primary-500/10 flex flex-wrap gap-4 items-center">
      <div className="text-xs font-black text-primary-700 uppercase tracking-widest mr-2">Quick Actions</div>
      
      {canPrepare && (isKnown || spell.level === 0) && (
        <Button 
          variant={isPrepared ? "primary" : "secondary"} 
          size="sm" 
          className={isPrepared 
            ? "bg-primary-500 text-white border-primary-600 shadow-md" 
            : "border-primary-200 text-primary-700 hover:bg-primary-100"
          }
          onClick={onPrepareToggle}
        >
          <BookOpen className="w-3.5 h-3.5 mr-2" />
          {isPrepared ? 'Prepared ✓' : 'Prepare'}
          {maxPrepared > 0 && (
            <span className="ml-1.5 text-[10px] opacity-80">
              ({preparedCount}/{maxPrepared})
            </span>
          )}
        </Button>
      )}

      <Button 
        variant="primary" 
        size="sm" 
        className="bg-primary-600 hover:bg-primary-700 text-white border-primary-700 shadow-md"
        onClick={onCast}
        disabled={!canCast}
      >
        <Sparkles className="w-3.5 h-3.5 mr-2" />
        Cast Spell {spell.level > 0 && `(Level ${spell.level})`}
      </Button>

      {spell.attack && (
        <Button 
          variant="primary" 
          size="sm" 
          className="shadow-lg shadow-primary-500/20"
          onClick={onAttackRoll}
        >
          Roll Attack (+{spellAttackBonus ?? 0})
        </Button>
      )}
      
      {spell.damage?.entries.map((entry, i) => (
        <Button 
          key={i} 
          variant="secondary" 
          size="sm" 
          className="border-primary-200 text-primary-700 hover:bg-primary-100"
          onClick={() => onDamageRoll(i, `${entry.type} Damage`)}
        >
          Roll {entry.dice} {entry.type}
        </Button>
      ))}
    </div>
  );
}
