import { Cell } from 'lib/types';
import { Chunk } from '../../Chunk';
import { SchemaViewProvider } from '../../view-providers';
import { AnimationContext, CellAnimation, DrawContext } from './CellAnimation';

export type DrawFunction<Provider extends SchemaViewProvider> = (
  x: number,
  y: number,
  options: {
    time: number;
    cell: Readonly<Cell>;
    deltaTime: number;
    chunk: Chunk;
    drawContext: Omit<DrawContext<Provider>, 'requireRedraw'>;
  }
) => void;

export type ContinuousCellAnimationOptions<
  Provider extends SchemaViewProvider
> = {
  delay?: number;
  trigger?: 'appear';
  duration?: number;
  draw: DrawFunction<Provider>;
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
    private readonly options: ContinuousCellAnimationOptions<Provider>
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

  private validate(options: ContinuousCellAnimationOptions<Provider>) {
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

    let time = performance.now() - this.startTime!;

    const { requireRedraw, ...rest } = this.drawContext;
    this.options.draw(x, y, {
      time,
      cell: this.cell,
      deltaTime,
      chunk,
      drawContext: rest,
    });

    requireRedraw();
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
