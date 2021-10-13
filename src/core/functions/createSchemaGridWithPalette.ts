import { KMeansPalette } from '../classes/KMeansPalette';
import { RGBColor } from '../classes/RGBColor';
import { forEachPixel } from './forEachPixel';
import { Palette, PaletteColor, SchemaGrid } from '../types';

export function createSchemaGridWithPalette(
  imageData: ImageData,
  palette: KMeansPalette
): {
  grid: SchemaGrid;
  palette: Palette;
} {
  const paletteColors: Array<PaletteColor> = [];
  const grid: SchemaGrid = [];
  forEachPixel(imageData, (red, green, blue, alpha) => {
    if (alpha === 0) {
      grid.push(undefined);
    } else {
      const color = new RGBColor(red, green, blue);
      const similarColor = palette.getSimilarColor(color);
      const index = paletteColors.findIndex(
        (paletteColor) => paletteColor === similarColor
      );

      if (index >= 0) {
        grid.push(index);
      } else {
        grid.push(paletteColors.length);
        paletteColors.push(similarColor);
      }
    }
  });

  return {
    grid,
    palette: {
      name: palette.name,
      colors: paletteColors,
    },
  };
}
