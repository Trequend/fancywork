import { SchemaGrid } from './SchemaGrid';
import { Palette } from './Palette';
import { SchemaMetadata } from './SchemaMetadata';

export type Schema = {
  id: string;
  metadata: SchemaMetadata;
  palette: Palette;
  width: number;
  height: number;
  stitchCount: number;
  grid: SchemaGrid;
};
