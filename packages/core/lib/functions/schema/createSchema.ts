import {
  Palette,
  PaletteReduceAlgorithm,
  SizeType,
  Schema,
  SchemaGrid,
  SchemaMetadata,
} from 'lib/types';
import { processImageInCanvas } from '../utils';
import { createSchemaGrid } from './createSchemaGrid';
import { createImagePalette } from './createImagePalette';
import { v4 as uuidv4 } from 'uuid';
import { MAX_HEIGHT, MAX_WIDTH } from 'lib/constants';
import { convertSize } from '../utils/convertSize';

export type GenerateSchemaOptions = {
  name: string;
  width: number;
  height: number;
  stitchCount: number;
  withDithering: boolean;
  palette: Palette;
  maxColorsCount?: number;
  reduceAlgorithm?: PaletteReduceAlgorithm;
  sizeType: SizeType;
};

export async function createSchema(
  imageURL: string,
  options: GenerateSchemaOptions
): Promise<Schema> {
  const size = convertSize(options.width, options.height, {
    stitchCount: options.stitchCount,
    from: options.sizeType,
    to: 'stitch',
  });

  if (size.width < 1 && size.width > MAX_WIDTH) {
    throw new RangeError(`Schema width must be in range [1; ${MAX_WIDTH}]`);
  }

  if (size.height < 1 && size.height > MAX_HEIGHT) {
    throw new RangeError(`Schema height must be in range [1; ${MAX_WIDTH}]`);
  }

  const imageData = await processImageInCanvas(
    (context, width, height) => {
      return context.getImageData(0, 0, width, height);
    },
    {
      imageURL,
      width: size.width,
      height: size.height,
    }
  );

  const unoptimizedPalette = await createImagePalette(imageData, {
    palette: options.palette,
    maxColorsCount: options.maxColorsCount,
    reduceAlgorithm: options.reduceAlgorithm,
  });

  const { grid, palette } = createSchemaGrid(
    imageData,
    unoptimizedPalette,
    options.withDithering
  );

  const metadata = createSchemaMetadata(imageData, {
    name: options.name,
    grid,
    palette,
    stitchCount: options.stitchCount,
  });

  return {
    metadata,
    palette,
    grid,
  };
}

type CreateSchemaMetadataOptions = {
  name: string;
  grid: SchemaGrid;
  palette: Palette;
  stitchCount: number;
};

function createSchemaMetadata(
  imageData: ImageData,
  options: CreateSchemaMetadataOptions
): SchemaMetadata {
  return {
    id: uuidv4(),
    name: options.name,
    createdAt: new Date(),
    stitchCount:
      options.grid.reduce((accumulator, value) => {
        if (value === undefined) {
          return accumulator;
        } else {
          return (accumulator ?? 0) + 1;
        }
      }, 0) ?? 0,
    canvasMetadata: {
      width: imageData.width,
      height: imageData.height,
      stitchCount: options.stitchCount,
    },
    paletteMetadata: {
      name: options.palette.name,
      colorsCount: options.palette.colors.length,
    },
  };
}
