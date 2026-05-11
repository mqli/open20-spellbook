import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// Mock open20-core/browser - fixes ESM import issues with missing .js extensions
// This must be at the top level so Vitest hoists it before any imports
vi.mock('open20-core/browser', () => ({
  createBrowserDataLoader: vi.fn((data: any) => data),
  createCharacter: vi.fn((params: any) => ({
    id: params.id || 'test-char-id',
    name: params.name || 'Test Character',
    speciesId: params.speciesId || 'Human',
    backgroundId: params.backgroundId || 'sage',
    classes: [{ classId: params.classId || 'Wizard', level: params.classLevel || 1, subclassId: undefined }],
    abilityScores: {
      base: params.abilityScores || { Strength: 10, Dexterity: 10, Constitution: 10, Intelligence: 10, Wisdom: 10, Charisma: 10 },
      racialBonuses: {},
      featBonuses: {},
      temporaryBonuses: {}
    },
    hitPoints: { current: 8, max: 8, temporary: 0 },
    hitDice: { total: 1, used: 0 },
    conditions: [],
    resources: [],
    inventory: [],
    equipment: { weapons: [], armor: [], shield: null, items: [] },
    currency: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    notes: [],
    spells: {
      knownSpells: [],
      preparedSpells: [],
      spellSaveDC: 13,
      spellAttackBonus: 5,
      spellcastingAbility: 'Intelligence',
      spellSlots: {
        1: { total: 2, used: 0 },
        2: { total: 0, used: 0 },
        3: { total: 0, used: 0 },
        4: { total: 0, used: 0 },
        5: { total: 0, used: 0 },
        6: { total: 0, used: 0 },
        7: { total: 0, used: 0 },
        8: { total: 0, used: 0 },
        9: { total: 0, used: 0 },
      },
    },
    updatedAt: new Date().toISOString(),
  })),
  prepareSpell: vi.fn((char: any, spellId: string) => ({
    ...char,
    spells: { ...char.spells, preparedSpells: [...char.spells.preparedSpells, spellId] },
  })),
  unprepareSpell: vi.fn((char: any, spellId: string) => ({
    ...char,
    spells: { ...char.spells, preparedSpells: char.spells.preparedSpells.filter((id: string) => id !== spellId) },
  })),
  learnSpell: vi.fn((char: any, spellId: string) => ({
    ...char,
    spells: { ...char.spells, knownSpells: [...char.spells.knownSpells, spellId] },
  })),
  unlearnSpell: vi.fn((char: any, spellId: string) => ({
    ...char,
    spells: {
      ...char.spells,
      knownSpells: char.spells.knownSpells.filter((id: string) => id !== spellId),
      preparedSpells: char.spells.preparedSpells.filter((id: string) => id !== spellId),
    },
  })),
  consumeSpellSlot: vi.fn((char: any, level: number) => ({
    ...char,
    spells: {
      ...char.spells,
      spellSlots: {
        ...char.spells.spellSlots,
        [level]: { ...char.spells.spellSlots[level], used: char.spells.spellSlots[level].used + 1 },
      },
    },
  })),
  recoverSpellSlot: vi.fn((char: any, level: number) => ({
    ...char,
    spells: {
      ...char.spells,
      spellSlots: {
        ...char.spells.spellSlots,
        [level]: { ...char.spells.spellSlots[level], used: 0 },
      },
    },
  })),
  longRest: vi.fn((char: any) => ({
    ...char,
    spells: {
      ...char.spells,
      spellSlots: Object.fromEntries(
        Object.entries(char.spells.spellSlots).map(([level, slots]: [string, any]) => [
          level,
          { ...slots, used: 0 },
        ])
      ),
    },
    hitPoints: { ...char.hitPoints, current: char.hitPoints.max },
    hitDice: { ...char.hitDice, used: 0 },
  })),
  shortRest: vi.fn((char: any) => char),
  recomputeDerivedStats: vi.fn((char: any) => char),
  rollSpellAttack: vi.fn(() => ({ roll: 15, total: 18, breakdown: '1d20+3 = 15, +3 = 18' })),
  rollSpellDamage: vi.fn(() => ({ rolls: [6], total: 6, breakdown: '1d6 = 6' })),
  defaultRandom: vi.fn(() => 0.5),
  getModifier: vi.fn((score: number) => Math.floor((score - 10) / 2)),
  getProficiencyBonus: vi.fn(() => 2),
}));

// Mock localStorage for node environment
if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
  const store: Record<string, string> = {};
  const localStorageMock = {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); },
  };
  // @ts-expect-error — global mock in node env
  global.localStorage = localStorageMock;
}
