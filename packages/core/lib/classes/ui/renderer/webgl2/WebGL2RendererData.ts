import { Vector4, Vector2 } from '../../../common';
import {
  Attributes,
  AttributeType,
  INDICES_PER_QUAD,
  RendererData,
  VERTICES_PER_QUAD,
} from '../webgl';
import { WebGL2IndexBuffer } from './WebGL2IndexBuffer';
import { WebGL2VertexBuffer } from './WebGL2VertexBuffer';

export class WebGL2RendererData extends RendererData<
  WebGL2RenderingContext,
  Uint8Array | Uint16Array | Uint32Array,
  WebGL2VertexBuffer,
  WebGL2IndexBuffer
> {
  constructor(gl: WebGL2RenderingContext, maxQuadCount: number) {
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
        : maxVerticesCount <= 2 ** 16
        ? new Uint16Array(maxIndicesCount)
        : new Uint32Array(maxIndicesCount);

    super(gl, attributes, indices);
  }

  protected createIndexBuffer(indices: Uint8Array | Uint16Array) {
    return new WebGL2IndexBuffer(this.gl, indices);
  }

  protected createVertexBuffer(verticesCount: number, attributes: Attributes) {
    return new WebGL2VertexBuffer(this.gl, verticesCount, attributes);
  }

  protected setData(data: Float32Array) {
    this.vertexBuffer.setData(data, this.quadIndex * VERTICES_PER_QUAD);
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
