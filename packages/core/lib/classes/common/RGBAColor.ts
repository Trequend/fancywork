import { HexColor } from '../../types';

export class RGBAColor {
  public readonly red: number;

  public readonly green: number;

  public readonly blue: number;

  public readonly alpha: number;

  constructor(red: number, green: number, blue: number, alpha: number) {
    const assert = (valueName: string, value: number) => {
      if (value < 0 || value > 255) {
        throw new RangeError(
          `Parameter "${valueName}" must be in range [0; 255].`
        );
      } else {
        return value;
      }
    };

    this.red = assert('red', red);
    this.green = assert('green', green);
    this.blue = assert('blue', blue);
    this.alpha = assert('alpha', alpha);
  }

  public valueOf(): number {
    let number = this.alpha;
    number |= this.blue << 8;
    number |= this.green << 16;
    number |= this.red << 24;
    return number;
  }

  public toString() {
    return `rgba(${this.red}, ${this.green}, ${this.blue}, ${
      this.alpha / 255
    })`;
  }

  public static fromHex(hex: HexColor) {
    hex = hex.trim();

    if (/^#([0-9a-fA-F]){3,4}$/.test(hex)) {
      let hexParts = hex.substring(1).split('');
      if (hexParts.length === 3) {
        hexParts = [
          hexParts[0],
          hexParts[0],
          hexParts[1],
          hexParts[1],
          hexParts[2],
          hexParts[2],
          'F',
          'F',
        ];
      } else {
        hexParts = [
          hexParts[0],
          hexParts[0],
          hexParts[1],
          hexParts[1],
          hexParts[2],
          hexParts[2],
          hexParts[3],
          hexParts[3],
        ];
      }

      hex = hexParts.join('');
    } else if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
      hex = `${hex.substring(1)}FF`;
    } else if (/^#[0-9a-fA-F]{8}$/.test(hex)) {
      hex = hex.substring(1);
    } else {
      throw new Error('Bad hex');
    }

    return this.fromNumber(+`0x${hex}`);
  }

  public static fromNumber(value: number) {
    const r = (value >> 24) & 0xff;
    const g = (value >> 16) & 0xff;
    const b = (value >> 8) & 0xff;
    const a = value & 0xff;
    return new RGBAColor(r, g, b, a);
  }
}
