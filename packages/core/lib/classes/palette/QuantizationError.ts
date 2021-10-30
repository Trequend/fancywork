type Color = {
  red: number;
  green: number;
  blue: number;
};

const COEFFICIENT = 1 / 16;

export class QuantizationError {
  private red = 0;
  private green = 0;
  private blue = 0;

  public clear() {
    this.red = 0;
    this.green = 0;
    this.blue = 0;
  }

  public add(delta: Color, factor: number) {
    const value = factor * COEFFICIENT;
    this.red += delta.red * value;
    this.green += delta.green * value;
    this.blue += delta.blue * value;
  }

  public apply(color: Color) {
    return {
      red: clampColorComponent(color.red + this.red),
      green: clampColorComponent(color.green + this.green),
      blue: clampColorComponent(color.blue + this.blue),
    };
  }

  public static createArray(width: number) {
    const array: Array<QuantizationError> = new Array(width * 2);
    for (let i = 0; i < width; i++) {
      array[i] = new QuantizationError();
    }

    return array;
  }
}

function clampColorComponent(component: number) {
  component = Math.round(component);
  return component < 0 ? 0 : component > 255 ? 255 : component;
}
