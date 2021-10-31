import { IndexBuffer } from '../webgl';

export class WebGL2IndexBuffer extends IndexBuffer {
  public constructor(
    gl: WebGL2RenderingContext,
    indices: Uint8Array | Uint16Array | Uint32Array
  ) {
    let type: number;
    if (indices instanceof Uint8Array) {
      type = gl.UNSIGNED_BYTE;
    } else if (indices instanceof Uint16Array) {
      type = gl.UNSIGNED_SHORT;
    } else if (indices instanceof Uint32Array) {
      type = gl.UNSIGNED_INT;
    } else {
      throw new Error('Not supported');
    }

    super(gl, type, indices);
  }
}
