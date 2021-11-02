import { RGBAColor, RGBColor, Vector2 } from '../../../common';
import { Renderer } from '../base';
import { Atlas } from './Atlas';
import { ATLAS_TEX_INDEX, WHITE_TEX_INDEX } from './constants';
import { RendererData } from './RendererData';
import { SchemaInfo } from './SchemaInfo';
import { Shader } from './Shader';
import { Texture } from './Texture';
import { WebGL } from './WebGL';

export abstract class WebGLRenderer extends Renderer {
  private readonly atlas: Atlas;

  private readonly whiteTexture: Texture;

  constructor(
    protected readonly gl: WebGL,
    protected readonly schemaInfo: SchemaInfo,
    protected readonly shader: Shader,
    private readonly data: RendererData<any, any, any, any>
  ) {
    super();

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);

    this.shader.bind();
    this.data.bind();
    this.whiteTexture = this.createWhiteTexture();
    this.atlas = new Atlas(gl, schemaInfo);
    this.whiteTexture.bind(WHITE_TEX_INDEX);
    this.atlas.bind(ATLAS_TEX_INDEX);
  }

  private createWhiteTexture() {
    const imageData = new ImageData(1, 1);
    imageData.data[0] = 255;
    imageData.data[1] = 255;
    imageData.data[2] = 255;
    imageData.data[3] = 255;
    return new Texture(this.gl, imageData);
  }

  public start() {
    const { gl } = this;
    const { width, height } = gl.canvas;
    gl.viewport(0, 0, width, height);
    gl.clearColor(255, 255, 255, 255);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const matrix = this.getProjectionMatrix(width, height);
    this.shader.setMatrix3x3('u_ProjectionMatrix', matrix);
    this.shader.setIntArray('u_Textures', [WHITE_TEX_INDEX, ATLAS_TEX_INDEX]);
  }

  private getProjectionMatrix(width: number, height: number) {
    const ratio = window.devicePixelRatio;
    return [(2 / width) * ratio, 0, 0, 0, (-2 / height) * ratio, 0, -1, 1, 1];
  }

  public drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: RGBAColor | RGBColor
  ): void {
    const positions = this.computePositions(x, y, width, height);
    const rgbaColor = this.transformColor(color);
    this.data.addVertices(positions, rgbaColor);
  }

  public drawSchemaSymbol(
    symbol: string,
    x: number,
    y: number,
    color: RGBAColor | RGBColor
  ): void {
    const positions = this.computePositions(x, y);
    const rgbaColor = this.transformColor(color);
    const texCoords = this.atlas.getSchemaSymbolTexCoords(symbol);
    this.data.addVertices(positions, rgbaColor, ATLAS_TEX_INDEX, texCoords);
  }

  public drawBorderNumber(number: number, x: number, y: number): void {
    const positions = this.computePositions(x, y);
    const rgbaColor = new RGBAColor(0, 0, 0, 255);
    const texCoords = this.atlas.getBorderNumberTexCoords(number);
    this.data.addVertices(positions, rgbaColor, ATLAS_TEX_INDEX, texCoords);
  }

  public drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    options: {
      lineWidth: number;
      color: RGBAColor | RGBColor;
    }
  ): void {
    const deltaX = x1 - x0;
    const deltaY = y1 - y0;
    if (deltaX !== 0 && deltaY !== 0) {
      throw new Error('not supported');
    }

    const { color, lineWidth } = options;
    const halfLineWidth = lineWidth / 2;

    if (deltaX !== 0) {
      this.drawRect(x0, y0 - halfLineWidth, deltaX, lineWidth, color);
    } else {
      this.drawRect(x0 - halfLineWidth, y0, lineWidth, deltaY, color);
    }
  }

  private transformColor(color: RGBColor | RGBAColor): RGBAColor {
    if (color instanceof RGBAColor) {
      return color;
    } else {
      return new RGBAColor(color.red, color.green, color.blue, 255);
    }
  }

  private computePositions(
    x: number,
    y: number,
    width?: number,
    height?: number
  ) {
    width = width ?? this.schemaInfo.cellSize;
    height = height ?? this.schemaInfo.cellSize;
    return [
      new Vector2(x, y + height),
      new Vector2(x, y),
      new Vector2(x + width, y),
      new Vector2(x + width, y + height),
    ];
  }

  public end() {
    this.data.flush();
  }

  public destroy() {
    this.atlas.destroy();
    this.data.destroy();
    this.whiteTexture.destroy();
  }
}
