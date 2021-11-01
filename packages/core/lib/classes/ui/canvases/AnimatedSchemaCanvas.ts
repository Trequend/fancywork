import { AnimationContext, Animation } from '../animations';
import { Chunk } from '../Chunk';
import { SchemaViewProvider } from '../view-providers';
import { SchemaCanvas, SchemaCanvasEventMap } from './SchemaCanvas';

export abstract class AnimatedSchemaCanvas<
  Provider extends SchemaViewProvider = SchemaViewProvider,
  EventMap extends SchemaCanvasEventMap = SchemaCanvasEventMap
> extends SchemaCanvas<Provider, EventMap> {
  private animations: Array<Animation<Provider>> = [];

  private readonly context: AnimationContext<Provider> = {
    renderer: this.renderer,
    requireRedraw: this.requireRedraw.bind(this),
    viewProvider: this.viewProvider,
  };

  protected drawCell(i: number, j: number, x: number, y: number, chunk: Chunk) {
    const animationIndex = this.animations.findIndex(
      ({ cellPredicate }) => cellPredicate && cellPredicate(i, j)
    );

    if (animationIndex !== -1) {
      const animation = this.animations[animationIndex];
      if (animation.finished) {
        this.animations.splice(animationIndex, 1);
      } else {
        animation.draw(i, j, x, y, chunk, this.context);

        // Stop propagation
        return true;
      }
    }
  }

  protected postRender(chunk: Chunk) {
    const animations = [...this.animations];
    animations.forEach((animation, index) => {
      if (animation.finished) {
        this.animations.splice(index, 1);
      } else {
        animation.postRender(chunk, this.context);
      }
    });
  }

  public startAnimation<
    A extends new (
      context: AnimationContext<Provider>,
      ...args: any[]
    ) => Animation<Provider>
  >(
    animation: A,
    ...args: A extends new (
      context: AnimationContext<Provider>,
      ...args: infer U
    ) => Animation<Provider>
      ? U
      : any[]
  ) {
    this.animations.unshift(new animation(this.context, ...args));
  }

  public stopAnimation(
    animation: new (
      context: AnimationContext<Provider>,
      ...args: any[]
    ) => Animation<Provider>
  ) {
    this.animations = this.animations.filter((value) => {
      return !(value instanceof animation);
    });
  }
}
