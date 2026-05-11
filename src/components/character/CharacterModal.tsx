import { useState, useEffect } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useCharacterStore } from '../../stores/character-store';
import { characterService } from '../../core/character-service';
import type { CharacterCreationParams } from '../../core/types';


const CLASSES = [
  'Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 
  'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'
];

const SPECIES = [
  'Human', 'Elf', 'Dwarf', 'Halfling', 'Dragonborn', 
  'Gnome', 'Tiefling', 'Orc', 'Goliath', 'Half-Elf', 'Half-Orc', 'Aasimar'
];

const BACKGROUNDS = [
  { id: 'acolyte', name: 'Acolyte' },
  { id: 'artisan', name: 'Artisan' },
  { id: 'charlatan', name: 'Charlatan' },
  { id: 'criminal', name: 'Criminal' },
  { id: 'entertainer', name: 'Entertainer' },
  { id: 'farmer', name: 'Farmer' },
  { id: 'guard', name: 'Guard' },
  { id: 'guide', name: 'Guide' },
  { id: 'hermit', name: 'Hermit' },
  { id: 'merchant', name: 'Merchant' },
  { id: 'noble', name: 'Noble' },
  { id: 'sage', name: 'Sage' },
  { id: 'sailor', name: 'Sailor' },
  { id: 'scribe', name: 'Scribe' },
  { id: 'soldier', name: 'Soldier' },
  { id: 'wayfarer', name: 'Wayfarer' }
];

