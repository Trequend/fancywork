import { executeInCanvasContext } from './executeInCanvasContext';

export async function getImageData(
  imageUrl: string,
  width: number,
  height: number
): Promise<ImageData>;
export async function getImageData(imageUrl: string): Promise<ImageData>;
export async function getImageData(
  imageUrl: string,
  width?: number,
  height?: number
): Promise<ImageData> {
  return await executeInCanvasContext(async (context) => {
    return await new Promise<ImageData>((resolve, reject) => {
      const image = new Image();
      image.src = imageUrl;

      image.onload = () => {
        const imageWidth = width || image.width;
        const imageHeight = height || image.height;

        context.canvas.width = imageWidth;
        context.canvas.height = imageHeight;
        context.drawImage(image, 0, 0, imageWidth, imageHeight);

        const imageData = context.getImageData(0, 0, imageWidth, imageHeight);
        resolve(imageData);
      };

      image.onerror = (error) => {
        reject(error);
      };
    });
  });
}
