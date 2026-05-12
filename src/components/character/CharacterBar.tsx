import { useState, useRef, useEffect } from 'react';
import { useCharacterStore } from '../../stores/character-store';
import type { AppCharacter } from '../../core/types';
import { Button } from '../ui/Button';
import { CharacterModal } from './CharacterModal';
import { CharacterSheet } from './CharacterSheet';
import { Plus, User, Moon, FileText, ChevronDown } from 'lucide-react';

interface SlotState {
  total: number;
  used: number;
}

function SpellSlots({ activeCharacter }: { activeCharacter: AppCharacter }) {
  const { consumeSpellSlot, recoverSpellSlot } = useCharacterStore();
  const slots = activeCharacter.spells?.spellSlots;
  if (!slots) return null;

  return (
    <div className="flex items-center gap-2">
      {Object.entries(slots).map(([level, slot]) => {
        const spellSlot = slot as SlotState;
        const lvl = parseInt(level);
        if (lvl === 0 || spellSlot.total === 0) return null;
        const remaining = spellSlot.total - spellSlot.used;
        return (
          <div key={level} className="flex items-center gap-0.5" title={`Level ${level}: ${remaining}/${spellSlot.total}`}>
            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest mr-0.5">L{lvl}</span>
            {Array.from({ length: spellSlot.total }).map((_, i) => (
              <button
                key={i}
                onClick={() => i < remaining ? consumeSpellSlot(lvl) : recoverSpellSlot(lvl)}
                className={`w-2.5 h-2.5 rounded-sm border transition-all ${
                  i < remaining
                    ? 'bg-primary-500 border-primary-600'
                    : 'bg-bg-tertiary border-border opacity-30'
                }`}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export function CharacterBar() {
  const { characters, activeCharacter, setActiveCharacter, longRest } = useCharacterStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleCreate = () => {
    setEditingId(undefined);
    setIsModalOpen(true);
    setDropdownOpen(false);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsModalOpen(true);
    setIsSheetOpen(false);
    setDropdownOpen(false);
  };

  const handleSelect = (char: AppCharacter) => {
    setActiveCharacter(char);
    setDropdownOpen(false);
  };

  const displayChar = activeCharacter ?? characters[0];

  return (
    <div className="bg-bg-secondary border-b border-border px-3 py-1.5 flex items-center justify-between gap-2">
      {/* Left: active character + dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(v => !v)}
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg border border-primary-400 bg-bg-primary shadow-sm text-sm transition-all hover:bg-bg-tertiary"
        >
          <User className="w-3 h-3 text-primary-500" />
          <span className="font-bold text-xs text-text-primary whitespace-nowrap">
            {displayChar ? displayChar.name : 'No character'}
          </span>
          {displayChar && (
            <span className="text-[9px] font-black text-text-tertiary uppercase tracking-widest ml-0.5">
              Lvl {displayChar.classes?.[0]?.level ?? 1}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 text-text-tertiary transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {dropdownOpen && (
          <div className="absolute left-0 top-full mt-1 z-50 w-48 bg-bg-primary border border-border rounded-xl shadow-lg py-1 max-h-64 overflow-y-auto">
            {characters.map(char => (
              <button
                key={char.id}
                onClick={() => handleSelect(char)}
                className={`
                  w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors
                  ${activeCharacter?.id === char.id
                    ? 'bg-primary-50 text-primary-700 font-bold'
                    : 'text-text-secondary hover:bg-bg-tertiary'}
                `}
              >
                <User className="w-3 h-3 flex-shrink-0" />
                <span className="flex-1 truncate">{char.name}</span>
                <span className="text-[9px] font-black text-text-tertiary uppercase">Lvl {char.classes?.[0]?.level ?? 1}</span>
                {activeCharacter?.id === char.id && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(char.id); }}
                    className="p-0.5 rounded hover:bg-bg-tertiary text-text-tertiary hover:text-primary-600"
                  >
                    <FileText className="w-2.5 h-2.5" />
                  </button>
                )}
              </button>
            ))}

            <div className="border-t border-border mt-1 pt-1">
              <button
                onClick={handleCreate}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left text-xs text-text-tertiary hover:bg-bg-tertiary hover:text-primary-600 transition-colors"
              >
                <Plus className="w-3 h-3" />
                Add character
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right: stats + slots + long rest */}
      {activeCharacter && (
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            className="hidden sm:flex gap-3 text-center cursor-pointer hover:bg-bg-tertiary px-1.5 py-0.5 rounded transition-colors"
            onClick={() => setIsSheetOpen(true)}
          >
            <div>
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">DC</div>
              <div className="text-xs font-bold text-primary-600">{activeCharacter.spells?.spellSaveDC ?? 0}</div>
            </div>
            <div>
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">ATK</div>
              <div className="text-xs font-bold text-primary-600">+{activeCharacter.spells?.spellAttackBonus ?? 0}</div>
            </div>
          </button>

          <SpellSlots activeCharacter={activeCharacter} />

          <Button
            variant="ghost"
            size="sm"
            onClick={() => longRest()}
            className="text-text-secondary hover:text-primary-600 h-7 px-1.5"
          >
            <Moon className="w-3.5 h-3.5 md:mr-1" />
            <span className="hidden md:inline text-xs">Rest</span>
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
        onEdit={() => {
          if (activeCharacter) handleEdit(activeCharacter.id);
        }}
      />
    </div>
  );
}
