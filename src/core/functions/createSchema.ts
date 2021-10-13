import { RGBColor } from '../classes/RGBColor';
import { CreateImagePaletteOptions } from './createImagePalette';
import { executeInCanvasContext } from './executeInCanvasContext';
import { getImageData } from './getImageData';
import { Palette, Schema, SchemaGrid, SchemaMetadata } from '../types';
import { createSchemaGrid } from './createSchemaGrid';
import { v4 as uuidv4 } from 'uuid';

export type GenerateSchemaOptions = {
  name: string;
  width?: number;
  height?: number;
  stitchCount: number;
} & CreateImagePaletteOptions;

export async function createSchema(
  imageUrl: string,
  options: GenerateSchemaOptions
): Promise<Schema> {
  const imageData =
    options.width && options.height
      ? await getImageData(imageUrl, options.width, options.height)
      : await getImageData(imageUrl);

  const { grid, palette } = await createSchemaGrid({
    imageData,
    options,
  });

  const metadata = createSchemaMetadata(imageData, {
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

function createSchemaMetadata(
  imageData: ImageData,
  options: CreateSchemaMetadataOptions
): SchemaMetadata {
  const sourceImageDataURL = getSourceImageDataURL(imageData);

  const schemaImageDataURL = getSchemaImageDataURL(
    imageData.width,
    imageData.height,
    options.grid,
    options.palette
  );

  return {
    name: options.name,
    width: imageData.width,
    height: imageData.height,
    paletteName: options.palette.name,
    sourceImageDataURL,
    schemaImageDataURL,
  };
}

function getSourceImageDataURL(imageData: ImageData): string {
  return executeInCanvasContext((context) => {
    context.canvas.width = imageData.width;
    context.canvas.height = imageData.height;
    context.putImageData(imageData, 0, 0);
    return context.canvas.toDataURL();
  });
}

function getSchemaImageDataURL(
  width: number,
  height: number,
  grid: SchemaGrid,
  palette: Palette
): string {
  return executeInCanvasContext((context) => {
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
}
