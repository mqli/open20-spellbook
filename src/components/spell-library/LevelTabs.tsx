import { useSpellStore } from '../../stores/spell-store';

const LEVELS = [
  { value: null, label: 'All' },
  { value: 0, label: 'Cantrip' },
  { value: 1, label: 'L1' },
  { value: 2, label: 'L2' },
  { value: 3, label: 'L3' },
  { value: 4, label: 'L4' },
  { value: 5, label: 'L5' },
  { value: 6, label: 'L6' },
  { value: 7, label: 'L7' },
  { value: 8, label: 'L8' },
  { value: 9, label: 'L9' },
];

export function LevelTabs() {
  const { selectedLevel, setSelectedLevel } = useSpellStore();

  return (
    <div className="flex gap-1 overflow-x-auto py-1.5 no-scrollbar">
      {LEVELS.map(({ value, label }) => {
        const isActive = selectedLevel === value;
        return (
          <button
            key={label}
            onClick={() => setSelectedLevel(value)}
            className={`
              flex-shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium transition-all whitespace-nowrap
              ${isActive
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-primary hover:text-text-primary border border-border'
              }
            `}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
