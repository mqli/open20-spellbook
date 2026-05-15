import { useState } from 'react';
import { useCharacterStore } from '../../stores/character-store';
import type { AppCharacter } from '../../core/types';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Surface } from '../ui/Surface';
import { DropdownMenu } from '../ui/DropdownMenu';
import { SlotPips } from '../ui/SlotPips';
import { CharacterModal } from './CharacterModal';
import { CharacterSheet } from './CharacterSheet';
import { Plus, User, Moon, FileText, ChevronDown } from 'lucide-react';

export function CharacterBar() {
  const { characters, activeCharacter, setActiveCharacter, longRest, consumeSpellSlot, recoverSpellSlot } = useCharacterStore();
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

  const handleSelect = (char: AppCharacter) => {
    setActiveCharacter(char);
  };

  const displayChar = activeCharacter ?? characters[0];

  // Get spellcasting stats from the primary spellcasting class
  const primaryClassSpells = activeCharacter?.spells?.classSpellcasting
    ? Object.values(activeCharacter.spells.classSpellcasting)[0]
    : undefined;
  const spellSaveDC = primaryClassSpells?.spellSaveDC ?? 0;
  const spellAttackBonus = primaryClassSpells?.spellAttackBonus ?? 0;

  return (
    <Surface variant="default" className="border-b rounded-none px-3 py-1.5 flex items-center justify-between gap-2">
      {/* Left: active character + dropdown */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 border border-primary-400 bg-bg-primary shadow-sm"
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
            <ChevronDown className="w-3 h-3 text-text-tertiary" />
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content className="w-48">
          {characters.map(char => (
            <DropdownMenu.Item
              key={char.id}
              onSelect={() => handleSelect(char)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm"
            >
              <User className="w-3 h-3 flex-shrink-0" />
              <span className="flex-1 truncate">{char.name}</span>
              <span className="text-[9px] font-black text-text-tertiary uppercase">
                Lvl {char.classes?.[0]?.level ?? 1}
              </span>
              {activeCharacter?.id === char.id && (
                <IconButton
                  variant="default"
                  size="sm"
                  onClick={(e) => { e.stopPropagation(); handleEdit(char.id); }}
                  className="hover:text-primary-600"
                >
                  <FileText className="w-2.5 h-2.5" />
                </IconButton>
              )}
            </DropdownMenu.Item>
          ))}
          <DropdownMenu.Separator />
          <DropdownMenu.Item onSelect={handleCreate}>
            <Plus className="w-3 h-3 mr-2" />
            Add character
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      {/* Right: stats + slots + long rest */}
      {activeCharacter && (
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSheetOpen(true)}
            className="hidden sm:flex gap-3 text-center"
          >
            <div>
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">DC</div>
              <div className="text-xs font-bold text-primary-600">{spellSaveDC}</div>
            </div>
            <div>
              <div className="text-[8px] font-black text-text-tertiary uppercase tracking-widest">ATK</div>
              <div className="text-xs font-bold text-primary-600">+{spellAttackBonus}</div>
            </div>
          </Button>

          {/* Spell Slots using SlotPips */}
          {activeCharacter.spells?.spellSlots &&
            Object.entries(activeCharacter.spells.spellSlots).map(([level, slot]) => {
              const lvl = parseInt(level);
              if (lvl === 0 || slot.total === 0) return null;
              return (
                <SlotPips
                  key={level}
                  total={slot.total}
                  used={slot.used}
                  onPipClick={(_index, isUsed) => isUsed ? recoverSpellSlot(lvl) : consumeSpellSlot(lvl)}
                />
              );
            })}

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
    </Surface>
  );
}
