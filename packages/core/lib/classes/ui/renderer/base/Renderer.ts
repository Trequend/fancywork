import { RGBAColor, RGBColor } from '../../../common';

export abstract class Renderer {
  public abstract start(): void;

  public abstract drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: RGBAColor | RGBColor
  ): void;

  public abstract drawSchemaSymbol(
    symbol: string,
    x: number,
    y: number,
    color: RGBAColor | RGBColor
  ): void;

  public abstract drawBorderNumber(number: number, x: number, y: number): void;

  public abstract drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    options: {
      lineWidth: number;
      color: RGBAColor | RGBColor;
    }
  ): void;

  public abstract end(): void;

  public abstract destroy(): void;
}
