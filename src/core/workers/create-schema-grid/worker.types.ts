import { CreateImagePaletteOptions } from 'src/core/functions/createImagePalette';
import { Palette, SchemaGrid } from 'src/core/types';

export type WorkerInput = {
  imageData: ImageData;
  withDithering: boolean;
  options: CreateImagePaletteOptions;
};

export type WorkerOutput = {
  grid: SchemaGrid;
  palette: Palette;
};
