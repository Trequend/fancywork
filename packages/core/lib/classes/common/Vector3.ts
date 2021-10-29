export class Vector3 {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly z: number
  ) {}

  public multiply(value: number) {
    return new Vector3(this.x * value, this.y * value, this.z * value);
  }

  public add(value: Vector3) {
    return new Vector3(this.x + value.x, this.y + value.y, this.z + value.z);
  }
}
