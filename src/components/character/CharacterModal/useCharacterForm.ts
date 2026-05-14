import { useState, useEffect, useCallback } from 'react';
import type { Character } from '@/core/types';
import { DEFAULT_ABILITIES, generateAdditionalClassId } from './constants';
import type { CharacterFormData } from './types';

interface UseCharacterFormProps {
  editingCharacter?: Character;
  open: boolean;
}

interface UseCharacterFormReturn {
  formData: CharacterFormData;
  setFormData: React.Dispatch<React.SetStateAction<CharacterFormData>>;
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  populateFormFromCharacter: (character: Character) => void;
  resetForm: () => void;
}

export function useCharacterForm({ 
  editingCharacter, 
  open 
}: UseCharacterFormProps): UseCharacterFormReturn {
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    charClass: 'Wizard',
    level: 1,
    species: 'Human',
    background: 'sage',
    abilities: { ...DEFAULT_ABILITIES },
    subclassId: '',
    additionalClasses: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset or populate form when modal opens/changes
  useEffect(() => {
    if (!open) return;
    
    if (editingCharacter) {
      populateFormFromCharacter(editingCharacter);
    } else {
      resetForm();
    }
  }, [editingCharacter, open]);

  const populateFormFromCharacter = useCallback((character: Character) => {
    setFormData(prev => ({
      ...prev,
      name: character.name,
      charClass: character.classes[0]?.classId || 'Wizard',
      level: character.classes[0]?.level || 1,
      subclassId: character.classes[0]?.subclassId ?? '',
      species: character.species,
      background: character.background,
      abilities: {
        Strength: character.abilityScores.base.Strength || 10,
        Dexterity: character.abilityScores.base.Dexterity || 10,
        Constitution: character.abilityScores.base.Constitution || 10,
        Intelligence: character.abilityScores.base.Intelligence || 10,
        Wisdom: character.abilityScores.base.Wisdom || 10,
        Charisma: character.abilityScores.base.Charisma || 10
      },
      additionalClasses: character.classes.slice(1).map(c => ({
        id: generateAdditionalClassId(),
        classId: c.classId,
        level: c.level,
        subclassId: c.subclassId ?? undefined
      }))
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      charClass: 'Wizard',
      level: 1,
      subclassId: '',
      species: 'Human',
      background: 'sage',
      abilities: { ...DEFAULT_ABILITIES },
      additionalClasses: []
    });
  }, []);

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    populateFormFromCharacter,
    resetForm
  };
}
