import { Work } from '../../../types';
import { SchemaViewProvider } from './SchemaViewProvider';

export class WorkViewProvider extends SchemaViewProvider {
  private colorStatistics: Record<
    string,
    {
      cellsCount: number;
      embroideredCellsCount: number;
    }
  >;

  constructor(public readonly work: Work) {
    super(work.schema);

    this.colorStatistics = {};
    const { length } = work.schema.palette.colors;
    for (let i = 0; i < length; i++) {
      const color = work.schema.palette.colors[i];
      this.colorStatistics[color.code] = {
        cellsCount: 0,
        embroideredCellsCount: 0,
      };
    }

    const { width, height } = work.schema.metadata.canvasMetadata;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const cell = this.getCell(i, j);
        if (cell) {
          const statistics = this.colorStatistics[cell.color.code];
          statistics.cellsCount++;
          if (cell.embroidered) {
            statistics.embroideredCellsCount++;
          }
        }
      }
    }
  }

  public embroiderСell(i: number, j: number) {
    const cell = this.getCell(i, j);
    const cellIndex = this.getCellIndex(i, j);
    if (cell && this.work.embroidered[cellIndex] === false) {
      this.work.embroidered[cellIndex] = true;
      this.work.metadata.stitchEmbroideredCount++;
      const statistics = this.colorStatistics[cell.color.code];
      statistics.embroideredCellsCount++;
    }
  }

  public eraseCell(i: number, j: number) {
    const cell = this.getCell(i, j);
    const cellIndex = this.getCellIndex(i, j);
    if (cell && this.work.embroidered[cellIndex] === true) {
      this.work.embroidered[cellIndex] = false;
      this.work.metadata.stitchEmbroideredCount--;
      const statistics = this.colorStatistics[cell.color.code];
      statistics.embroideredCellsCount--;
    }
  }

  public getColorStatistics(code: string) {
    const statistics = this.colorStatistics[code];
    if (statistics) {
      return { ...statistics };
    } else {
      throw new Error('No color');
    }
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
}
