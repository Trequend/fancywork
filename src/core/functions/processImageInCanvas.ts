import { executeInCanvasContext } from './executeInCanvasContext';

export type ProcessImageInCanvasOptions = {
  imageURL: string;
  width?: number;
  height?: number;
  imageSmoothingEnabled?: boolean;
};

export async function processImageInCanvas<T>(
  callback: (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => T,
  options: ProcessImageInCanvasOptions
): Promise<T>;
export async function processImageInCanvas<T>(
  callback: (
    context: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => Promise<T>,
  options: ProcessImageInCanvasOptions
): Promise<T> {
  return await executeInCanvasContext(async (context) => {
    return await new Promise<T>((resolve, reject) => {
      const image = new Image();
      image.src = options.imageURL;

      image.onload = () => {
        const imageWidth = options?.width || image.width;
        const imageHeight = options?.height || image.height;

        context.canvas.width = imageWidth;
        context.canvas.height = imageHeight;
        context.imageSmoothingEnabled = options?.imageSmoothingEnabled ?? true;
        try {
          context.drawImage(image, 0, 0, imageWidth, imageHeight);

          const result = callback(context, imageWidth, imageHeight);
          if (result instanceof Promise) {
            result.then(resolve).catch(reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        } finally {
          image.remove();
        }
      };

      image.onerror = (error) => {
        reject(error);
        image.remove();
      };
    });
  });
}
