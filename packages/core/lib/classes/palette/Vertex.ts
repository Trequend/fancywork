import { PaletteColor } from 'lib/types';
import { RGBColor } from '../common';

export class Vertex {
  private readonly color: RGBColor;

  private readonly attachedColors = new Map<number, number>();

  constructor(public readonly paletteColor: PaletteColor) {
    this.color = RGBColor.fromHex(paletteColor.hex);
  }

  public get attachedColorsCount() {
    return this.attachedColors.size;
  }

  public distance(color: RGBColor): number;
  public distance(vertex: Vertex): number;
  public distance(value: RGBColor | Vertex) {
    if (value instanceof RGBColor) {
      const red = (this.color.red - value.red) ** 2;
      const green = (this.color.green - value.green) ** 2;
      const blue = (this.color.blue - value.blue) ** 2;
      return Math.sqrt(red + green + blue);
    } else {
      return this.distance(value.color);
    }
  }

  public merge(vertex: Vertex) {
    vertex.attachedColors.forEach((value, key) => {
      this.attachedColors.set(key, value);
    });
  }

  public attachColor(color: RGBColor) {
    const key = color.valueOf();
    const count = this.attachedColors.get(key);
    if (count) {
      this.attachedColors.set(key, count + 1);
    } else {
      this.attachedColors.set(key, 1);
    }
  }

  public isAttachedColor(color: RGBColor) {
    return this.attachedColors.has(color.valueOf());
  }

  public getColor() {
    return this.color;
  }

  public compareTo(vertex: Vertex) {
    if (this.attachedColorsCount < vertex.attachedColorsCount) {
      return -1;
    } else if (this.attachedColorsCount > vertex.attachedColorsCount) {
      return 1;
    } else {
      return 0;
    }
  }
}
