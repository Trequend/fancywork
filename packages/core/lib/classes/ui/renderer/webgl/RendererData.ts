import { RGBAColor, Vector2, Vector4 } from '../../../common';
import { Attributes } from './Attributes';
import {
  INDICES_PER_QUAD,
  VERTICES_PER_QUAD,
  WHITE_TEX_INDEX,
} from './constants';
import { IndexBuffer } from './IndexBuffer';
import { VertexBuffer } from './VertexBuffer';
import { WebGL } from './WebGL';

export abstract class RendererData<
  W extends WebGL,
  I extends Uint8Array | Uint16Array | Uint32Array,
  VB extends VertexBuffer,
  IB extends IndexBuffer
> {
  private readonly vertices: Float32Array;

  protected readonly indexBuffer: IB;

  protected readonly vertexBuffer: VB;

  private readonly maxQuadCount: number;

  private offset = 0;

  protected quadIndex = 0;

  public constructor(
    protected readonly gl: W,
    attributes: Attributes,
    indices: I
  ) {
    if (indices.length === 0 || indices.length % INDICES_PER_QUAD !== 0) {
      throw new Error(
        'the number of indices must be a multiple of 6 and be greater than 0'
      );
    }

    for (let i = 0, offset = 0; i < indices.length; i += 6, offset += 4) {
      indices[i + 0] = offset + 0;
      indices[i + 1] = offset + 1;
      indices[i + 2] = offset + 2;

      indices[i + 3] = offset + 0;
      indices[i + 4] = offset + 3;
      indices[i + 5] = offset + 2;
    }

    this.indexBuffer = this.createIndexBuffer(indices);

    this.maxQuadCount = indices.length / INDICES_PER_QUAD;

    const verticesCount = this.maxQuadCount * VERTICES_PER_QUAD;
    this.vertices = new Float32Array(verticesCount * attributes.size);

    this.vertexBuffer = this.createVertexBuffer(verticesCount, attributes);
  }

  protected abstract createIndexBuffer(indices: I): IB;

  protected abstract createVertexBuffer(
    verticesCount: number,
    attributes: Attributes
  ): VB;

  public bind() {
    this.vertexBuffer.bind();
    this.indexBuffer.bind();
  }

  private isFull() {
    return this.quadIndex >= this.maxQuadCount;
  }

  public flush() {
    if (this.quadIndex === 0) {
      return;
    }

    this.draw();
    this.reset();
  }

  private draw() {
    const { gl } = this;
    this.vertexBuffer.setData(this.vertices);
    gl.drawElements(
      gl.TRIANGLES,
      this.quadIndex * INDICES_PER_QUAD,
      this.indexBuffer.type,
      0
    );
  }

  protected abstract setData(data: Float32Array): void;

  private reset() {
    this.quadIndex = 0;
    this.offset = 0;
  }

  protected setPosition(position: Vector2) {
    this.vertices[this.offset++] = position.x;
    this.vertices[this.offset++] = position.y;
  }

  protected setColor(color: Vector4) {
    this.vertices[this.offset++] = color.x;
    this.vertices[this.offset++] = color.y;
    this.vertices[this.offset++] = color.z;
    this.vertices[this.offset++] = color.w;
  }

  protected setTexIndex(index: number) {
    this.vertices[this.offset++] = index;
  }

  protected setTexCoords(texCoords: Vector2) {
    this.vertices[this.offset++] = texCoords.x;
    this.vertices[this.offset++] = texCoords.y;
  }

  public addVertices(
    positions: Array<Vector2>,
    color: RGBAColor,
    texIndex?: number,
    texCoords?: Array<Vector2>
  ) {
    if (this.isFull()) {
      this.flush();
    }

    texIndex = texIndex ?? WHITE_TEX_INDEX;
    texCoords = texCoords ?? [
      new Vector2(0, 0),
      new Vector2(0, 1),
      new Vector2(1, 1),
      new Vector2(1, 0),
    ];

    const normalizedColor = new Vector4(
      color.red,
      color.green,
      color.blue,
      color.alpha
    ).multiply(1 / 255);

    for (let i = 0; i < 4; i++) {
      const position = positions[i];
      const coords = texCoords[i];
      this.setVertex(position, normalizedColor, texIndex, coords);
    }

    this.quadIndex++;
  }

  protected abstract setVertex(
    position: Vector2,
    color: Vector4,
    texIndex: number,
    texCoords: Vector2
  ): void;

  public destroy() {
    this.vertexBuffer.destroy();
    this.indexBuffer.destroy();
  }
}
