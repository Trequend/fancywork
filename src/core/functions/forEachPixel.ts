export function forEachPixel(
  imageData: ImageData,
  callback: (red: number, green: number, blue: number, alpha: number) => void
) {
  const imageSize = imageData.width * imageData.height;

  for (let i = 0, offset = 0; i < imageSize; i++, offset += 4) {
    const red = imageData.data[offset + 0];
    const green = imageData.data[offset + 1];
    const blue = imageData.data[offset + 2];
    const alpha = imageData.data[offset + 3];

    callback(red, green, blue, alpha);
  }
}
