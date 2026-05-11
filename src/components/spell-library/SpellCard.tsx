import type { Spell } from 'open20-core/browser';
import { useSpellStore } from '../../stores/spell-store';
import { useCharacterStore } from '../../stores/character-store';
import { SpellService } from '../../core/spell-service';
import { Badge } from '../ui/Badge';
import { Sparkles, Activity, BookMarked, Star } from 'lucide-react';

interface SpellCardProps {
  spell: Spell;
}

interface ConcentrationCondition {
  id: string;
  source?: string;
}

export function SpellCard({ spell }: SpellCardProps) {
  const { selectSpell } = useSpellStore();
  const {
    activeCharacter,
    learnSpell, unlearnSpell,
    prepareSpell, unprepareSpell,
    startConcentration, endConcentration,
  } = useCharacterStore();

  const isKnown = activeCharacter ? SpellService.isSpellKnown(activeCharacter, spell.id) : false;
  const isPrepared = activeCharacter ? SpellService.isSpellPrepared(activeCharacter, spell.id) : false;
  const isConcentratingOnThis = activeCharacter?.conditions.some(
    c => c.id === 'Concentrating' && (c as ConcentrationCondition).source === spell.id
  ) ?? false;

  // A spell is "actionable" if there's an active character whose class includes it
  const isClassSpell = activeCharacter
    ? SpellService.isSpellForCharacter(activeCharacter, spell)
    : false;

  const handleLearnToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isKnown) {
      unlearnSpell(spell.id);
    } else {
      learnSpell(spell.id);
    }
  };

  const handlePrepareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPrepared) {
      unprepareSpell(spell.id);
    } else {
      prepareSpell(spell.id);
    }
  };

  const handleConcentrationToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConcentratingOnThis) {
      endConcentration();
    } else {
      startConcentration(spell.id);
    }
  };

  return (
    <div
      onClick={() => selectSpell(spell)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectSpell(spell); }}
      className={`
        w-full text-left bg-bg-secondary border rounded-xl p-4 transition-all duration-200 group relative overflow-hidden cursor-pointer
        ${isConcentratingOnThis
          ? 'border-warning ring-2 ring-warning/50 bg-warning/5'
          : isPrepared
          ? 'border-primary-400 shadow-md ring-1 ring-primary-400/60'
          : isKnown
          ? 'border-info/50 shadow-sm'
          : 'border-border shadow-sm hover:shadow-md hover:border-primary-300'}
      `}
    >
      {/* Background glow for prepared */}
      {isPrepared && (
        <div className="absolute -top-1 -right-1 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-12 h-12 text-primary-500" />
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-text-primary group-hover:text-primary-600 transition-colors leading-tight pr-8">
          {spell.name}
        </h3>
        <div className="flex gap-1">
          {spell.ritual && <Badge variant="info" size="sm">R</Badge>}
          {spell.concentration && <Badge variant="warning" size="sm">C</Badge>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant={spell.level === 0 ? 'slate' : 'purple'} size="sm" className="font-black">
          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
        </Badge>
        <span className="text-[10px] text-text-tertiary uppercase font-bold tracking-widest">{spell.school}</span>
        {isKnown && !isPrepared && (
          <Badge variant="info" size="sm">Known</Badge>
        )}
        {isPrepared && (
          <Badge variant="purple" size="sm">Prepared</Badge>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <span className="text-[10px] text-text-tertiary font-medium">
          {spell.castingTime} • <span className="uppercase opacity-70">{spell.source}</span>
        </span>

        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {/* Concentration toggle — only if spell requires it and character is active */}
          {spell.concentration && activeCharacter && (
            <button
              onClick={handleConcentrationToggle}
              className={`
                p-1.5 rounded-lg transition-all border
                ${isConcentratingOnThis
                  ? 'bg-warning text-white border-warning shadow-sm'
                  : 'bg-bg-tertiary text-text-tertiary hover:bg-warning/10 hover:text-warning border-border'}
              `}
              title={isConcentratingOnThis ? 'End Concentration' : 'Start Concentration'}
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Learn toggle — available for any class spell */}
          {isClassSpell && (
            <button
              onClick={handleLearnToggle}
              className={`
                p-1.5 rounded-lg transition-all border
                ${isKnown
                  ? 'bg-info text-white border-info shadow-sm'
                  : 'bg-bg-tertiary text-text-tertiary hover:bg-info/10 hover:text-info border-border'}
              `}
              title={isKnown ? 'Unlearn Spell' : 'Learn Spell'}
            >
              <BookMarked className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Prepare toggle — only visible if known (or cantrips which are always "known") */}
          {isClassSpell && (isKnown || spell.level === 0) && (
            <button
              onClick={handlePrepareToggle}
              className={`
                p-1.5 rounded-lg transition-all border
                ${isPrepared
                  ? 'bg-primary-500 text-white border-primary-600 shadow-sm'
                  : 'bg-bg-tertiary text-text-tertiary hover:bg-primary-100 hover:text-primary-700 border-border'}
              `}
              title={isPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
            >
              <Star className={`w-3.5 h-3.5 ${isPrepared ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
