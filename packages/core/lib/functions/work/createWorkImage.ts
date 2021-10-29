import { RGBColor } from 'lib/classes';
import { Work } from 'lib/types';
import { executeInCanvasContext, processImageInCanvas } from '../utils';

export async function createWorkImage(work: Work): Promise<string> {
  const { grid, palette, metadata } = work.schema;
  const { width, height } = metadata.canvasMetadata;

  const dataURL = executeInCanvasContext((context) => {
    const data = new Uint8ClampedArray(grid.length * 4);
    const colors = palette.colors.map(({ hex }) => RGBColor.fromHex(hex));

    for (let i = 0, offset = 0; i < grid.length; i++, offset += 4) {
      const colorIndex = grid[i];
      if (colorIndex !== null && work.embroidered[i]) {
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
