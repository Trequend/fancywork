import { Schema } from './Schema';
import { WorkGrid } from './WorkGrid';
import { WorkMetadata } from './WorkMetadata';

export type Work = {
  metadata: WorkMetadata;
  schema: Schema;
  embroidered: WorkGrid;
};
