import type { Spell } from 'open20-core';
import { useSpellStore } from '../../stores/spell-store';
import { useCharacterStore } from '../../stores/character-store';
import { Badge } from '../ui/Badge';
import { IconButton } from '../ui/IconButton';
import { Surface } from '../ui/Surface';
import { Text } from '../ui/Text';
import { DropdownMenu } from '../ui/DropdownMenu';
import { spellService } from '../../core/spell-service';
import { getCasterType } from '../../core/character-service';
import { Sparkles, Activity, BookMarked, Star, ChevronDown } from 'lucide-react';

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
    learnCantrip, unlearnCantrip,
    prepareSpell, unprepareSpell,
    prepareSpellForClass, unprepareSpellForClass,
    startConcentration, endConcentration,
  } = useCharacterStore();

  // Get ALL matching classIds for this spell (for multiclass)
  const getMatchingClassIds = (): string[] => {
    if (!activeCharacter) return [];
    const classIds = activeCharacter.classes?.map(c => c.classId) ?? [];
    const spellClasses = spell.classes ?? [];
    return classIds.filter(id => spellClasses.includes(id));
  };

  // Get classes that have this spell prepared
  const getPreparedClassIds = (): string[] => {
    if (!activeCharacter) return [];
    const matchingClassIds = getMatchingClassIds();
    return matchingClassIds.filter(classId => {
      const classData = activeCharacter.spells.classSpellcasting[classId];
      return classData?.preparedSpells.includes(spell.id) ?? false;
    });
  };

  const matchingClassIds = getMatchingClassIds();
  const preparedClassIds = getPreparedClassIds();

  const isKnown = activeCharacter ? spellService.isSpellKnown(activeCharacter, spell.id) : false;
  const isPrepared = preparedClassIds.length > 0;
  const isConcentratingOnThis = activeCharacter?.conditions.some(
    c => c.id === 'Concentrating' && (c as ConcentrationCondition).source === spell.id
  ) ?? false;

  // Check if cantrip is known
  const isCantripKnown = ((): boolean => {
    if (!activeCharacter || spell.level !== 0) return false;
    const classId = matchingClassIds[0];
    if (!classId) return false;
    const classData = activeCharacter.spells.classSpellcasting[classId];
    return classData?.knownCantrips.includes(spell.id) ?? false;
  })();

  // A spell is "actionable" if there's an active character whose class includes it
  const isClassSpell = activeCharacter
    ? spellService.isSpellForCharacter(activeCharacter, spell)
    : false;

  // Show Learn/Prepare buttons based on character's caster type
  const casterType = activeCharacter ? getCasterType(activeCharacter) : { canLearn: false, canPrepare: false, isSpellbookCaster: false };

  const handleLearnToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const classId = matchingClassIds[0];
    if (!classId) return;

    if (spell.level === 0) {
      // Cantrip
      if (isCantripKnown) {
        unlearnCantrip(classId, spell.id);
      } else {
        learnCantrip(classId, spell.id);
      }
    } else {
      // Regular spell
      if (isKnown) {
        unlearnSpell(spell.id);
      } else {
        learnSpell(spell.id);
      }
    }
  };

  const handlePrepareForClass = (classId: string) => {
    prepareSpellForClass(classId, spell.id);
  };

  const handleUnprepareFromClass = (classId: string) => {
    unprepareSpellForClass(classId, spell.id);
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
    : (isKnown || isCantripKnown)
    ? 'info'
    : 'default';

  const surfaceClassName = !isConcentratingOnThis && !isPrepared && !isKnown && !isCantripKnown
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
        <Badge variant={spell.level === 0 ? 'secondary' : 'primary'} size="sm" className="font-black">
          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
        </Badge>
        <Text variant="labelSm">{spell.school}</Text>
        {(isKnown || isCantripKnown) && !isPrepared && (
          <Badge variant="info" size="sm">Known</Badge>
        )}
        {isPrepared && (
          <Badge variant="primary" size="sm">Prepared</Badge>
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

          {/* Learn toggle — for casters who "learn" spells; cantrips for all casters now */}
          {isClassSpell && casterType.canLearn && (
            <IconButton
              variant="info"
              active={spell.level === 0 ? isCantripKnown : isKnown}
              onClick={handleLearnToggle}
              title={spell.level === 0 ? (isCantripKnown ? 'Unlearn Cantrip' : 'Learn Cantrip') : (isKnown ? 'Unlearn Spell' : 'Learn Spell')}
            >
              <BookMarked className="w-3.5 h-3.5" />
            </IconButton>
          )}

          {/* Prepare toggle — only for casters who prepare spells (not cantrips) */}
          {isClassSpell && casterType.canPrepare && spell.level > 0 && (
            matchingClassIds.length > 1 ? (
              /* Multiple classes - show dropdown to choose */
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <IconButton
                    variant="primary"
                    active={isPrepared}
                    title={isPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
                  >
                    <Star className={`w-3.5 h-3.5 ${isPrepared ? 'fill-current' : ''}`} />
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                  </IconButton>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content className="w-40">
                  {preparedClassIds.length > 0 && (
                    <>
                      <DropdownMenu.Label>Prepared for</DropdownMenu.Label>
                      {preparedClassIds.map(classId => (
                        <DropdownMenu.Item
                          key={`unprepare-${classId}`}
                          onSelect={() => handleUnprepareFromClass(classId)}
                        >
                          <span className="flex-1">{classId}</span>
                          <span className="text-text-tertiary text-xs ml-2">Unprepare</span>
                        </DropdownMenu.Item>
                      ))}
                      {matchingClassIds.length > preparedClassIds.length && (
                        <DropdownMenu.Separator />
                      )}
                    </>
                  )}
                  {matchingClassIds.length > preparedClassIds.length && (
                    <>
                      {preparedClassIds.length === 0 && (
                        <DropdownMenu.Label>Prepare for</DropdownMenu.Label>
                      )}
                      {matchingClassIds
                        .filter(classId => !preparedClassIds.includes(classId))
                        .map(classId => (
                          <DropdownMenu.Item
                            key={`prepare-${classId}`}
                            onSelect={() => handlePrepareForClass(classId)}
                          >
                            <span className="flex-1">{classId}</span>
                            <span className="text-text-tertiary text-xs ml-2">Prepare</span>
                          </DropdownMenu.Item>
                        ))}
                    </>
                  )}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            ) : (
              /* Single class - simple toggle */
              <IconButton
                variant="primary"
                active={isPrepared}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isPrepared) {
                    unprepareSpell(spell.id);
                  } else {
                    prepareSpell(spell.id);
                  }
                }}
                title={isPrepared ? 'Unprepare Spell' : 'Prepare Spell'}
              >
                <Star className={`w-3.5 h-3.5 ${isPrepared ? 'fill-current' : ''}`} />
              </IconButton>
            )
          )}
        </div>
      </div>
    </Surface>
  );
}
