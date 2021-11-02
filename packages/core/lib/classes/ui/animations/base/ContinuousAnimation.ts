import { Chunk } from '../../Chunk';
import { SchemaViewProvider } from '../../view-providers';
import { Animation, AnimationContext, CellPredicate } from './Animation';

export type DrawFunction = (
  x: number,
  y: number,
  options: {
    i: number;
    j: number;
    time: number;
    deltaTime: number;
    chunk: Chunk;
  }
) => void;

export type ContinuousAnimationOptions = {
  delay?: number;
  trigger?: 'appear';
  duration?: number;
  draw: DrawFunction;
  cellPredicate?: CellPredicate;
};

export abstract class ContinuousAnimation<
  Provider extends SchemaViewProvider
> extends Animation<Provider> {
  private started = false;

  private startTime?: number;

  private timeoutKey?: NodeJS.Timeout;

  private lastFrameTime?: number;

  public constructor(
    context: AnimationContext<Provider>,
    private options?: ContinuousAnimationOptions
  ) {
    super(context, options?.cellPredicate);
    if (!options) {
      this.finish();
      return;
    }

    this.validate(options);

    if (options.trigger === undefined) {
      if (options.delay) {
        this.timeoutKey = setTimeout(() => {
          this.start();
        }, options.delay);
      } else {
        this.start();
      }
    }
  }

  private validate(options: ContinuousAnimationOptions) {
    if (options.delay && options.delay < 0) {
      throw new RangeError('delay must be in range [0, infinity]');
    }

    if (options.duration && options.duration < 0) {
      throw new RangeError('duration must be in range [0, infinity]');
    }
  }

  public draw(i: number, j: number, x: number, y: number, chunk: Chunk) {
    if (!this.options) {
      return;
    }

    let deltaTime: number;
    if (this.started) {
      deltaTime = performance.now() - this.lastFrameTime!;
      this.lastFrameTime = performance.now();
    } else if (this.options.delay === undefined) {
      deltaTime = 0;
      this.start();
    } else {
      return;
    }

    const time = performance.now() - this.startTime!;

    this.options.draw(x, y, {
      i,
      j,
      time,
      deltaTime,
      chunk,
    });

    this.context.requireRedraw();
  }

  private start() {
    if (!this.options) {
      return;
    }

    this.started = true;
    this.startTime = performance.now();
    this.lastFrameTime = performance.now();
    if (this.options.duration) {
      this.timeoutKey = setTimeout(() => {
        this.finish();
      }, this.options.duration);
    }
  }

  protected onStop() {
    if (this.timeoutKey) {
      clearTimeout(this.timeoutKey);
    }
  }
}
