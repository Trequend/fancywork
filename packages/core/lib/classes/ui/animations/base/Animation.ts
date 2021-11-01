import { Chunk } from '../../Chunk';
import { Renderer } from '../../renderer';
import { SchemaViewProvider } from '../../view-providers';

export type AnimationContext<Provider extends SchemaViewProvider> = {
  renderer: Renderer;
  requireRedraw: () => void;
  viewProvider: Provider;
};

export type CellPredicate = (i: number, j: number) => boolean;

export abstract class Animation<Provider extends SchemaViewProvider> {
  private _finished = false;

  public get finished() {
    return this._finished;
  }

  constructor(
    protected readonly context: AnimationContext<Provider>,
    public readonly cellPredicate?: CellPredicate
  ) {}

  public draw(
    _i: number,
    _j: number,
    _x: number,
    _y: number,
    _chunk: Chunk,
    _context: AnimationContext<Provider>
  ) {}

  public postRender(_chunk: Chunk, _context: AnimationContext<Provider>) {}

  public stop() {
    this.finish();
    this.onStop();
  }

  protected onStop() {}

  protected finish() {
    this._finished = true;
    this.context.requireRedraw();
  }
}
