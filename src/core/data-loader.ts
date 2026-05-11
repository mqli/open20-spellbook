import { createBrowserDataLoader } from 'open20-core/browser';
import lookupTables from '../data/srd/lookup-tables.json';
import { SchemaService } from './schema-service';

const validatedData = SchemaService.transformLookupTables(lookupTables);
export const dataLoader = createBrowserDataLoader(validatedData);
