import { Palette } from './Palette';
import { SchemaGrid } from './SchemaGrid';
import { SchemaMetadata } from './SchemaMetadata';

export type Schema = {
  metadata: SchemaMetadata;
  palette: Palette;
  grid: SchemaGrid;
};
