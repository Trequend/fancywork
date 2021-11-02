import { IndexBuffer } from '../webgl';

export class WebGL1IndexBuffer extends IndexBuffer {
  public constructor(
    gl: WebGLRenderingContext,
    indices: Uint8Array | Uint16Array
  ) {
    let type: number;
    if (indices instanceof Uint8Array) {
      type = gl.UNSIGNED_BYTE;
    } else if (indices instanceof Uint16Array) {
      type = gl.UNSIGNED_SHORT;
    } else {
      throw new Error('Not supported');
    }

    super(gl, type, indices);
  }
}
