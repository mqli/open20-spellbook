import type { Spell } from 'open20-core';
import { useSpellStore } from '../../stores/spell-store';
import { useCharacterStore } from '../../stores/character-store';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/IconButton';
import { Surface } from '../ui/Surface';
import { Text } from '../ui/Text';
import { spellService } from '../../core/spell-service';
import { getCasterType } from '../../core/character-service';
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

  const isKnown = activeCharacter ? spellService.isSpellKnown(activeCharacter, spell.id) : false;
  const isPrepared = activeCharacter ? spellService.isSpellPrepared(activeCharacter, spell.id) : false;
  const isConcentratingOnThis = activeCharacter?.conditions.some(
    c => c.id === 'Concentrating' && (c as ConcentrationCondition).source === spell.id
  ) ?? false;

  // A spell is "actionable" if there's an active character whose class includes it
  const isClassSpell = activeCharacter
    ? spellService.isSpellForCharacter(activeCharacter, spell)
    : false;

  // Show Learn/Prepare buttons based on character's caster type
  const casterType = activeCharacter ? getCasterType(activeCharacter) : { canLearn: false, canPrepare: false, isSpellbookCaster: false };

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

  const surfaceVariant = isConcentratingOnThis
    ? 'warning'
    : isPrepared
    ? 'selected'
    : isKnown
    ? 'info'
    : 'default';

  const surfaceClassName = !isConcentratingOnThis && !isPrepared && !isKnown
    ? 'cursor-pointer hover:shadow-md hover:border-primary-300'
    : '';

  return (
    <Surface
      variant={surfaceVariant}
      padding="md"
      onClick={() => selectSpell(spell)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectSpell(spell); }}
      className={`w-full text-left relative overflow-hidden ${surfaceClassName}`}
    >
      {/* Background glow for prepared */}
      {isPrepared && (
        <div className="absolute -top-1 -right-1 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-12 h-12 text-primary-500" />
        </div>
      )}

      <div className="flex justify-between items-start mb-2">
        <Text as="h3" variant="heading" className="group-hover:text-primary-600 transition-colors leading-tight pr-8">
          {spell.name}
        </Text>
        <div className="flex gap-1">
          {spell.ritual && <Badge variant="info" size="sm">R</Badge>}
          {spell.concentration && <Badge variant="warning" size="sm">C</Badge>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Badge variant={spell.level === 0 ? 'slate' : 'purple'} size="sm" className="font-black">
          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
        </Badge>
        <Text variant="labelSm">{spell.school}</Text>
        {isKnown && !isPrepared && (
          <Badge variant="info" size="sm">Known</Badge>
        )}
        {isPrepared && (
          <Badge variant="purple" size="sm">Prepared</Badge>
        )}
      </div>

      <div className="flex items-center justify-between mt-auto">
        <Text variant="caption">
          {spell.castingTime} • <span className="uppercase opacity-70">{spell.source}</span>
        </Text>

        <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
          {/* Concentration toggle — only if spell requires it and character is active */}
          {spell.concentration && activeCharacter && (
            <IconButton
              variant="warning"
              active={isConcentratingOnThis}
              onClick={handleConcentrationToggle}
              title={isConcentratingOnThis ? 'End Concentration' : 'Start Concentration'}
            >
              <Activity className="w-3.5 h-3.5" />
            </IconButton>
          )}

          {/* Learn toggle — for casters who "learn" spells; cantrips only for spellbook casters */}
          {isClassSpell && casterType.canLearn && (spell.level > 0 || casterType.isSpellbookCaster) && (
            <IconButton
              variant="info"
              active={isKnown}
              onClick={handleLearnToggle}
              title={isKnown ? 'Unlearn Spell' : 'Learn Spell'}
            >
              <BookMarked className="w-3.5 h-3.5" />
            </IconButton>
          )}

          {/* Prepare toggle — only for casters who prepare spells (not cantrips) */}
          {isClassSpell && casterType.canPrepare && spell.level > 0 && (
            <IconButton
              variant="primary"
              active={isPrepared}
              onClick={handlePrepareToggle}
              title={isPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
            >
              <Star className={`w-3.5 h-3.5 ${isPrepared ? 'fill-current' : ''}`} />
            </IconButton>
          )}
        </div>
      </div>
    </Surface>
  );
}
