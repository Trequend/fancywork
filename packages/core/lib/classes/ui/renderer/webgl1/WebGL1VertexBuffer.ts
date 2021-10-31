import { Attributes, VertexBuffer } from '../webgl';

export class WebGL1VertexBuffer extends VertexBuffer {
  constructor(gl: WebGLRenderingContext, size: number, attributes: Attributes) {
    super(gl, size, attributes);
  }

  setData(data: Float32Array) {
    if (this.id === null) {
      return;
    }

    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, data);
  }
}
