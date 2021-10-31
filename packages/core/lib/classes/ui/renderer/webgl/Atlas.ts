import { Vector2 } from '../../../common';
import { WebGL } from 'lib/types';
import { SchemaInfo } from './SchemaInfo';
import { MAX_TEXTURE_WIDTH } from './constants';
import { Texture } from './Texture';

export class Atlas {
  private readonly texture: Texture;

  private readonly symbolMap: Record<string, Vector2[]> = {};

  private readonly numberMap: Record<number, Vector2[]> = {};

  private readonly cellSize: number;

  public constructor(gl: WebGL, schemaInfo: SchemaInfo) {
    this.cellSize = schemaInfo.cellSize * window.devicePixelRatio;
    const canvas = this.createCanvas(schemaInfo);
    this.texture = new Texture(gl, canvas);
    canvas.remove();
  }

  private createCanvas(schemaInfo: SchemaInfo) {
    const canvas = document.createElement('canvas');
    const { width, height } = this.computeTextureSize(schemaInfo);
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('2d context not supported');
    }

    canvas.width = width;
    canvas.height = height;

    const fontSize = `${14 * devicePixelRatio}px`;
    const fontFamily = `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`;

    context.fillStyle = '#fff';
    context.textAlign = 'center';
    context.font = `bold ${fontSize} ${fontFamily}`;
    context.textBaseline = 'middle';
    const numbersCount = Math.max(schemaInfo.width, schemaInfo.height);
    for (let i = 0; i < numbersCount; i++) {
      this.numberMap[i] = this.addText((i + 1).toString(), i, context);
    }

    context.textAlign = 'center';
    context.font = `${fontSize} ${fontFamily}`;
    context.textBaseline = 'middle';
    const symbolsCount = schemaInfo.symbols.length;
    for (let i = 0; i < symbolsCount; i++) {
      const symbol = schemaInfo.symbols[i];
      this.symbolMap[symbol] = this.addText(symbol, i + numbersCount, context);
    }

    return canvas;
  }

  private computeTextureSize(schemaInfo: SchemaInfo) {
    const numbersCount = Math.max(schemaInfo.width, schemaInfo.height);
    const symbolsCount = schemaInfo.symbols.length;
    const count = numbersCount + symbolsCount;
    const countInRow = Math.floor(MAX_TEXTURE_WIDTH / this.cellSize);
    const rowsCount = Math.ceil(count / countInRow);
    return {
      width: rowsCount > 1 ? MAX_TEXTURE_WIDTH : count * this.cellSize,
      height: rowsCount * this.cellSize,
    };
  }

  private addText(
    text: string,
    index: number,
    context: CanvasRenderingContext2D
  ) {
    const { cellSize } = this;
    const countInRow = Math.floor(MAX_TEXTURE_WIDTH / cellSize);
    const row = Math.floor(index / countInRow);
    const column = index % countInRow;
    const x = column * cellSize;
    const y = row * cellSize;
    context.fillText(text, x + cellSize / 2, y + cellSize / 2);
    const { width, height } = context.canvas;
    return this.toTexCoords(new Vector2(x, y), width, height);
  }

  public getBorderNumberTexCoords(number: number) {
    return this.numberMap[number];
  }

  public getSchemaSymbolTexCoords(symbol: string) {
    return this.symbolMap[symbol];
  }

  private toTexCoords({ x, y }: Vector2, width: number, height: number) {
    const { cellSize } = this;
    return [
      new Vector2(x / width, (y + cellSize) / height), // LEFT BOTTOM
      new Vector2(x / width, y / height), // LEFT TOP
      new Vector2((x + cellSize) / width, y / height), // RIGHT BOTTOM
      new Vector2((x + cellSize) / width, (y + cellSize) / height), // RIGHT BOTTOm
    ];
  }

  public bind(slot: number) {
    this.texture.bind(slot);
  }

  public destroy() {
    this.texture.destroy();
  }
}
