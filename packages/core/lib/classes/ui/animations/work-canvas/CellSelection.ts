import { RGBColor } from '../../../common';
import { WorkViewProvider } from '../../view-providers';
import { AnimationContext, ContinuousCellAnimation } from '../base';
import { BezierCurveRGB } from '../bezier-curve';

export class CellSelection extends ContinuousCellAnimation<WorkViewProvider> {
  constructor(context: AnimationContext<WorkViewProvider>) {
    const curve = new BezierCurveRGB([
      new RGBColor(255, 255, 255),
      new RGBColor(52, 157, 255),
      new RGBColor(255, 255, 255),
    ]);

    const duration = 600;

    super(context, {
      trigger: 'appear',
      duration,
      draw: (x, y, { cell, time, drawContext, chunk }) => {
        const { renderer, viewProvider } = drawContext;
        const cellInfo = viewProvider.getCell(cell.i, cell.j);
        if (cellInfo) {
          const { symbol } = cellInfo;
          const color = curve.evaluate(time / duration);

          renderer.fillStyle = `rgb(${color.red}, ${color.green}, ${color.blue})`;
          renderer.fillRect(x, y, chunk.cellSize, chunk.cellSize);

          renderer.fillStyle = '#000';
          renderer.fillText(
            symbol,
            x + chunk.halfCellSize,
            y + chunk.halfCellSize
          );
        }
      },
    });
  }
}
