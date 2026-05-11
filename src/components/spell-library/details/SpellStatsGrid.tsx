import type { Spell } from 'open20-core/browser';

interface SpellStatsGridProps {
  spell: Spell;
}

export function SpellStatsGrid({ spell }: SpellStatsGridProps) {
  const stats = [
    { label: 'Time', value: spell.castingTime },
    { label: 'Range', value: spell.range },
    { label: 'Duration', value: spell.duration },
    { 
      label: 'Components', 
      value: Array.isArray(spell.components) 
        ? spell.components.join(', ') 
        : typeof spell.components === 'object' && spell.components !== null
          ? Object.keys(spell.components).join(', ')
          : String(spell.components || 'None')
    },
    { label: 'Source', value: spell.source?.toUpperCase() || 'SRD' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      {stats.map((stat, i) => (
        <div key={i} className="p-3 bg-bg-secondary rounded-xl border border-border overflow-hidden">
          <div className="text-[10px] font-black text-text-tertiary uppercase tracking-widest mb-1 truncate">
            {stat.label}
          </div>
          <div className="text-xs font-bold text-text-primary break-words">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
}
