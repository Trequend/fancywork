import { WorkViewProvider } from '../../view-providers';
import { AnimationContext, ContinuousAnimation } from '../base';
import { BezierCurveRGBA } from '../bezier-curve';
import {
  CELL_BACKGROUND_COLOR,
  CELL_FOREGROUND_COLOR,
  SELECTED_CELL_BACKGROUND_COLOR,
} from './constants';

export class ColorSelection extends ContinuousAnimation<WorkViewProvider> {
  constructor(
    context: AnimationContext<WorkViewProvider>,
    options: { code: string; mode: 'in' | 'out' }
  ) {
    const duration = 250;

    const from =
      options.mode === 'in'
        ? CELL_BACKGROUND_COLOR
        : SELECTED_CELL_BACKGROUND_COLOR;
    const to =
      options.mode === 'in'
        ? SELECTED_CELL_BACKGROUND_COLOR
        : CELL_BACKGROUND_COLOR;
    const curve = new BezierCurveRGBA([from, to]);

    const { renderer, viewProvider } = context;
    const symbolColor = CELL_FOREGROUND_COLOR;

    super(context, {
      duration,
      draw: (x, y, { i, j, time, chunk }) => {
        const cell = viewProvider.getCell(i, j);
        if (cell) {
          const color = curve.evaluate(time / duration);
          renderer.drawRect(x, y, chunk.cellSize, chunk.cellSize, color);

          const { symbol } = cell;
          renderer.drawSchemaSymbol(symbol, x, y, symbolColor);
        }
      },
      cellPredicate: (i, j) => {
        const cell = viewProvider.getCell(i, j);
        return !!cell && !cell.embroidered && cell.color.code === options.code;
      },
    });
  }
}
