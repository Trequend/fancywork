import { KMeansPalette } from '../classes/KMeansPalette';
import { PaletteReducerFactory } from '../classes/palette-reducers';
import { RGBColor } from '../classes/RGBColor';
import { forEachPixel } from './forEachPixel';
import { Palette } from '../types';
import { PaletteReduceAlgorithm } from '../classes/palette-reducers/PaletteReducerFactory';

export type CreateImagePaletteOptions = {
  palette: Palette;
  colorsCount?: number;
  reduceAlgorithm?: PaletteReduceAlgorithm;
};

export function createImagePalette(
  imageData: ImageData,
  options: CreateImagePaletteOptions
): KMeansPalette {
  const { palette, colorsCount, reduceAlgorithm } = options;
  const imagePalette = new KMeansPalette(palette);
  forEachPixel(imageData, (red, green, blue, alpha) => {
    if (alpha !== 0) {
      const color = new RGBColor(red, green, blue);
      imagePalette.increaseColorWeight(color);
    }
  });

  if (colorsCount) {
    const reducer = new PaletteReducerFactory().createReducer(
      reduceAlgorithm || 'nearest'
    );
    imagePalette.reduce(colorsCount, reducer);
  } else {
    imagePalette.reduce();
  }

  return imagePalette;
}
