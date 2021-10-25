export function executeInCanvasContext<T>(
  callback: (context: CanvasRenderingContext2D) => T
): T;
export async function executeInCanvasContext<T>(
  callback: (context: CanvasRenderingContext2D) => Promise<T>
): Promise<T>;
export function executeInCanvasContext<T>(
  callback: (context: CanvasRenderingContext2D) => Promise<T> | T
): Promise<T> | T {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('2d context not supported');
  }

  const result = callback(context);
  if (result instanceof Promise) {
    result.finally(() => {
      canvas.remove();
    });

    return result;
  } else {
    canvas.remove();
    return result;
  }
}
