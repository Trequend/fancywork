export class Vector4 {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number,
    public readonly w: number
  ) {}

  public multiply(value: number) {
    return new Vector4(
      this.x * value,
      this.y * value,
      this.z * value,
      this.w * value
    );
  }

  public add(value: Vector4) {
    return new Vector4(
      this.x + value.x,
      this.y + value.y,
      this.z + value.z,
      this.w + value.w
    );
  }
}