export function CharacterModal({ 
  open, 
  onOpenChange, 
  characterId 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void,
  characterId?: string
}) {
  const { createCharacter, updateCharacter, characters } = useCharacterStore();
  const editingCharacter = characters.find(c => c.id === characterId);

  const [name, setName] = useState('');
  const [charClass, setCharClass] = useState('Wizard');
  const [level, setLevel] = useState(1);
  const [species, setSpecies] = useState('Human');
  const [background, setBackground] = useState('sage');
  const [abilities, setAbilities] = useState({
    Strength: 10,
    Dexterity: 10,
    Constitution: 10,
    Intelligence: 10,
    Wisdom: 10,
    Charisma: 10
  });
  const [additionalClasses, setAdditionalClasses] = useState<Array<{ classId: string; level: number }>>([]);

  const handleAbilityChange = (name: string, value: string) => {
    setAbilities(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  useEffect(() => {
    if (editingCharacter) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(editingCharacter.name);
      setCharClass(editingCharacter.classes[0]?.classId || 'Wizard');
      setLevel(editingCharacter.classes[0]?.level || 1);
      setSpecies(editingCharacter.species);
      setBackground(editingCharacter.background);
      
      const baseScores = editingCharacter.abilityScores.base;
      setAbilities({
        Strength: baseScores.Strength || 10,
        Dexterity: baseScores.Dexterity || 10,
        Constitution: baseScores.Constitution || 10,
        Intelligence: baseScores.Intelligence || 10,
        Wisdom: baseScores.Wisdom || 10,
        Charisma: baseScores.Charisma || 10
      });

      setAdditionalClasses(
        editingCharacter.classes.slice(1).map(c => ({
          classId: c.classId,
          level: c.level
        }))
      );
    } else {
      // Reset for creation
      setName('');
      setCharClass('Wizard');
      setLevel(1);
      setSpecies('Human');
      setBackground('sage');
      setAbilities({
        Strength: 10, Dexterity: 10, Constitution: 10, 
        Intelligence: 10, Wisdom: 10, Charisma: 10
      });
      setAdditionalClasses([]);
    }
  }, [editingCharacter, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params: CharacterCreationParams = {
      name,
      speciesId: species,
      backgroundId: background,
      classId: charClass,
      classLevel: level,
      abilityScores: abilities,
      additionalClasses: additionalClasses.length > 0 ? additionalClasses : undefined,
    };

    if (editingCharacter) {
      const rebuilt = characterService.createCharacter(params);
      updateCharacter({ ...rebuilt, id: editingCharacter.id });
    } else {
      createCharacter(params);
    }
    onOpenChange(false);
  };

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm transition-opacity" />
        <RadixDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-2rem)] max-w-2xl bg-bg-secondary p-8 rounded-3xl shadow-2xl z-50 border border-border animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto no-scrollbar">
          <div className="flex justify-between items-center mb-8">
            <RadixDialog.Title className="text-2xl font-black text-text-primary uppercase tracking-tight">
              {editingCharacter ? 'Edit Character' : 'Create Your Hero'}
            </RadixDialog.Title>
            <RadixDialog.Close asChild>
              <button className="p-2 hover:bg-bg-tertiary rounded-full transition-colors text-text-secondary hover:text-text-primary">
                <X className="w-6 h-6" />
              </button>
            </RadixDialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">Character Name</label>
                  <Input 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Melf the Archmage" 
                    required 
                    className="text-lg font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">Class</label>
                    <select value={charClass} onChange={(e) => setCharClass(e.target.value)} className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm font-medium">
                      {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">Level</label>
                    <Input type="number" min={1} max={20} value={level} onChange={(e) => setLevel(parseInt(e.target.value) || 1)} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">Species</label>
                    <select value={species} onChange={(e) => setSpecies(e.target.value)} className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm font-medium">
                      {SPECIES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-2">Background</label>
                    <select value={background} onChange={(e) => setBackground(e.target.value)} className="w-full bg-bg-primary border border-border rounded-xl px-3 py-2.5 text-sm font-medium">
                      {BACKGROUNDS.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Multiclass Section */}
                <div className="pt-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em]">Multiclass</label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setAdditionalClasses(prev => [...prev, { classId: 'Fighter', level: 1 }])}
                      className="h-7 text-[9px]"
                    >
                      + Add Class
                    </Button>
                  </div>
                  
                  {additionalClasses.map((ac, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-end bg-bg-primary/30 p-2 rounded-xl border border-border/50">
                      <div className="col-span-7">
                        <select 
                          value={ac.classId} 
                          onChange={(e) => {
                            const newClasses = [...additionalClasses];
                            newClasses[idx].classId = e.target.value;
                            setAdditionalClasses(newClasses);
                          }}
                          className="w-full bg-bg-primary border border-border rounded-lg px-2 py-1.5 text-xs font-medium"
                        >
                          {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="col-span-3">
                        <Input 
                          type="number" 
                          min={1} 
                          value={ac.level} 
                          onChange={(e) => {
                            const newClasses = [...additionalClasses];
                            newClasses[idx].level = parseInt(e.target.value) || 1;
                            setAdditionalClasses(newClasses);
                          }}
                          className="h-8 px-2 py-1 text-xs"
                        />
                      </div>
                      <div className="col-span-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => setAdditionalClasses(prev => prev.filter((_, i) => i !== idx))}
                          className="h-8 w-full text-danger hover:text-danger hover:bg-danger/10"
                        >
                          <X className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-bg-primary/50 p-6 rounded-2xl border border-border shadow-inner">
                <label className="block text-[10px] font-black text-text-tertiary uppercase tracking-[0.2em] mb-6 text-center">Ability Scores</label>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                  {Object.keys(abilities).map((ability) => (
                    <div key={ability}>
                      <label className="block text-[10px] font-bold text-text-secondary uppercase mb-1">{ability.substring(0, 3)}</label>
                      <Input 
                        type="number" 
                        min={1} 
                        max={30} 
                        value={abilities[ability as keyof typeof abilities]} 
                        onChange={(e) => handleAbilityChange(ability, e.target.value)}
                        className="text-center font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
              <RadixDialog.Close asChild>
                <Button variant="ghost" size="lg">Cancel</Button>
              </RadixDialog.Close>
              <Button type="submit" variant="primary" size="lg" disabled={!name}>
                {editingCharacter ? 'Save Changes' : 'Summon Hero'}
              </Button>
            </div>
          </form>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}
