import { SchemaGrid } from './SchemaGrid';
import { Palette } from './Palette';
import { SchemaMetadata } from './SchemaMetadata';

export type Schema = {
  metadata: SchemaMetadata;
  palette: Palette;
  grid: SchemaGrid;
};
