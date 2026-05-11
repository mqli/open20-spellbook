import * as RadixDialog from '@radix-ui/react-dialog';
import { X, ArrowLeft, Activity } from 'lucide-react';
import { 
  rollDiceExpression,
  defaultRandom,
} from 'open20-core/browser';
import { useSpellStore } from '../../stores/spell-store';
import { useCharacterStore } from '../../stores/character-store';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useRollStore } from '../../stores/roll-store';

export function SpellDetailFlyout() {
  const { selectedSpell, isDetailOpen, closeDetail } = useSpellStore();
  const { activeCharacter, prepareSpell, unprepareSpell, learnSpell, unlearnSpell, startConcentration, endConcentration } = useCharacterStore();
  const { addRoll } = useRollStore();

  if (!selectedSpell) return null;

  const isKnown = activeCharacter?.spells?.knownSpells?.includes(selectedSpell.id) ?? false;
  const isPrepared = activeCharacter?.spells?.preparedSpells?.includes(selectedSpell.id) ?? false;
  const isClassSpell = activeCharacter
    ? (selectedSpell.classes?.includes(activeCharacter.classes[0]?.classId) ?? false)
    : false;
  const isConcentratingOnThis = activeCharacter?.conditions.some(
    c => c.id === 'Concentrating' && (c as any).source === selectedSpell.id
  ) ?? false;

  const handleLearnToggle = () => {
    if (isKnown) {
      unlearnSpell(selectedSpell.id);
    } else {
      learnSpell(selectedSpell.id);
    }
  };

  const handlePrepareToggle = () => {
    if (isPrepared) {
      unprepareSpell(selectedSpell.id);
    } else {
      prepareSpell(selectedSpell.id);
    }
  };

  const handleConcentrationToggle = () => {
    if (isConcentratingOnThis) {
      endConcentration();
    } else {
      startConcentration(selectedSpell.id);
    }
  };

  const handleRoll = (expression: string, label: string) => {
    const result = rollDiceExpression(defaultRandom, expression);
    addRoll({
      label,
      expression,
      total: result.total
    });
  };

  return (
    <RadixDialog.Root open={isDetailOpen} onOpenChange={(open) => !open && closeDetail()}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/35 z-40 transition-opacity" />
        <RadixDialog.Content
          className={`
            fixed z-50 bg-bg-secondary flex flex-col shadow-xl transition-transform duration-300
            w-full h-[85vh] bottom-0 left-0 rounded-t-2xl
            md:w-[540px] md:h-full md:top-0 md:right-0 md:bottom-auto md:left-auto md:rounded-none
          `}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-bg-primary md:bg-bg-secondary rounded-t-2xl md:rounded-none sticky top-0">
            <button onClick={closeDetail} className="p-2 hover:bg-bg-tertiary rounded-md md:hidden">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <div className="w-12 h-1.5 bg-border rounded-full mx-auto md:hidden" /> {/* Drag Handle */}
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-sm font-medium text-text-secondary">Spell Library</div>
              
              {selectedSpell.concentration && activeCharacter && (
                <button
                  onClick={handleConcentrationToggle}
                  className={`
                    flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border
                    ${isConcentratingOnThis 
                      ? 'bg-warning text-white border-warning shadow-md' 
                      : 'bg-bg-tertiary text-text-tertiary hover:bg-warning/10 hover:text-warning border-border'}
                  `}
                >
                  <Activity className={`w-3.5 h-3.5 ${isConcentratingOnThis ? 'animate-pulse' : ''}`} />
                  <span>{isConcentratingOnThis ? 'Concentrating' : 'Concentrate'}</span>
                </button>
              )}

              {/* Learn toggle */}
              {isClassSpell && (
                <button
                  onClick={handleLearnToggle}
                  className={`
                    text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-all border
                    ${isKnown 
                      ? 'bg-info text-white border-info shadow-md' 
                      : 'bg-bg-tertiary text-text-tertiary hover:bg-info/10 hover:text-info border-border'}
                  `}
                >
                  {isKnown ? 'Known ✓' : 'Learn Spell'}
                </button>
              )}

              {/* Prepare toggle — only if known (or cantrip) */}
              {isClassSpell && (isKnown || selectedSpell.level === 0) && (
                <button
                  onClick={handlePrepareToggle}
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
            <RadixDialog.Close asChild>
              <button className="p-2 hover:bg-bg-tertiary rounded-md">
                <X className="w-5 h-5 text-text-secondary" />
              </button>
            </RadixDialog.Close>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-bg-primary h-full">
            <div className="mb-6">
              <RadixDialog.Title className="text-2xl md:text-[26px] font-medium text-text-primary mb-2">
                {selectedSpell.name}
              </RadixDialog.Title>
              <div className="flex gap-2">
                <Badge variant={selectedSpell.level === 0 ? 'slate' : 'purple'}>
                  {selectedSpell.level === 0 ? 'Cantrip' : `Level ${selectedSpell.level}`}
                </Badge>
                <Badge variant="slate">{selectedSpell.school}</Badge>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="p-3 bg-bg-secondary rounded-xl border border-border overflow-hidden">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 truncate">Time</div>
                <div className="text-xs font-bold text-text-primary break-words">{selectedSpell.castingTime}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-xl border border-border overflow-hidden">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 truncate">Range</div>
                <div className="text-xs font-bold text-text-primary break-words">{selectedSpell.range}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-xl border border-border overflow-hidden">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 truncate">Duration</div>
                <div className="text-xs font-bold text-text-primary break-words">{selectedSpell.duration}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-xl border border-border overflow-hidden">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 truncate">Components</div>
                <div className="text-xs font-bold text-text-primary break-words">{selectedSpell.components.join(', ')}</div>
              </div>
              <div className="p-3 bg-bg-secondary rounded-xl border border-border overflow-hidden">
                <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 truncate">Source</div>
                <div className="text-xs font-bold text-text-primary break-words uppercase">{selectedSpell.source}</div>
              </div>
            </div>

            {/* Quick Actions (Rolls) */}
            {(selectedSpell.attack || selectedSpell.damage) && (
              <div className="mb-8 p-6 bg-primary-500/5 rounded-2xl border border-primary-500/10 flex flex-wrap gap-4 items-center">
                <div className="text-xs font-black text-primary-700 uppercase tracking-widest mr-2">Quick Cast</div>
                
                {selectedSpell.attack && (
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="shadow-lg shadow-primary-500/20"
                    onClick={() => handleRoll(`1d20 + ${activeCharacter?.spells?.spellAttackBonus ?? 0}`, 'Attack')}
                  >
                    Roll Attack (+{activeCharacter?.spells?.spellAttackBonus ?? 0})
                  </Button>
                )}
                
                {selectedSpell.damage?.entries.map((entry, i) => (
                  <Button 
                    key={i} 
                    variant="secondary" 
                    size="sm" 
                    className="border-primary-200 text-primary-700 hover:bg-primary-100"
                    onClick={() => handleRoll(entry.dice, `${entry.type} Damage`)}
                  >
                    Roll {entry.dice} {entry.type}
                  </Button>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
              <p className="text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
                {selectedSpell.description}
              </p>
            </div>

            {selectedSpell.upcast && (
              <div className="pl-4 border-l-4 border-primary-400 mb-6 py-1">
                <div className="text-xs text-text-secondary uppercase font-medium mb-1">At Higher Levels</div>
                <p className="text-sm text-text-primary">{selectedSpell.upcast}</p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <div className="text-xs text-text-secondary uppercase font-medium mb-2">Classes</div>
              <div className="flex flex-wrap gap-2">
                {selectedSpell.classes?.map(c => (
                  <Badge key={c} variant="slate">{c}</Badge>
                ))}
              </div>
            </div>
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
