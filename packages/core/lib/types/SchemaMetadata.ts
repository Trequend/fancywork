import { CanvasMetadata } from './CanvasMetadata';
import { PaletteMetadata } from './PaletteMetadata';

export type SchemaMetadata = {
  id: string;
  name: string;
  createdAt: Date;
  stitchCount: number;
  canvasMetadata: CanvasMetadata;
  paletteMetadata: PaletteMetadata;
};
