import { Cell, SchemaCell } from 'lib/types';
import { CellSelection } from '../animations/work-canvas';
import { Chunk } from '../Chunk';
import { WorkViewProvider } from '../view-providers';
import { AnimatedSchemaCanvas } from './AnimatedSchemaCanvas';
import { SchemaCanvasEventMap } from './SchemaCanvas';

const MOUSE_LEFT_BUTTON = 1;

type EventMap = {
  cellEmbroidered: { i: number; j: number };
  cellErased: { i: number; j: number };
} & SchemaCanvasEventMap;

export class WorkCanvas extends AnimatedSchemaCanvas<
  WorkViewProvider,
  EventMap
> {
  public eraseMode = false;

  public penColorCode?: string;

  private selectedCell: Cell | null = null;

  protected drawCell(i: number, j: number, x: number, y: number, chunk: Chunk) {
    const prevented = super.drawCell(i, j, x, y, chunk);
    if (prevented) {
      return true;
    }

    const cell = this.viewProvider.getCell(i, j);
    if (cell) {
      if (cell.embroidered) {
        this.context.fillStyle = cell.color.hex;
        this.context.fillRect(x, y, chunk.cellSize, chunk.cellSize);
      } else {
        this.context.fillStyle = '#000';
        this.context.fillText(
          cell.symbol,
          x + chunk.halfCellSize,
          y + chunk.halfCellSize
        );
      }
    }
  }

  public scrollToNotEmbroidered(colorCode: string) {
    const { width, height } = this.viewProvider.schema.metadata.canvasMetadata;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const cell = this.viewProvider.getCell(i, j);
        if (cell && cell.color.code === colorCode && !cell.embroidered) {
          this.selectCell(i, j);
          return;
        }
      }
    }
  }

  protected onSchemaCellClick(cell: SchemaCell) {
    this.processCell(cell);
  }

  protected onSchemaCellMouseMove(cell: SchemaCell, event: MouseEvent) {
    if (event.buttons === MOUSE_LEFT_BUTTON) {
      this.processCell(cell);
    }
  }

  private processCell(cell: SchemaCell) {
    const { i, j } = cell;
    const schemaCell = this.viewProvider.getCell(i, j);
    if (schemaCell === null) {
      return;
    }

    if (schemaCell.color.code !== this.penColorCode && !this.eraseMode) {
      return;
    }

    if (schemaCell.embroidered && this.eraseMode) {
      this.viewProvider.eraseCell(i, j);
      this.forceUpdateCell(i, j);
      this.emit('cellErased', { i, j });
    } else if (!schemaCell.embroidered && !this.eraseMode) {
      this.viewProvider.embroiderСell(i, j);
      this.forceUpdateCell(i, j);
      this.emit('cellEmbroidered', { i, j });
    }
  }

  private forceUpdateCell(i: number, j: number) {
    if (
      this.selectedCell &&
      this.selectedCell.i === i &&
      this.selectedCell.j === j
    ) {
      this.clearSelection();
    }

    this.stopCellAnimation(i, j);
    this.requireRedraw();
  }

  public selectCell(i: number, j: number) {
    this.clearSelection();
    this.selectedCell = { i, j };
    this.startCellAnimation(CellSelection, i, j);
    this.scrollToCell(
      { i, j, type: 'schema' },
      {
        center: true,
      }
    );
  }

  public clearSelection() {
    if (this.selectedCell) {
      const { i, j } = this.selectedCell;
      this.stopCellAnimation(i, j);
      this.selectedCell = null;
    }
  }
}
