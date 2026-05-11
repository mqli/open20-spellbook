import { createBrowserDataLoader } from 'open20-core/browser';
import lookupTables from '../data/srd/lookup-tables.json';

export const dataLoader = createBrowserDataLoader(lookupTables as any);
