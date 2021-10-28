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

  for (let i = 0, offset = 0; i < imageData.height; i++) {
    const lineOffset = i % 2 === 0 ? 0 : imageData.width;
    const nextLineOffset = i % 2 === 0 ? imageData.width : 0;

    if (withDithering) {
      for (let j = 0; j < imageData.width; j++) {
        errors[nextLineOffset + j].clear();
      }
    }

    for (let j = 0; j < imageData.width; j++, offset += 4) {
      let { alpha, ...color } = getImageDataPixel(imageData, offset);

      if (alpha === 0) {
        grid.push(null);
      } else {
        if (withDithering) {
          color = errors[lineOffset + j].apply(color);
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

          if (j + 1 !== imageData.width) {
            errors[lineOffset + j + 1].add(delta, 7);
          }

          if (i + 1 !== imageData.height) {
            if (j !== 0) {
              errors[nextLineOffset + j].add(delta, 3);
            }

            errors[nextLineOffset + j].add(delta, 5);

            if (j + 1 !== imageData.width) {
              errors[nextLineOffset + j + 1].add(delta, 1);
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
