import { WebGL } from 'lib/types';
import { AttributeType } from './AttributeType';

export class Attribute {
  public readonly webglType: number;

  public readonly size: number;

  public readonly byteSize: number;

  constructor(
    gl: WebGL,
    public readonly name: string,
    public readonly type: AttributeType,
    public readonly offset: number
  ) {
    this.webglType = getWebGLType(gl, type);
    this.size = getWebGLSize(type);
    this.byteSize = getByteSize(type);
  }
}

function getWebGLType(gl: WebGL, type: AttributeType) {
  switch (type) {
    case AttributeType.Float:
    case AttributeType.Vector2:
    case AttributeType.Vector3:
    case AttributeType.Vector4:
    case AttributeType.Matrix3x3:
      return gl.FLOAT;
    default:
      throw new Error('Undefined');
  }
}

function getWebGLSize(type: AttributeType) {
  switch (type) {
    case AttributeType.Float:
      return 1;
    case AttributeType.Vector2:
      return 2;
    case AttributeType.Vector3:
      return 3;
    case AttributeType.Vector4:
      return 4;
    case AttributeType.Matrix3x3:
      return 3;
    default:
      throw new Error('Undefined');
  }
}

function getByteSize(type: AttributeType) {
  switch (type) {
    case AttributeType.Float:
      return 4;
    case AttributeType.Vector2:
      return 8;
    case AttributeType.Vector3:
      return 12;
    case AttributeType.Vector4:
      return 16;
    case AttributeType.Matrix3x3:
      return 36;
    default:
      throw new Error('Undefined');
  }
}
