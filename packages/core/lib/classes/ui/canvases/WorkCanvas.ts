import { RGBAColor } from '../../common';
import { SchemaCell } from 'lib/types';
import { CellTransition } from '../animations/work-canvas';
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
  private eraseMode = false;

  private penColorCode?: string;

  protected drawCell(i: number, j: number, x: number, y: number, chunk: Chunk) {
    const prevented = super.drawCell(i, j, x, y, chunk);
    if (prevented) {
      return true;
    }

    const cell = this.viewProvider.getCell(i, j);
    if (cell) {
      if (cell.embroidered) {
        const color = RGBAColor.fromHex(cell.color.hex);
        this.renderer.drawRect(x, y, chunk.cellSize, chunk.cellSize, color);
      } else {
        const color = new RGBAColor(0, 0, 0, 255);
        if (cell.color.code === this.penColorCode) {
          const backgroundColor = new RGBAColor(210, 210, 210, 255);
          this.renderer.drawRect(
            x,
            y,
            chunk.cellSize,
            chunk.cellSize,
            backgroundColor
          );
        }

        this.renderer.drawSchemaSymbol(cell.symbol, x, y, color);
      }
    }
  }

  public setIsEraseMode(value: boolean) {
    this.eraseMode = value;
    this.requireRedraw();
  }

  public setPenColorCode(code?: string) {
    this.penColorCode = code;
    this.requireRedraw();
  }

  public scrollToNotEmbroidered(colorCode: string) {
    const { width, height } = this.viewProvider.schema.metadata.canvasMetadata;
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const cell = this.viewProvider.getCell(i, j);
        if (cell && cell.color.code === colorCode && !cell.embroidered) {
          this.scrollToCell(
            { i, j, type: 'schema' },
            {
              center: true,
            }
          );
          return;
        }
      }
    }
  }

  protected onSchemaCellClick(cell: SchemaCell) {
    this.processCell(cell);
  }

  protected onSchemaCellPointerMove(cell: SchemaCell, event: PointerEvent) {
    if (event.buttons === MOUSE_LEFT_BUTTON) {
      this.processCell(cell);
    }
  }

  protected onSchemaCellTouchStart(cell: SchemaCell, event: TouchEvent) {
    const processed = this.processCell(cell);
    if (processed) {
      event.preventDefault();
    }
  }

  protected onSchemaCellTouchMove(cell: SchemaCell) {
    this.processCell(cell);
  }

  private processCell(cell: SchemaCell) {
    const { i, j } = cell;
    const schemaCell = this.viewProvider.getCell(i, j);
    if (schemaCell === null) {
      return false;
    }

    if (schemaCell.color.code !== this.penColorCode && !this.eraseMode) {
      return false;
    }

    if (schemaCell.embroidered && this.eraseMode) {
      this.eraseCell(i, j);
      return true;
    } else if (!schemaCell.embroidered && !this.eraseMode) {
      this.embroiderСell(i, j);
      return true;
    }

    return false;
  }

  private eraseCell(i: number, j: number) {
    this.viewProvider.eraseCell(i, j);
    this.forceUpdateCell(i, j);
    this.startCellAnimation(CellTransition, i, j, {
      mode: 'fade-out',
      duration: 100,
    });
    this.emit('cellErased', { i, j });
  }

  private embroiderСell(i: number, j: number) {
    this.viewProvider.embroiderСell(i, j);
    this.forceUpdateCell(i, j);
    this.startCellAnimation(CellTransition, i, j, {
      mode: 'fade-in',
      duration: 100,
    });
    this.emit('cellEmbroidered', { i, j });
  }

  private forceUpdateCell(i: number, j: number) {
    this.stopCellAnimation(i, j);
    this.requireRedraw();
  }
}
