import { WebGL } from './WebGL';

export class IndexBuffer {
  protected id: WebGLBuffer | null;

  /**
   * @param {} indices Индексы вершин.
   */
  constructor(
    protected readonly gl: WebGL,
    public readonly type: number,
    indices: BufferSource
  ) {
    this.id = gl.createBuffer();
    if (this.id === null) {
      throw new Error('cannot create buffer');
    }

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
  }

  bind() {
    const { gl } = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.id);
  }

  unbind() {
    const { gl } = this;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  destroy() {
    this.gl.deleteBuffer(this.id);
    this.id = null;
  }
}
