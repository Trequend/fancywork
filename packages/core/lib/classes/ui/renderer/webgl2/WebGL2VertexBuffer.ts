import { Attributes, VertexBuffer } from '../webgl';

export class WebGL2VertexBuffer extends VertexBuffer {
  constructor(
    gl: WebGL2RenderingContext,
    size: number,
    attributes: Attributes
  ) {
    super(gl, size, attributes);
  }

  setData(data: Float32Array, length?: number) {
    if (this.id === null) {
      return;
    }

    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, length);
  }
}
