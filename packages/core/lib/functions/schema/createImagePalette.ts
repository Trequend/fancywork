import { KMeansPalette, PaletteReducerFactory, RGBColor } from 'lib/classes';
import { Palette, PaletteReduceAlgorithm } from 'lib/types';
import { forEachPixel } from '../utils';

type Options = {
  palette: Palette;
  maxColorsCount?: number;
  reduceAlgorithm?: PaletteReduceAlgorithm;
};

export async function createImagePalette(
  imageData: ImageData,
  options: Options
): Promise<KMeansPalette> {
  const { palette, maxColorsCount, reduceAlgorithm } = options;
  const imagePalette = new KMeansPalette(palette);
  await forEachPixel(imageData, (red, green, blue, alpha) => {
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
