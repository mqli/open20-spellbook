import { useState } from 'react';
import { useCharacterStore } from '../../stores/character-store';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { CharacterModal } from './CharacterModal';
import { CharacterSheet } from './CharacterSheet';
import { Plus, User, Moon, FileText } from 'lucide-react';

export function CharacterBar() {
  const { characters, activeCharacter, setActiveCharacter, longRest } = useCharacterStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();

  const handleCreate = () => {
    setEditingId(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
    setIsSheetOpen(false);
  };

  const handleOpenSheet = (char: any) => {
    setActiveCharacter(char);
    setIsSheetOpen(true);
  };

  return (
    <div className="bg-bg-secondary border-b border-border px-4 py-2 flex items-center justify-between overflow-hidden">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
        {characters.map(char => (
          <div key={char.id} className="relative group">
            <button
              onClick={() => setActiveCharacter(char)}
              className={`
                flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all border whitespace-nowrap pr-8
                ${activeCharacter?.id === char.id 
                  ? 'bg-bg-primary border-primary-400 shadow-sm' 
                  : 'bg-transparent border-transparent hover:bg-bg-tertiary text-text-secondary'}
              `}
            >
              <User className={`w-3.5 h-3.5 ${activeCharacter?.id === char.id ? 'text-primary-500' : ''}`} />
              <span className="text-sm font-bold">{char.name}</span>
              <Badge variant="slate" size="sm" className="opacity-70 font-black">
                Lvl {char.classes?.[0]?.level ?? 1}
              </Badge>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); handleOpenSheet(char); }}
              className={`
                absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all
                ${activeCharacter?.id === char.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                hover:bg-bg-tertiary text-text-tertiary hover:text-primary-600
              `}
            >
              <FileText className="w-3 h-3" />
            </button>
          </div>
        ))}

        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-dashed border-border hover:border-primary-400 hover:bg-bg-tertiary transition-all group whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5 text-text-tertiary group-hover:text-primary-500" />
          <span className="text-sm font-medium text-text-tertiary group-hover:text-text-primary">Add</span>
        </button>
      </div>

      {activeCharacter && (
        <div className="flex items-center gap-6 ml-4 flex-shrink-0">
          <div className="flex gap-4 cursor-pointer hover:bg-bg-tertiary p-1 rounded-lg transition-colors" onClick={() => setIsSheetOpen(true)}>
            <div className="text-center">
              <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Spell DC</div>
              <div className="text-sm font-bold text-primary-600">{activeCharacter.spells?.spellSaveDC ?? 0}</div>
            </div>
            <div className="text-center">
              <div className="text-[9px] font-black text-text-tertiary uppercase tracking-widest">Attack</div>
              <div className="text-sm font-bold text-primary-600">+{activeCharacter.spells?.spellAttackBonus ?? 0}</div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => longRest()}
            className="text-text-secondary hover:text-primary-600 h-8 px-2"
          >
            <Moon className="w-4 h-4 md:mr-2" />
            <span className="hidden md:inline">Long Rest</span>
          </Button>
        </div>
      )}

      <CharacterModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen} 
        characterId={editingId} 
      />

      <CharacterSheet 
        open={isSheetOpen} 
        onOpenChange={setIsSheetOpen} 
        onEdit={() => handleEdit(activeCharacter?.id!)} 
      />
    </div>
  );
}
