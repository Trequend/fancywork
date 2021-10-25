import { getContrastColor } from 'lib/functions';
import { Schema } from 'lib/types';

const ALPHABET = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
];

export class SchemaViewProvider {
  private readonly colorMap: Array<{
    symbol: string;
    symbolColor: string;
  }>;

  constructor(public readonly schema: Schema) {
    this.colorMap = [];
    const length = schema.palette.colors.length;
    for (let i = 0; i < length; i++) {
      const symbol = SchemaViewProvider.generateSymbol(i);
      const symbolColor = getContrastColor(schema.palette.colors[i].hexColor);
      this.colorMap.push({
        symbol,
        symbolColor,
      });
    }
  }

  public getCell(i: number, j: number) {
    const cellIndex = this.getCellIndex(i, j);
    const colorIndex = this.schema.grid[cellIndex];
    if (colorIndex === undefined) {
      return undefined;
    } else {
      return {
        color: this.schema.palette.colors[colorIndex],
        ...this.colorMap[colorIndex],
      };
    }
  }

  protected getCellIndex(i: number, j: number) {
    const { width } = this.schema;
    return j * width + i;
  }

  private static generateSymbol(index: number) {
    if (!Number.isInteger(index)) {
      throw new TypeError('Integer expected');
    }

    index += 1;
    const base = ALPHABET.length;
    let result = '';
    while (index >= base) {
      result += ALPHABET[index % base];
      index = Math.floor(index / base);
    }

    result += ALPHABET[index];
    return result.split('').reverse().join('');
  }
}
