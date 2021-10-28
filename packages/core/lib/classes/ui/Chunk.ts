import { Cell } from 'lib/types';
import { Vector2, Vector2Int } from '../common';

export class Chunk {
  public readonly cellOffset: Vector2;
  public readonly startCell: Vector2Int;
  public readonly endCell: Vector2Int;

  public readonly height: number;
  public readonly width: number;

  constructor(
    private readonly cellSize: number,
    cellsCount: Vector2Int,
    size: Vector2,
    offset: Vector2
  ) {
    this.cellOffset = new Vector2(offset.x % cellSize, offset.y % cellSize);

    this.startCell = new Vector2Int(
      Math.floor(offset.x / cellSize),
      Math.floor(offset.y / cellSize)
    );

    this.endCell = new Vector2Int(
      Math.min(this.startCell.x + Math.ceil(size.x / cellSize), cellsCount.x),
      Math.min(this.startCell.y + Math.ceil(size.y / cellSize), cellsCount.y)
    );

    this.width =
      this.cellOffset.x + (this.endCell.x - this.startCell.x + 1) * cellSize;
    this.height =
      this.cellOffset.y + (this.endCell.y - this.startCell.y + 1) * cellSize;
  }

  public mousePositionToCell(mouseX: number, mouseY: number): Cell | undefined {
    if (
      mouseX < 0 ||
      mouseY < 0 ||
      mouseX > this.width ||
      mouseY > this.height
    ) {
      return undefined;
    }

    const cellNumberX = Math.floor(
      (mouseX + this.cellOffset.x) / this.cellSize
    );
    const cellNumberY = Math.floor(
      (mouseY + this.cellOffset.y) / this.cellSize
    );

    if (mouseX < this.cellSize && mouseY < this.cellSize) {
      return {
        type: 'border',
        axis: 'origin',
        number: 0,
      };
    } else if (mouseX < this.cellSize) {
      return {
        type: 'border',
        axis: 'y',
        number: cellNumberY + this.startCell.y - 1,
      };
    } else if (mouseY < this.cellSize) {
      return {
        type: 'border',
        axis: 'x',
        number: cellNumberX + this.startCell.x - 1,
      };
    } else {
      return {
        type: 'schema',
        i: cellNumberX + this.startCell.x - 1,
        j: cellNumberY + this.startCell.y - 1,
      };
    }
  }

  public forEachCellX(callback: (cellNumberX: number, x: number) => void) {
    for (
      let i = this.startCell.x, x = this.cellSize - this.cellOffset.x;
      i < this.endCell.x;
      i++, x += this.cellSize
    ) {
      callback(i, x);
    }
  }

  public forEachCellY(callback: (cellNumberY: number, Y: number) => void) {
    for (
      let i = this.startCell.y, y = this.cellSize - this.cellOffset.y;
      i < this.endCell.y;
      i++, y += this.cellSize
    ) {
      callback(i, y);
    }
  }

  public forEachCell(
    callback: (
      cellNumberX: number,
      cellNumberY: number,
      x: number,
      y: number
    ) => void
  ) {
    this.forEachCellY((cellNumberY, y) => {
      this.forEachCellX((cellNumberX, x) => {
        callback(cellNumberX, cellNumberY, x, y);
      });
    });
  }
}
