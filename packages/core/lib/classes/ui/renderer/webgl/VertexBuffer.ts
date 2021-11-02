import { Attributes } from './Attributes';
import { AttributeType } from './AttributeType';
import { FLOAT_BYTE_SIZE } from './constants';
import { WebGL } from './WebGL';

export abstract class VertexBuffer {
  protected id: WebGLBuffer | null;

  constructor(
    protected readonly gl: WebGL,
    size: number,
    protected readonly attributes: Attributes
  ) {
    this.id = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    gl.bufferData(gl.ARRAY_BUFFER, size * attributes.stride, gl.DYNAMIC_DRAW);
  }

  abstract setData(data: Float32Array): void;

  bind() {
    if (this.id === null) {
      return;
    }

    const { gl } = this;
    const program = gl.getParameter(gl.CURRENT_PROGRAM);
    if (program == null) {
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.id);
    for (const attribute of this.attributes.storage) {
      const location = gl.getAttribLocation(program, attribute.name);
      if (location === -1) {
        continue;
      }

      gl.enableVertexAttribArray(location);
      switch (attribute.type) {
        case AttributeType.Float:
        case AttributeType.Vector2:
        case AttributeType.Vector3:
        case AttributeType.Vector4:
          gl.vertexAttribPointer(
            location,
            attribute.size,
            attribute.webglType,
            false,
            this.attributes.stride,
            attribute.offset
          );
          break;
        case AttributeType.Matrix3x3:
          for (let j = 0; j < attribute.size; j++) {
            gl.vertexAttribPointer(
              location + j,
              attribute.size,
              attribute.webglType,
              false,
              this.attributes.stride,
              attribute.offset + attribute.size * j * FLOAT_BYTE_SIZE
            );
          }
          break;
      }
    }
  }

  unbind() {
    const { gl } = this;
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
  }

  destroy() {
    this.gl.deleteBuffer(this.id);
    this.id = null;
  }
}
