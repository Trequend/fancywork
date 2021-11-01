import { RGBAColor } from '../../../common';
import { WorkViewProvider } from '../../view-providers';
import { AnimationContext, ContinuousAnimation } from '../base';
import { BezierCurveRGBA } from '../bezier-curve';
import { CELL_FOREGROUND_COLOR } from './constants';

export class CellTransition extends ContinuousAnimation<WorkViewProvider> {
  constructor(
    context: AnimationContext<WorkViewProvider>,
    options: {
      i: number;
      j: number;
      mode: 'embroider' | 'erase';
      fromColor: RGBAColor;
      toColor: RGBAColor;
    }
  ) {
    const duration = 150;
    const { renderer, viewProvider } = context;
    const cell = viewProvider.getCell(options.i, options.j);
    if (!cell) {
      super(context);
      return;
    }

    const colorCurve = new BezierCurveRGBA([
      options.fromColor,
      options.toColor,
    ]);

    const { symbol } = cell;
    const transparent = new RGBAColor(0, 0, 0, 0);
    const symbolColor = CELL_FOREGROUND_COLOR;
    const symbolColorFrom =
      options.mode === 'embroider' ? symbolColor : transparent;
    const symbolColorTo =
      options.mode === 'embroider' ? transparent : symbolColor;
    const symbolColorCurve = new BezierCurveRGBA([
      symbolColorFrom,
      symbolColorTo,
    ]);

    super(context, {
      duration,
      draw: (x, y, { time, chunk }) => {
        const color = colorCurve.evaluate(time / duration);
        renderer.drawRect(x, y, chunk.cellSize, chunk.cellSize, color);

        const symbolColor = symbolColorCurve.evaluate(time / duration);
        renderer.drawSchemaSymbol(symbol, x, y, symbolColor);
      },
      cellPredicate: (i, j) => {
        if (i !== options.i || j !== options.j) {
          return false;
        }

        const cell = viewProvider.getCell(i, j);
        if (cell) {
          const { mode } = options;
          return (
            (cell.embroidered && mode === 'embroider') ||
            (!cell.embroidered && mode === 'erase')
          );
        } else {
          return false;
        }
      },
    });
  }
}
