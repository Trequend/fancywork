import { AnimationContext, CellAnimation, DrawContext } from '../animations';
import { Chunk } from '../Chunk';
import { SchemaViewProvider } from '../view-providers';
import { SchemaCanvas, SchemaCanvasEventMap } from './SchemaCanvas';

export abstract class AnimatedSchemaCanvas<
  Provider extends SchemaViewProvider = SchemaViewProvider,
  EventMap extends SchemaCanvasEventMap = SchemaCanvasEventMap
> extends SchemaCanvas<Provider, EventMap> {
  private readonly cellAnimations: Record<string, CellAnimation<Provider>> = {};

  private readonly drawContext: DrawContext<Provider> = {
    renderer: this.context,
    requireRedraw: this.requireRedraw.bind(this),
    viewProvider: this.viewProvider,
  };

  protected drawCell(i: number, j: number, x: number, y: number, chunk: Chunk) {
    const key = this.getCellKey(i, j);
    const animation = this.cellAnimations[key];
    if (animation) {
      if (animation.finished) {
        delete this.cellAnimations[key];
      } else {
        animation.draw(x, y, chunk, this.drawContext);

        // Stop propagation
        return true;
      }
    }
  }

  protected postRender(chunk: Chunk) {
    const keys = Object.keys(this.cellAnimations);
    keys.forEach((key) => {
      const animation = this.cellAnimations[key];
      if (animation.finished) {
        delete this.cellAnimations[key];
      } else {
        animation.postRender(chunk, this.drawContext);
      }
    });
  }

  public startCellAnimation(
    animation: new (
      context: AnimationContext<Provider>
    ) => CellAnimation<Provider>,
    i: number,
    j: number
  ) {
    const key = this.getCellKey(i, j);
    const cell = { i, j };
    this.cellAnimations[key] = new animation({
      cell,
      drawContext: this.drawContext,
    });
  }

  public stopCellAnimation(i: number, j: number) {
    const key = this.getCellKey(i, j);
    const animation = this.cellAnimations[key];
    if (animation) {
      animation.stop();
    }
  }

  private getCellKey(i: number, j: number) {
    return `${i}+${j}`;
  }
}
