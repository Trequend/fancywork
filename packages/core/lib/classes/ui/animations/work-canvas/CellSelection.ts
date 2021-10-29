import { RGBColor } from '../../../common';
import { WorkViewProvider } from '../../view-providers';
import { AnimationContext, ContinuousCellAnimation } from '../base';
import { BezierCurveRGB } from '../bezier-curve';

export class CellSelection extends ContinuousCellAnimation<WorkViewProvider> {
  constructor(context: AnimationContext<WorkViewProvider>) {
    const data = CellSelection.prepare(context);
    if (!data) {
      return;
    }

    const { curve, duration, symbol } = data;
    const { renderer } = context.drawContext;

    super(context, {
      trigger: 'appear',
      duration,
      draw: (x, y, { time, chunk }) => {
        const color = curve.evaluate(time / duration);
        renderer.fillStyle = color.toString();
        renderer.fillRect(x, y, chunk.cellSize, chunk.cellSize);

        renderer.fillStyle = '#000';
        renderer.fillText(
          symbol,
          x + chunk.halfCellSize,
          y + chunk.halfCellSize
        );
      },
    });
  }

  private static prepare(context: AnimationContext<WorkViewProvider>) {
    const { cell, drawContext } = context;
    const { viewProvider } = drawContext;
    const cellInfo = viewProvider.getCell(cell.i, cell.j);
    if (!cellInfo) {
      return;
    }

    return {
      symbol: cellInfo.symbol,
      duration: 600,
      curve: new BezierCurveRGB([
        new RGBColor(255, 255, 255),
        new RGBColor(52, 157, 255),
        new RGBColor(255, 255, 255),
      ]),
    };
  }
}
