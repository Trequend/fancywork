import { MAX_TEXTURE_HEIGHT, MAX_TEXTURE_WIDTH } from './constants';
import { WebGL } from './WebGL';

export class Texture {
  private id: WebGLTexture | null;

  public readonly width: number;

  public readonly height: number;

  constructor(private readonly gl: WebGL, source: TexImageSource) {
    if (source.width > MAX_TEXTURE_WIDTH) {
      throw new RangeError(
        `source width must be less or equal than ${MAX_TEXTURE_WIDTH}`
      );
    }

    if (source.height > MAX_TEXTURE_HEIGHT) {
      throw new RangeError(
        `source height must be less or equal than ${MAX_TEXTURE_HEIGHT}`
      );
    }

    this.width = source.width;
    this.height = source.height;

    this.id = gl.createTexture();
    if (this.id === null) {
      throw new Error('cannot create texture');
    }

    gl.bindTexture(gl.TEXTURE_2D, this.id);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
  }

  bind(slot: number) {
    const { gl } = this;
    gl.activeTexture(gl.TEXTURE0 + slot);
    gl.bindTexture(gl.TEXTURE_2D, this.id);
  }

  unbind() {
    const { gl } = this;
    gl.bindTexture(gl.TEXTURE_2D, null);
  }

  destroy() {
    this.gl.deleteTexture(this.id);
    this.id = null;
  }
}
