import { useSpellStore } from '../../stores/spell-store';
import { FilterChip } from '../ui/FilterChip';
import { Button } from '../ui/Button';
import { dataLoader } from '../../core/data-loader';

const CLASSES = dataLoader.getAllClasses().filter(c => !!c.spellcasting).map(c => c.id);
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
    <div className="py-2 space-y-3">
      {activeFilterCount > 0 && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-text-secondary hover:text-danger"
          >
            Clear{activeFilterCount > 1 ? ` ${activeFilterCount} filters` : ' filter'}
          </Button>
        </div>
      )}

      <div>
        <div className="flex flex-wrap gap-2">
          <FilterChip 
            variant={showRitualOnly ? 'info' : 'slate'}
            active={showRitualOnly}
            onPressedChange={(pressed) => setShowRitualOnly(pressed)}
          >
            Ritual
          </FilterChip>
          <FilterChip 
            variant={showConcentrationOnly ? 'warning' : 'slate'}
            active={showConcentrationOnly}
            onPressedChange={(pressed) => setShowConcentrationOnly(pressed)}
          >
            Concentration
          </FilterChip>
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Classes</h4>
        <div className="max-h-28 overflow-y-auto pr-1 scrollbar-custom">
          <div className="flex flex-wrap gap-1.5">
            {CLASSES.map(cls => (
              <FilterChip 
                key={cls}
                variant={selectedClasses.includes(cls) ? 'purple' : 'slate'}
                active={selectedClasses.includes(cls)}
                onPressedChange={() => toggleClassFilter(cls)}
                size="sm"
              >
                {cls}
              </FilterChip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-[10px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">Schools</h4>
        <div className="max-h-28 overflow-y-auto pr-1 scrollbar-custom">
          <div className="flex flex-wrap gap-1.5">
            {SCHOOLS.map(school => (
              <FilterChip 
                key={school}
                variant={selectedSchools.includes(school) ? 'purple' : 'slate'}
                active={selectedSchools.includes(school)}
                onPressedChange={() => toggleSchoolFilter(school)}
                size="sm"
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
