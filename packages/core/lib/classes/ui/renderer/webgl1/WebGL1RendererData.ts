import { Vector2, Vector4 } from '../../../common';
import {
  Attributes,
  AttributeType,
  INDICES_PER_QUAD,
  RendererData,
  VERTICES_PER_QUAD,
} from '../webgl';
import { WebGL1IndexBuffer } from './WebGL1IndexBuffer';
import { WebGL1VertexBuffer } from './WebGL1VertexBuffer';

export class WebGL1RendererData extends RendererData<
  WebGLRenderingContext,
  Uint8Array | Uint16Array,
  WebGL1VertexBuffer,
  WebGL1IndexBuffer
> {
  constructor(gl: WebGLRenderingContext, maxQuadCount: number) {
    const attributes = new Attributes(gl, [
      { name: 'a_Position', type: AttributeType.Vector2 },
      { name: 'a_Color', type: AttributeType.Vector4 },
      { name: 'a_TexIndex', type: AttributeType.Float },
      { name: 'a_TexCoords', type: AttributeType.Vector2 },
    ]);

    const maxVerticesCount = maxQuadCount * VERTICES_PER_QUAD;
    const maxIndicesCount = maxQuadCount * INDICES_PER_QUAD;
    const indices =
      maxVerticesCount <= 2 ** 8
        ? new Uint8Array(maxIndicesCount)
        : new Uint16Array(maxIndicesCount);

    super(gl, attributes, indices);
  }

  protected createIndexBuffer(indices: Uint8Array | Uint16Array) {
    return new WebGL1IndexBuffer(this.gl, indices);
  }

  protected createVertexBuffer(verticesCount: number, attributes: Attributes) {
    return new WebGL1VertexBuffer(this.gl, verticesCount, attributes);
  }

  protected setData(data: Float32Array) {
    this.vertexBuffer.setData(data);
  }

  protected setVertex(
    position: Vector2,
    color: Vector4,
    texIndex: number,
    texCoords: Vector2
  ) {
    this.setPosition(position);
    this.setColor(color);
    this.setTexIndex(texIndex);
    this.setTexCoords(texCoords);
  }
}
