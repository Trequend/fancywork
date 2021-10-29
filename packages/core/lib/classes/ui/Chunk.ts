import { BorderCell, Cell, SchemaCell } from 'lib/types';
import { Vector2, Vector2Int } from '../common';

export class Chunk {
  public readonly cellOffset: Vector2;

  public readonly startCell: Cell;

  public readonly endCell: Cell;

  public readonly height: number;

  public readonly width: number;

  public readonly halfCellSize: number;

  constructor(
    public readonly cellSize: number,
    cellsCount: Vector2Int,
    canvasSize: Vector2,
    offset: Vector2
  ) {
    this.halfCellSize = cellSize / 2;

    this.cellOffset = new Vector2(offset.x % cellSize, offset.y % cellSize);

    this.startCell = {
      i: Math.floor(offset.x / cellSize),
      j: Math.floor(offset.y / cellSize),
    };

    this.endCell = {
      i: Math.min(
        this.startCell.i + Math.ceil(canvasSize.x / cellSize),
        cellsCount.x
      ),
      j: Math.min(
        this.startCell.j + Math.ceil(canvasSize.y / cellSize),
        cellsCount.y
      ),
    };

    this.width =
      this.cellOffset.x + (this.endCell.i - this.startCell.i + 1) * cellSize;
    this.height =
      this.cellOffset.y + (this.endCell.j - this.startCell.j + 1) * cellSize;
  }

  public mousePositionToCell(
    mouseX: number,
    mouseY: number
  ): BorderCell | SchemaCell | undefined {
    if (
      mouseX < 0 ||
      mouseY < 0 ||
      mouseX > this.width ||
      mouseY > this.height
    ) {
      return undefined;
    }

    const cellNumberI = Math.floor(
      (mouseX - this.cellSize + this.cellOffset.x) / this.cellSize
    );
    const cellNumberJ = Math.floor(
      (mouseY - this.cellSize + this.cellOffset.y) / this.cellSize
    );

    if (mouseX < this.cellSize && mouseY < this.cellSize) {
      return {
        type: 'border',
        axis: 'origin',
      };
    } else if (mouseX < this.cellSize) {
      return {
        type: 'border',
        axis: 'y',
        number: cellNumberJ + this.startCell.j,
      };
    } else if (mouseY < this.cellSize) {
      return {
        type: 'border',
        axis: 'x',
        number: cellNumberI + this.startCell.i,
      };
    } else {
      return {
        type: 'schema',
        i: cellNumberI + this.startCell.i,
        j: cellNumberJ + this.startCell.j,
      };
    }
  }

  public forEachCellI(callback: (cellNumberI: number, x: number) => void) {
    for (
      let i = this.startCell.i, x = this.cellSize - this.cellOffset.x;
      i < this.endCell.i;
      i++, x += this.cellSize
    ) {
      callback(i, x);
    }
  }

  public forEachCellJ(callback: (cellNumberJ: number, y: number) => void) {
    for (
      let j = this.startCell.j, y = this.cellSize - this.cellOffset.y;
      j < this.endCell.j;
      j++, y += this.cellSize
    ) {
      callback(j, y);
    }
  }

  public forEachCell(
    callback: (
      cellNumberI: number,
      cellNumberJ: number,
      x: number,
      y: number,
      chunk: Chunk
    ) => void
  ) {
    this.forEachCellJ((cellNumberJ, y) => {
      this.forEachCellI((cellNumberI, x) => {
        callback(cellNumberI, cellNumberJ, x, y, this);
      });
    });
  }
}
