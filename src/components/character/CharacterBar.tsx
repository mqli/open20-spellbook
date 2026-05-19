import { useState } from 'react';
import { useCharacterStore } from '../../stores/character-store';
import type { AppCharacter } from '../../core/types';
import { dataLoader } from '../../core/data-loader';
import { Button } from '../ui/Button';
import { IconButton } from '../ui/IconButton';
import { Surface } from '../ui/Surface';
import { Text } from '../ui/Text';
import { DropdownMenu } from '../ui/DropdownMenu';
import { SlotPips } from '../ui/SlotPips';
import { CharacterModal } from './CharacterModal';
import { CharacterSheet } from './CharacterSheet';
import { Plus, User, Moon, FileText, ChevronDown, ChevronRight } from 'lucide-react';

const CLASS_NAME_MAP = Object.fromEntries(
  dataLoader.getAllClasses().map(c => [c.id, c.name || c.id])
);

function formatClassInfo(
  classes: readonly { classId: string; level: number }[] | undefined
): string {
  if (!classes || classes.length === 0) return 'Lvl 1';
  return classes
    .map(c => `${CLASS_NAME_MAP[c.classId] ?? c.classId} ${c.level}`)
    .join(' / ');
}

export function CharacterBar() {
  const { characters, activeCharacter, setActiveCharacter, longRest, consumeSpellSlot, recoverSpellSlot } = useCharacterStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCreate = () => {
    setEditingId(undefined);
    setIsDropdownOpen(false);
    requestAnimationFrame(() => setIsModalOpen(true));
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setIsDropdownOpen(false);
    setIsSheetOpen(false);
    requestAnimationFrame(() => setIsModalOpen(true));
  };

  const handleSelect = (char: AppCharacter) => {
    setActiveCharacter(char);
  };

  const displayChar = activeCharacter;
  const classInfo = formatClassInfo(activeCharacter?.classes);

  // Get spellcasting stats from the primary spellcasting class
  // TODO: clarify business rule for "primary" (e.g., highest level class, or explicit primaryClassId field)
  const primaryClassSpells = activeCharacter?.spells?.classSpellcasting
    ? Object.values(activeCharacter.spells.classSpellcasting)[0]
    : undefined;
  const spellSaveDC = primaryClassSpells?.spellSaveDC ?? 0;
  const spellAttackBonus = primaryClassSpells?.spellAttackBonus ?? 0;

  const hasSpellcasting = spellSaveDC > 0 || spellAttackBonus > 0;

  return (
    <Surface variant="default" className="border-b rounded-none px-3 py-1.5 flex items-center justify-between gap-2">
      {/* Left: active character + dropdown */}
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1.5 border border-primary-400 bg-bg-primary shadow-sm"
          >
            <User className="w-3 h-3 text-primary-500" />
            <Text weight="bold" size="sm" color="primary" className="whitespace-nowrap">
              {displayChar ? displayChar.name : 'No character'}
            </Text>
            {displayChar && (
              <Text variant="label" className="ml-0.5">
                {classInfo}
              </Text>
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
              <Text variant="label">
                {formatClassInfo(char.classes)}
              </Text>
              <IconButton
                variant="secondary"
                size="sm"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleEdit(char.id); }}
                className="hover:text-primary-600 ml-1"
              >
                <FileText className="w-2.5 h-2.5" />
              </IconButton>
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
          {hasSpellcasting && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSheetOpen(true)}
              className="flex items-center gap-1.5 sm:gap-3 text-center border border-transparent hover:border-primary-200 hover:bg-primary-50/50 transition-colors"
              title="Open character sheet"
            >
              <div>
                <Text variant="label" className="mb-0.5">DC</Text>
                <Text weight="bold" size="sm" color="accent">{spellSaveDC}</Text>
              </div>
              {spellAttackBonus > 0 && (
                <div className="hidden sm:block">
                  <Text variant="label" className="mb-0.5">ATK</Text>
                  <Text weight="bold" size="sm" color="accent">+{spellAttackBonus}</Text>
                </div>
              )}
              <ChevronRight className="w-3 h-3 text-text-tertiary opacity-60" />
            </Button>
          )}

          {/* Spell Slots using SlotPips — sorted by level ascending */}
          {activeCharacter.spells?.spellSlots &&
            Object.entries(activeCharacter.spells.spellSlots)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, slot]) => {
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
            <Text size="sm" className="hidden md:inline">Rest</Text>
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
