import { Chunk } from '../../Chunk';
import { SchemaViewProvider } from '../../view-providers';
import { AnimationContext, CellAnimation } from './CellAnimation';

export type DrawFunction = (
  x: number,
  y: number,
  options: {
    time: number;
    deltaTime: number;
    chunk: Chunk;
  }
) => void;

export type ContinuousCellAnimationOptions = {
  delay?: number;
  trigger?: 'appear';
  duration?: number;
  draw: DrawFunction;
};

export abstract class ContinuousCellAnimation<
  Provider extends SchemaViewProvider
> extends CellAnimation<Provider> {
  private started = false;

  private startTime?: number;

  private timeoutKey?: NodeJS.Timeout;

  private lastFrameTime?: number;

  public constructor(
    context: AnimationContext<Provider>,
    private readonly options: ContinuousCellAnimationOptions
  ) {
    super(context);

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

  private validate(options: ContinuousCellAnimationOptions) {
    if (options.delay && options.delay < 0) {
      throw new RangeError('delay must be in range [0, infinity]');
    }

    if (options.duration && options.duration < 0) {
      throw new RangeError('duration must be in range [0, infinity]');
    }
  }

  public draw(x: number, y: number, chunk: Chunk) {
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
      time,
      deltaTime,
      chunk,
    });

    this.drawContext.requireRedraw();
  }

  private start() {
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
