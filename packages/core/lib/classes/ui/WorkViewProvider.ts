import { Work } from 'lib/types';
import { SchemaViewProvider } from './SchemaViewProvider';

export class WorkViewProvider extends SchemaViewProvider {
  constructor(public readonly work: Work) {
    super(work.schema);
  }

  public getCell(i: number, j: number) {
    const cell = super.getCell(i, j);
    if (cell) {
      const cellIndex = this.getCellIndex(i, j);
      const embroidered = this.work.embroidered[cellIndex]!;
      return {
        ...cell,
        embroidered,
      };
    } else {
      return null;
    }
  }

  public embroiderСell(i: number, j: number) {
    const cellIndex = this.getCellIndex(i, j);
    if (this.work.embroidered[cellIndex] === false) {
      this.work.embroidered[cellIndex] = true;
    }
  }
}
