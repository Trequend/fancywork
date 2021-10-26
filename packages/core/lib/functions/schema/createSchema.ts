import { RGBColor } from 'lib/classes';
import {
  Palette,
  PaletteReduceAlgorithm,
  SizeType,
  Schema,
  SchemaGrid,
  SchemaMetadata,
} from 'lib/types';
import { executeInCanvasContext, processImageInCanvas } from '../utils';
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

  const metadata = await createSchemaMetadata(imageData, {
    name: options.name,
    grid,
    palette,
  });

  return {
    id: uuidv4(),
    metadata,
    palette,
    width: imageData.width,
    height: imageData.height,
    stitchCount: options.stitchCount,
    grid,
  };
}

type CreateSchemaMetadataOptions = {
  name: string;
  grid: SchemaGrid;
  palette: Palette;
};

async function createSchemaMetadata(
  imageData: ImageData,
  options: CreateSchemaMetadataOptions
): Promise<SchemaMetadata> {
  const schemaImageDataURL = await getSchemaImageDataURL(
    imageData.width,
    imageData.height,
    options.grid,
    options.palette
  );

  return {
    name: options.name,
    createdAt: new Date(),
    width: imageData.width,
    height: imageData.height,
    paletteName: options.palette.name,
    schemaImageDataURL,
  };
}

async function getSchemaImageDataURL(
  width: number,
  height: number,
  grid: SchemaGrid,
  palette: Palette
): Promise<string> {
  const dataURL = executeInCanvasContext((context) => {
    const data = new Uint8ClampedArray(grid.length * 4);
    const colors = palette.colors.map(({ hexColor }) =>
      RGBColor.fromHex(hexColor)
    );

    for (let i = 0, offset = 0; i < grid.length; i++, offset += 4) {
      const colorIndex = grid[i];
      if (colorIndex !== undefined) {
        const color = colors[colorIndex];
        data[offset + 0] = color.red;
        data[offset + 1] = color.green;
        data[offset + 2] = color.blue;
        data[offset + 3] = 255;
      } else {
        data[offset + 3] = 0;
      }
    }

    context.canvas.width = width;
    context.canvas.height = height;
    const imageData = new ImageData(data, width, height);
    context.putImageData(imageData, 0, 0);
    return context.canvas.toDataURL();
  });

  const CELL_SIZE = width > 500 || height > 500 ? 1 : 5;
  return await processImageInCanvas(
    (context) => {
      return context.canvas.toDataURL();
    },
    {
      imageURL: dataURL,
      width: width * CELL_SIZE,
      height: height * CELL_SIZE,
      imageSmoothingEnabled: false,
    }
  );
}
