export function getImageDataPixel(imageData: ImageData, offset: number) {
  const red = imageData.data[offset + 0];
  const green = imageData.data[offset + 1];
  const blue = imageData.data[offset + 2];
  const alpha = imageData.data[offset + 3];
  return { red, green, blue, alpha };
}
