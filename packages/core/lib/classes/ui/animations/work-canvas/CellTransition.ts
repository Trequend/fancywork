import { RGBAColor, RGBColor } from '../../../common';
import { WorkViewProvider } from '../../view-providers';
import { AnimationContext, ContinuousCellAnimation } from '../base';
import { BezierCurveRGB, BezierCurveRGBA } from '../bezier-curve';

type CellTransitionOptions = {
  mode: 'fade-in' | 'fade-out';
  duration: number;
};

export class CellTransition extends ContinuousCellAnimation<WorkViewProvider> {
  constructor(
    context: AnimationContext<WorkViewProvider>,
    options: CellTransitionOptions
  ) {
    const data = CellTransition.prepare(context, options);
    if (!data) {
      return;
    }

    const { colorCurve, symbolColorCurve, symbol } = data;
    const { renderer } = context.drawContext;

    super(context, {
      duration: options.duration,
      draw: (x, y, { time, chunk }) => {
        const color = colorCurve.evaluate(time / options.duration);
        renderer.fillStyle = color.toString();
        renderer.fillRect(x, y, chunk.cellSize, chunk.cellSize);

        const symbolColor = symbolColorCurve.evaluate(time / options.duration);
        renderer.fillStyle = symbolColor.toString();
        renderer.fillText(
          symbol,
          x + chunk.halfCellSize,
          y + chunk.halfCellSize
        );
      },
    });
  }

  private static prepare(
    context: AnimationContext<WorkViewProvider>,
    options: CellTransitionOptions
  ) {
    const { cell, drawContext } = context;
    const { viewProvider } = drawContext;
    const cellInfo = viewProvider.getCell(cell.i, cell.j);
    if (!cellInfo) {
      return;
    }

    const fromColor =
      options.mode === 'fade-in'
        ? new RGBColor(255, 255, 255)
        : RGBColor.fromHex(cellInfo.color.hex);
    const toColor =
      options.mode === 'fade-in'
        ? RGBColor.fromHex(cellInfo.color.hex)
        : new RGBColor(255, 255, 255);
    const colorCurve = new BezierCurveRGB([fromColor, toColor]);

    const { symbol, symbolColor } = cellInfo;
    const { red, green, blue } = RGBColor.fromHex(symbolColor);
    const visibleSymbolColor = new RGBAColor(red, green, blue, 255);
    const invisibleSymbolColor = new RGBAColor(red, green, blue, 0);
    const fromSymbolColor =
      options.mode === 'fade-in' ? visibleSymbolColor : invisibleSymbolColor;
    const toSymbolColor =
      options.mode === 'fade-in' ? invisibleSymbolColor : visibleSymbolColor;
    const symbolColorCurve = new BezierCurveRGBA([
      fromSymbolColor,
      toSymbolColor,
    ]);

    return {
      symbol,
      colorCurve,
      symbolColorCurve,
    };
  }
}
