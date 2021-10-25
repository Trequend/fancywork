import { getImageDataPixel } from './getImageDataPixel';

const CHUNK_MS = 200;

export async function forEachPixel(
  imageData: ImageData,
  callback: (red: number, green: number, blue: number, alpha: number) => void
) {
  return new Promise<void>((resolve, reject) => {
    let index = 0;
    let offset = 0;
    const imageSize = imageData.width * imageData.height;

    const processChunk = () => {
      const chunkStart = performance.now();

      try {
        for (
          ;
          index < imageSize && performance.now() - chunkStart < CHUNK_MS;
          index++, offset += 4
        ) {
          const { red, green, blue, alpha } = getImageDataPixel(
            imageData,
            offset
          );
          callback(red, green, blue, alpha);
        }
      } catch (error) {
        reject(error);
        return;
      }

      if (index < imageSize) {
        setTimeout(processChunk, 0);
      } else {
        resolve();
      }
    };

    processChunk();
  });
}
