import { Cell } from 'lib/types';
import { Chunk } from '../../Chunk';
import { Renderer } from '../../renderer';
import { SchemaViewProvider } from '../../view-providers';

export type DrawContext<Provider extends SchemaViewProvider> = {
  renderer: Renderer;
  requireRedraw: () => void;
  viewProvider: Provider;
};

export type AnimationContext<Provider extends SchemaViewProvider> = {
  cell: Cell;
  drawContext: DrawContext<Provider>;
};

export abstract class CellAnimation<Provider extends SchemaViewProvider> {
  protected cell: Cell;

  protected drawContext: DrawContext<Provider>;

  private _finished = false;

  public get finished() {
    return this._finished;
  }

  constructor(context: AnimationContext<Provider>) {
    this.cell = context.cell;
    this.drawContext = context.drawContext;
  }

  public draw(
    _x: number,
    _y: number,
    _chunk: Chunk,
    _context: DrawContext<Provider>
  ) {}

  public postRender(_chunk: Chunk, _context: DrawContext<Provider>) {}

  public stop() {
    this.finish();
    this.onStop();
  }

  protected onStop() {}

  protected finish() {
    this._finished = true;
    this.drawContext.requireRedraw();
  }
}
