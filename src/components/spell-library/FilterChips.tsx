import { useSpellStore } from '../../stores/spell-store';
import { FilterChip } from '../ui/FilterChip';

const CLASSES = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
const SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];

export function FilterChips() {
  const { 
    selectedClasses, toggleClassFilter,
    selectedSchools, toggleSchoolFilter,
    showRitualOnly, setShowRitualOnly,
    showConcentrationOnly, setShowConcentrationOnly,
    clearAllFilters
  } = useSpellStore();

  const activeFilterCount = selectedClasses.length + selectedSchools.length 
    + (showRitualOnly ? 1 : 0) + (showConcentrationOnly ? 1 : 0);

  return (
    <div className="py-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-primary-500 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </h3>
        {activeFilterCount > 0 && (
          <button 
            onClick={clearAllFilters}
            className="text-xs text-text-secondary hover:text-danger transition-colors duration-200 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase mb-2">Properties</h4>
        <div className="flex flex-wrap gap-2">
          <FilterChip 
            variant={showRitualOnly ? 'info' : 'slate'}
            active={showRitualOnly}
            onClick={() => setShowRitualOnly(!showRitualOnly)}
          >
            Ritual
          </FilterChip>
          <FilterChip 
            variant={showConcentrationOnly ? 'warning' : 'slate'}
            active={showConcentrationOnly}
            onClick={() => setShowConcentrationOnly(!showConcentrationOnly)}
          >
            Concentration
          </FilterChip>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase mb-2">Classes</h4>
        <div className="max-h-32 overflow-y-auto pr-1 space-y-2 scrollbar-custom">
          <div className="flex flex-wrap gap-2">
            {CLASSES.map(cls => (
              <FilterChip 
                key={cls}
                variant={selectedClasses.includes(cls) ? 'purple' : 'slate'}
                active={selectedClasses.includes(cls)}
                onClick={() => toggleClassFilter(cls)}
              >
                {cls}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase mb-2">Schools</h4>
        <div className="max-h-32 overflow-y-auto pr-1 space-y-2 scrollbar-custom">
          <div className="flex flex-wrap gap-2">
            {SCHOOLS.map(school => (
              <FilterChip 
                key={school}
                variant={selectedSchools.includes(school) ? 'purple' : 'slate'}
                active={selectedSchools.includes(school)}
                onClick={() => toggleSchoolFilter(school)}
              >
                {school}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
