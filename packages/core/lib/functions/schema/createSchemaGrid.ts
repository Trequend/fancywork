import { KMeansPalette, QuantizationError, RGBColor } from 'lib/classes';
import { Palette, PaletteColor, SchemaGrid } from 'lib/types';
import { getImageDataPixel } from '../utils';

export function createSchemaGrid(
  imageData: ImageData,
  palette: KMeansPalette,
  withDithering: boolean
): {
  grid: SchemaGrid;
  palette: Palette;
} {
  const paletteColors: Array<PaletteColor> = [];
  const grid: SchemaGrid = [];
  const errors: Array<QuantizationError> = withDithering
    ? QuantizationError.createArray(imageData.width * 2)
    : [];

  for (let j = 0, offset = 0; j < imageData.height; j++) {
    const lineOffset = j % 2 === 0 ? 0 : imageData.width;
    const nextLineOffset = j % 2 === 0 ? imageData.width : 0;

    if (withDithering) {
      for (let i = 0; i < imageData.width; i++) {
        errors[nextLineOffset + i].clear();
      }
    }

    for (let i = 0; i < imageData.width; i++, offset += 4) {
      const { alpha, ...rest } = getImageDataPixel(imageData, offset);
      let color = rest;

      if (alpha === 0) {
        grid.push(null);
      } else {
        if (withDithering) {
          color = errors[lineOffset + i].apply(color);
        }

        const originalColor = new RGBColor(color.red, color.green, color.blue);
        const similarColor = palette.getSimilarColor(originalColor);
        const index = paletteColors.findIndex(
          (paletteColor) => paletteColor === similarColor
        );
        if (index >= 0) {
          grid.push(index);
        } else {
          grid.push(paletteColors.length);
          paletteColors.push(similarColor);
        }

        if (withDithering) {
          const delta = computeColorDelta(
            originalColor,
            RGBColor.fromHex(similarColor.hex)
          );

          /*
           * ...  x   7
           *  3   5   1
           *
           *   (1/16)
           */

          if (i + 1 !== imageData.width) {
            errors[lineOffset + i + 1].add(delta, 7);
          }

          if (j + 1 !== imageData.height) {
            if (i !== 0) {
              errors[nextLineOffset + i].add(delta, 3);
            }

            errors[nextLineOffset + i].add(delta, 5);

            if (i + 1 !== imageData.width) {
              errors[nextLineOffset + i + 1].add(delta, 1);
            }
          }
        }
      }
    }
  }

  return {
    grid,
    palette: {
      name: palette.name,
      colors: paletteColors,
    },
  };
}

function computeColorDelta(color: RGBColor, otherColor: RGBColor) {
  return {
    red: color.red - otherColor.red,
    green: color.green - otherColor.green,
    blue: color.blue - otherColor.blue,
  };
}
