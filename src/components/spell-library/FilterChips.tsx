import { useSpellStore } from '../../stores/spell-store';
import { Badge } from '../ui/Badge';

const CLASSES = ['Artificer', 'Bard', 'Cleric', 'Druid', 'Paladin', 'Ranger', 'Sorcerer', 'Warlock', 'Wizard'];
const SCHOOLS = ['Abjuration', 'Conjuration', 'Divination', 'Enchantment', 'Evocation', 'Illusion', 'Necromancy', 'Transmutation'];

export function FilterChips() {
  const { 
    selectedClasses, toggleClassFilter,
    selectedSchools, toggleSchoolFilter,
    showRitualOnly, setShowRitualOnly,
    showConcentrationOnly, setShowConcentrationOnly
  } = useSpellStore();

  return (
    <div className="py-4 space-y-4 border-b border-border mb-4">
      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase mb-2">Properties</h4>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setShowRitualOnly(!showRitualOnly)}>
            <Badge variant={showRitualOnly ? 'info' : 'slate'}>Ritual</Badge>
          </button>
          <button onClick={() => setShowConcentrationOnly(!showConcentrationOnly)}>
            <Badge variant={showConcentrationOnly ? 'warning' : 'slate'}>Concentration</Badge>
          </button>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase mb-2">Classes</h4>
        <div className="flex flex-wrap gap-2">
          {CLASSES.map(cls => (
            <button key={cls} onClick={() => toggleClassFilter(cls)}>
              <Badge variant={selectedClasses.includes(cls) ? 'purple' : 'slate'}>{cls}</Badge>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-medium text-text-secondary uppercase mb-2">Schools</h4>
        <div className="flex flex-wrap gap-2">
          {SCHOOLS.map(school => (
            <button key={school} onClick={() => toggleSchoolFilter(school)}>
              <Badge variant={selectedSchools.includes(school) ? 'purple' : 'slate'}>{school}</Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
