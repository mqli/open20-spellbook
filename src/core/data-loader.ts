import { createBrowserDataLoader } from 'open20-core/browser';

// We pass an empty object for lookupTables because we only need the 
// bundled spells data, not the level-based calculation tables.
export const dataLoader = createBrowserDataLoader({} as any);
