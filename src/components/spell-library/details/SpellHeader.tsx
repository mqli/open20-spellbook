import { Activity } from 'lucide-react';
import type { Spell } from 'open20-core';
import type { AppCharacter } from '../../../core/types';
import { getCasterType } from '../../../core/character-service';

interface SpellHeaderProps {
  spell: Spell;
  character: AppCharacter | null;
  isKnown: boolean;
  isPrepared: boolean;
  isClassSpell: boolean;
  isConcentratingOnThis: boolean;
  onLearnToggle: () => void;
  onPrepareToggle: () => void;
  onConcentrationToggle: () => void;
}

export function SpellHeader({
  spell,
  character,
  isKnown,
  isPrepared,
  isClassSpell,
  isConcentratingOnThis,
  onLearnToggle,
  onPrepareToggle,
  onConcentrationToggle,
}: SpellHeaderProps) {
  const casterType = character ? getCasterType(character) : null;
  
  // Determine which actions are available
  const canLearn = casterType?.canLearn ?? false;
  const canPrepare = casterType?.canPrepare ?? false;
  
  // For known casters (Bard, Sorcerer, Warlock, Ranger): show Learn but not Prepare
  // For prepared casters (Cleric, Druid, Paladin): show Prepare but not Learn
  // For spellbook casters (Wizard, Artificer): show both Learn and Prepare
  // For multiclass: show both if any class supports that action
  
  const showLearnButton = isClassSpell && canLearn;
  const showPrepareButton = isClassSpell && canPrepare && (isKnown || spell.level === 0);
  
  return (
    <div className="flex items-center gap-3">
      {spell.concentration && character && (
        <button
          onClick={onConcentrationToggle}
          className={`
            flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border
            ${isConcentratingOnThis 
              ? 'bg-warning text-white border-warning shadow-md' 
              : 'bg-bg-tertiary text-text-tertiary hover:bg-warning/10 hover:text-warning border-border'}
          `}
        >
          <Activity className={`w-3.5 h-3.5 ${isConcentratingOnThis ? 'animate-pulse' : ''}`} />
          <span className="hidden sm:inline">{isConcentratingOnThis ? 'Concentrating' : 'Concentrate'}</span>
          <span className="sm:hidden">{isConcentratingOnThis ? 'Conc' : 'Conc'}</span>
        </button>
      )}

      {showLearnButton && (
        <button
          onClick={onLearnToggle}
          className={`
            text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border
            ${isKnown 
              ? 'bg-info text-white border-info shadow-md' 
              : 'bg-bg-tertiary text-text-tertiary hover:bg-info/10 hover:text-info border-border'}
          `}
        >
          {isKnown ? 'Known ✓' : 'Learn'}
        </button>
      )}

      {showPrepareButton && (
        <button
          onClick={onPrepareToggle}
          className={`
            text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border
            ${isPrepared 
              ? 'bg-primary-500 text-white border-primary-600 shadow-md' 
              : 'bg-bg-tertiary text-text-tertiary hover:bg-primary-100 hover:text-primary-700 border-border'}
          `}
        >
          {isPrepared ? 'Prepared ✓' : 'Prepare'}
        </button>
      )}
    </div>
  );
}
