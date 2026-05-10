import type { Spell } from 'open20-core';
import { useSpellStore } from '../../stores/spell-store';
import { Badge } from '../ui/Badge';

interface SpellCardProps {
  spell: Spell;
}

export function SpellCard({ spell }: SpellCardProps) {
  const { selectSpell } = useSpellStore();

  return (
    <button
      onClick={() => selectSpell(spell)}
      className="w-full text-left bg-bg-secondary border border-border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-text-primary group-hover:text-primary-600 transition-colors">
          {spell.name}
        </h3>
        <div className="flex gap-1">
          {spell.ritual && <Badge variant="info">R</Badge>}
          {spell.concentration && <Badge variant="warning">C</Badge>}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Badge variant={spell.level === 0 ? 'slate' : 'purple'}>
          {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`}
        </Badge>
        <span className="text-xs text-text-secondary">{spell.school}</span>
        <span className="text-xs text-text-tertiary ml-auto">
          {spell.components.join(', ')}
        </span>
      </div>
    </button>
  );
}
