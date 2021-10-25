export class Vector2Int {
  constructor(public readonly x: number, public readonly y: number) {
    if (!Number.isInteger(x)) {
      throw new TypeError('Expected integer "x"');
    }

    if (!Number.isInteger(y)) {
      throw new TypeError('Expected integer "y"');
    }
  }
}
