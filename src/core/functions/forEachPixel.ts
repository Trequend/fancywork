import { getImageDataPixel } from './getImageDataPixel';

export function forEachPixel(
  imageData: ImageData,
  callback: (red: number, green: number, blue: number, alpha: number) => void
) {
  const imageSize = imageData.width * imageData.height;

  for (let i = 0, offset = 0; i < imageSize; i++, offset += 4) {
    const { red, green, blue, alpha } = getImageDataPixel(imageData, offset);
    callback(red, green, blue, alpha);
  }
}
