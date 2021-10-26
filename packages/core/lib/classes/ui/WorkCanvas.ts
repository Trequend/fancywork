import { CELL_SIZE } from 'lib/constants';
import { SchemaCell } from 'lib/types';
import { SchemaCanvas, SchemaCanvasEventMap } from './SchemaCanvas';
import { WorkViewProvider } from './WorkViewProvider';

type EventMap = {
  cellEmbroidered: { i: number; j: number };
} & SchemaCanvasEventMap;

export class WorkCanvas extends SchemaCanvas<WorkViewProvider, EventMap> {
  protected drawCell(i: number, j: number, x: number, y: number) {
    const cell = this.viewProvider.getCell(i, j);
    if (cell) {
      if (cell.embroidered) {
        this.context.fillStyle = cell.color.hexColor;
        this.context.fillRect(x, y, CELL_SIZE, CELL_SIZE);
      } else {
        super.drawCell(i, j, x, y);
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
}
