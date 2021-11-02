import { Attribute } from './Attribute';
import { AttributeType } from './AttributeType';
import { WebGL } from './WebGL';

export class Attributes {
  public readonly storage: Readonly<Array<Attribute>>;

  public readonly stride: number;

  public readonly size: number;

  public constructor(
    gl: WebGL,
    attributes: { name: string; type: AttributeType }[]
  ) {
    this.stride = 0;
    this.size = 0;
    let offset = 0;
    const storage: Array<Attribute> = [];
    for (const { name, type } of attributes) {
      const attribute = new Attribute(gl, name, type, offset);
      this.size += attribute.size;
      this.stride += attribute.byteSize;
      storage.push(attribute);
      offset += attribute.byteSize;
    }

    this.storage = Object.freeze(storage);
  }
}
