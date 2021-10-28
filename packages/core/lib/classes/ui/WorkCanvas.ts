import { CELL_SIZE, HALF_CELL_SIZE } from 'lib/constants';
import { SchemaCell } from 'lib/types';
import { SchemaCanvas, SchemaCanvasEventMap } from './SchemaCanvas';
import { WorkViewProvider } from './WorkViewProvider';

const MOUSE_LEFT_BUTTON = 1;

type EventMap = {
  cellEmbroidered: { i: number; j: number };
} & SchemaCanvasEventMap;

export class WorkCanvas extends SchemaCanvas<WorkViewProvider, EventMap> {
  protected drawCell(i: number, j: number, x: number, y: number) {
    const cell = this.viewProvider.getCell(i, j);
    if (cell) {
      if (cell.embroidered) {
        this.context.fillStyle = cell.color.hex;
        this.context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      } else {
        this.context.fillStyle = '#000';
        this.context.fillText(
          cell.symbol,
          x + HALF_CELL_SIZE,
          y + HALF_CELL_SIZE
        );
      }
    }
  }

  protected onSchemaCellClick(cell: SchemaCell) {
    const { i, j } = cell;
    const schemaCell = this.viewProvider.getCell(i, j);
    if (schemaCell && !schemaCell.embroidered) {
      this.viewProvider.embroiderСell(i, j);
      this.emit('cellEmbroidered', { i, j });
      this.requireRedraw();
    }
  }

  protected onSchemaCellMouseMove(cell: SchemaCell, event: MouseEvent) {
    if (event.buttons === MOUSE_LEFT_BUTTON) {
      const { i, j } = cell;
      const schemaCell = this.viewProvider.getCell(i, j);
      if (schemaCell && !schemaCell.embroidered) {
        this.viewProvider.embroiderСell(i, j);
        this.emit('cellEmbroidered', { i, j });
        this.requireRedraw();
      }
    }
  }
}
