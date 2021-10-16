import { KMeansPalette } from '../classes/KMeansPalette';
import { PaletteReducerFactory } from '../classes/palette-reducers';
import { RGBColor } from '../classes/RGBColor';
import { forEachPixel } from './forEachPixel';
import { Palette } from '../types';
import { PaletteReduceAlgorithm } from '../classes/palette-reducers/PaletteReducerFactory';

export type CreateImagePaletteOptions = {
  palette: Palette;
  maxColorsCount?: number;
  reduceAlgorithm?: PaletteReduceAlgorithm;
};

export function createImagePalette(
  imageData: ImageData,
  options: CreateImagePaletteOptions
): KMeansPalette {
  const { palette, maxColorsCount, reduceAlgorithm } = options;
  const imagePalette = new KMeansPalette(palette);
  forEachPixel(imageData, (red, green, blue, alpha) => {
    if (alpha !== 0) {
      const color = new RGBColor(red, green, blue);
      imagePalette.increaseColorWeight(color);
    }
  });

  if (maxColorsCount && reduceAlgorithm) {
    const reducer = new PaletteReducerFactory().createReducer(reduceAlgorithm);
    imagePalette.reduce(maxColorsCount, reducer);
  } else {
    imagePalette.reduce();
  }

  return imagePalette;
}
