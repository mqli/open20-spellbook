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
    <div className="flex w-full overflow-x-auto border-b border-border hide-scrollbar">
      {LEVELS.map(({ value, label }) => {
        const isActive = selectedLevel === value;
        return (
          <button
            key={label}
            onClick={() => setSelectedLevel(value)}
            className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 whitespace-nowrap
              ${isActive 
                ? 'border-primary-600 text-primary-600' 
                : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
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
