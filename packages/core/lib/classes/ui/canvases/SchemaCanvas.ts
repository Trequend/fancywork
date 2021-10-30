import { CELL_SIZE } from 'lib/constants';
import { cellsEquals } from 'lib/functions';
import { BorderCell, SchemaCell } from 'lib/types';
import { EventEmitter, Vector2, Vector2Int } from '../../common';
import { Chunk } from '../Chunk';
import { SchemaViewProvider } from '../view-providers';

export type SchemaCanvasEventMap = {
  schemaCellClick: { cell: SchemaCell; pointerEvent: PointerEvent };
  borderCellClick: { cell: BorderCell; pointerEvent: PointerEvent };
  schemaCellPointerMove: { cell: SchemaCell; pointerEvent: PointerEvent };
  borderCellPointerMove: { cell: BorderCell; pointerEvent: PointerEvent };
  schemaCellTouchStart: { cell: SchemaCell; touchEvent: TouchEvent };
  borderCellTouchStart: { cell: BorderCell; touchEvent: TouchEvent };
  schemaCellTouchMove: { cell: SchemaCell; touchEvent: TouchEvent };
  borderCellTouchMove: { cell: BorderCell; touchEvent: TouchEvent };
  destroy: Record<string, never>;
  redraw: Chunk;
};

export type ScrollToCellOptions = {
  center: boolean;
};

export class SchemaCanvas<
  Provider extends SchemaViewProvider = SchemaViewProvider,
  EventMap extends SchemaCanvasEventMap = SchemaCanvasEventMap
> extends EventEmitter<EventMap, SchemaCanvas<Provider, EventMap>> {
  protected readonly context: CanvasRenderingContext2D;

  protected readonly cellsCount;

  private readonly scrollArea: HTMLDivElement;

  private drawRequired = true;

  private _isDestroyed = false;

  public get isDestroyed() {
    return this._isDestroyed;
  }

  constructor(public readonly viewProvider: Provider, root: HTMLDivElement) {
    super();

    const { width, height } = this.viewProvider.schema.metadata.canvasMetadata;

    this.cellsCount = new Vector2Int(width, height);

    const canvas = this.createCanvas();
    const context = canvas.getContext('2d');
    if (context) {
      this.context = context;
    } else {
      throw new Error('2d context not supported');
    }

    this.scrollArea = this.createScrollArea();

    root.innerHTML = '';
    root.appendChild(canvas);
    root.appendChild(this.scrollArea);

    this.resize();
    this.attach();
  }

  private createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    return canvas;
  }

  private createScrollArea() {
    const scrollArea = document.createElement('div');
    scrollArea.style.position = 'absolute';
    scrollArea.style.width = '100%';
    scrollArea.style.height = '100%';
    scrollArea.style.zIndex = '10';
    scrollArea.style.overflow = 'auto';
    scrollArea.style.touchAction = 'pan-x pan-y';

    const mock = document.createElement('div');
    mock.style.width = `${CELL_SIZE * (this.cellsCount.x + 1)}px`;
    mock.style.height = `${CELL_SIZE * (this.cellsCount.y + 1)}px`;

    scrollArea.appendChild(mock);
    return scrollArea;
  }

  private attach() {
    // Global
    window.addEventListener('resize', this.onResize);
    window.requestAnimationFrame(() => {
      this.drawLoop();
    });

    // Local
    this.scrollArea.addEventListener('pointerdown', this.onPointerDown);
    this.scrollArea.addEventListener('pointermove', this.onPointerMove);
    this.scrollArea.addEventListener('pointerup', this.onPointerUp);
    this.scrollArea.addEventListener('pointercancel', this.onPointerCancel);

    this.scrollArea.addEventListener('touchstart', this.onTouchStart);
    this.scrollArea.addEventListener('touchmove', this.onTouchMove);
    this.scrollArea.addEventListener('touchend', this.onTouchEnd);

    this.scrollArea.addEventListener('scroll', this.onScroll);
  }

  private detach() {
    // Global only
    window.removeEventListener('resize', this.onResize);
  }

  private onScroll = () => {
    this.drawRequired = true;
  };

  private onResize = () => {
    this.resize();
  };

  private resize() {
    const canvas = this.context.canvas;
    const ratio = Math.ceil(window.devicePixelRatio);
    canvas.style.width = `${this.scrollArea.clientWidth}px`;
    canvas.style.height = `${this.scrollArea.clientHeight}px`;
    canvas.width = this.scrollArea.clientWidth * ratio;
    canvas.height = this.scrollArea.clientHeight * ratio;
    this.context.setTransform(ratio, 0, 0, ratio, 0, 0);
    this.drawRequired = true;
  }

  private pointerDownPosition: Vector2 | null = null;

  private onPointerDown = (pointerEvent: PointerEvent) => {
    if (pointerEvent.isPrimary) {
      this.scrollArea.setPointerCapture(pointerEvent.pointerId);
      this.pointerDownPosition = this.clientPositionToCanvas(
        pointerEvent.clientX,
        pointerEvent.clientY
      );
    }
  };

  private onPointerMove = (pointerEvent: PointerEvent) => {
    if (!pointerEvent.isPrimary) {
      return;
    }

    const position = this.clientPositionToCanvas(
      pointerEvent.clientX,
      pointerEvent.clientY
    );
    const chunk = this.computeChunk();
    const cell = chunk.getCellByCanvasPosition(position.x, position.y);
    if (cell === null) {
      return;
    }

    switch (cell.type) {
      case 'border':
        this.emit('borderCellPointerMove', { cell, pointerEvent }) ||
          this.onBorderCellPointerMove(cell, pointerEvent);
        break;
      case 'schema':
        this.emit('schemaCellPointerMove', { cell, pointerEvent }) ||
          this.onSchemaCellPointerMove(cell, pointerEvent);
        break;
      default:
        throw new Error('Not implemented');
    }
  };

  private onPointerUp = (pointerEvent: PointerEvent) => {
    if (this.pointerDownPosition === null || !pointerEvent.isPrimary) {
      return;
    }

    const chunk = this.computeChunk();
    const clickPosition = this.clientPositionToCanvas(
      pointerEvent.clientX,
      pointerEvent.clientY
    );
    const poinerDownCell = chunk.getCellByCanvasPosition(
      this.pointerDownPosition.x,
      this.pointerDownPosition.y
    );
    const clickCell = chunk.getCellByCanvasPosition(
      clickPosition.x,
      clickPosition.y
    );

    this.pointerDownPosition = null;

    if (poinerDownCell === null || clickCell === null) {
      return;
    }

    if (cellsEquals(poinerDownCell, clickCell)) {
      switch (clickCell.type) {
        case 'border':
          this.emit('borderCellClick', { cell: clickCell, pointerEvent }) ||
            this.onBorderCellClick(clickCell, pointerEvent);
          break;
        case 'schema':
          this.emit('schemaCellClick', { cell: clickCell, pointerEvent }) ||
            this.onSchemaCellClick(clickCell, pointerEvent);
          break;
        default:
          throw new Error('Not implemented');
      }
    }
  };

  private onPointerCancel = (poinerEvent: PointerEvent) => {
    if (poinerEvent.isPrimary) {
      this.pointerDownPosition = null;
    }
  };

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onBorderCellClick(
    _cell: BorderCell,
    _pointerEvent: PointerEvent
  ): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onSchemaCellClick(
    _cell: SchemaCell,
    _pointerEvent: PointerEvent
  ): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onBorderCellPointerMove(
    _cell: BorderCell,
    _pointerEvent: PointerEvent
  ): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onSchemaCellPointerMove(
    _cell: SchemaCell,
    _pointerEvent: PointerEvent
  ): boolean | void {}

  private touchStarted = false;

  private touchScrollPrevented = false;

  private onTouchStart = (touchEvent: TouchEvent) => {
    if (this.touchStarted) {
      return;
    }

    this.touchStarted = true;
    this.touchScrollPrevented = false;

    const chunk = this.computeChunk();
    const position = this.clientPositionToCanvas(
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );
    const cell = chunk.getCellByCanvasPosition(position.x, position.y);

    if (cell === null) {
      return;
    }

    switch (cell.type) {
      case 'border':
        this.emit('borderCellTouchStart', { cell, touchEvent }) ||
          this.onBorderCellTouchStart(cell, touchEvent);
        break;
      case 'schema':
        this.emit('schemaCellTouchStart', { cell, touchEvent }) ||
          this.onSchemaCellTouchStart(cell, touchEvent);
        break;
      default:
        throw new Error('Not implemented');
    }

    if (touchEvent.defaultPrevented) {
      this.touchScrollPrevented = true;
    }
  };

  private onTouchMove = (touchEvent: TouchEvent) => {
    if (this.touchScrollPrevented) {
      touchEvent.preventDefault();
    } else {
      return;
    }

    const chunk = this.computeChunk();
    const position = this.clientPositionToCanvas(
      touchEvent.touches[0].clientX,
      touchEvent.touches[0].clientY
    );
    const cell = chunk.getCellByCanvasPosition(position.x, position.y);

    if (cell === null) {
      return;
    }

    switch (cell.type) {
      case 'border':
        this.emit('borderCellTouchMove', { cell, touchEvent }) ||
          this.onBorderCellTouchMove(cell, touchEvent);
        break;
      case 'schema':
        this.emit('schemaCellTouchMove', { cell, touchEvent }) ||
          this.onSchemaCellTouchMove(cell, touchEvent);
        break;
      default:
        throw new Error('Not implemented');
    }
  };

  private onTouchEnd = (touchEvent: TouchEvent) => {
    // Last touch end
    if (touchEvent.touches.length === 0) {
      this.touchStarted = false;
      this.touchScrollPrevented = false;
    }
  };

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onBorderCellTouchStart(
    _cell: BorderCell,
    _touchEvent: TouchEvent
  ): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onSchemaCellTouchStart(
    _cell: SchemaCell,
    _touchEvent: TouchEvent
  ): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onBorderCellTouchMove(
    _cell: BorderCell,
    _touchEvent: TouchEvent
  ): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onSchemaCellTouchMove(
    _cell: SchemaCell,
    _touchEvent: TouchEvent
  ): boolean | void {}

  private clientPositionToCanvas(x: number, y: number) {
    const rect = this.scrollArea.getBoundingClientRect();
    return new Vector2(x - rect.x, y - rect.y);
  }

  public scrollToCell(
    cell: SchemaCell | BorderCell,
    options?: ScrollToCellOptions
  ) {
    let x: number;
    let y: number;

    if (cell.type === 'border') {
      x = cell.axis === 'x' ? cell.number * CELL_SIZE : 0;
      y = cell.axis === 'y' ? cell.number * CELL_SIZE : 0;
    } else {
      x = cell.i * CELL_SIZE;
      y = cell.j * CELL_SIZE;
    }

    const scrollArea = this.scrollArea;
    const offset = new Vector2(
      options && options.center ? -(scrollArea.clientWidth / 2 - CELL_SIZE) : 0,
      options && options.center ? -(scrollArea.clientHeight / 2 - CELL_SIZE) : 0
    );
    scrollArea.scroll({
      left: x + offset.x,
      top: y + offset.y,
      behavior: 'smooth',
    });
  }

  protected requireRedraw() {
    this.drawRequired = true;
  }

  private drawLoop() {
    if (this.isDestroyed) {
      return;
    }

    if (this.drawRequired) {
      this.drawRequired = false;
      this.draw();
    }

    window.requestAnimationFrame(() => {
      this.drawLoop();
    });
  }

  private draw() {
    const time = performance.now();
    const canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    const chunk = this.computeChunk();

    this.preRender(chunk);
    this.drawCells(chunk);
    this.drawScale(chunk);
    this.drawGrid(chunk);
    this.postRender(chunk);

    this.emit('redraw', chunk) || this.onRedraw(chunk);
    const delta = Math.round(performance.now() - time);
    this.context.fillText(
      delta.toString(),
      chunk.halfCellSize,
      chunk.halfCellSize
    );
  }

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected preRender(_chunk: Chunk): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected postRender(_chunk: Chunk): boolean | void {}

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onRedraw(_chunk: Chunk): boolean | void {}

  protected drawCells(chunk: Chunk) {
    this.context.textAlign = 'center';
    this.context.font = '16px sans-serif';
    this.context.textBaseline = 'middle';

    chunk.forEachCell(this.drawCell.bind(this));
  }

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected drawCell(
    i: number,
    j: number,
    x: number,
    y: number,
    chunk: Chunk
  ): boolean | void {
    const cell = this.viewProvider.getCell(i, j);
    if (cell === null) {
      return;
    }

    this.context.fillStyle = cell.color.hex;
    this.context.fillRect(x, y, chunk.cellSize, chunk.cellSize);

    this.context.fillStyle = cell.symbolColor;
    this.context.fillText(
      cell.symbol,
      x + chunk.halfCellSize,
      y + chunk.halfCellSize
    );
  }

  private drawScale(chunk: Chunk) {
    const canvas = this.context.canvas;

    this.context.clearRect(0, 0, canvas.width, chunk.cellSize);
    this.context.clearRect(0, 0, chunk.cellSize, canvas.height);

    this.context.fillStyle = 'black';
    this.context.textAlign = 'center';
    this.context.font = 'bold 16px sans-serif';
    this.context.textBaseline = 'middle';

    chunk.forEachCellI((i, x) => {
      const number = (i + 1).toString();
      this.context.fillText(number, x + chunk.halfCellSize, chunk.halfCellSize);
    });

    chunk.forEachCellJ((j, y) => {
      const number = (j + 1).toString();
      this.context.fillText(number, chunk.halfCellSize, y + chunk.halfCellSize);
    });
  }

  private drawGrid(chunk: Chunk) {
    this.context.clearRect(0, 0, chunk.cellSize, chunk.cellSize);

    this.context.fillStyle = 'black';

    this.context.lineWidth = 2.5;
    this.context.beginPath();
    this.context.moveTo(chunk.cellSize, 0);
    this.context.lineTo(chunk.cellSize, chunk.height);
    this.context.moveTo(0, chunk.cellSize);
    this.context.lineTo(chunk.width, chunk.cellSize);
    this.context.stroke();

    this.context.lineWidth = 1.5;
    this.context.beginPath();
    chunk.forEachCellI((i, x) => {
      if ((i + 1) % 9 === 0) {
        x += chunk.cellSize;
        this.context.moveTo(x, 0);
        this.context.lineTo(x, chunk.height);
      }
    });
    chunk.forEachCellJ((j, y) => {
      if ((j + 1) % 9 === 0) {
        y += chunk.cellSize;
        this.context.moveTo(0, y);
        this.context.lineTo(chunk.width, y);
      }
    });
    this.context.stroke();

    this.context.lineWidth = 0.5;
    this.context.beginPath();
    chunk.forEachCellI((i, x) => {
      if ((i + 1) % 9 !== 0) {
        x += chunk.cellSize;
        this.context.moveTo(x, 0);
        this.context.lineTo(x, chunk.height);
      }
    });
    chunk.forEachCellJ((j, y) => {
      if ((j + 1) % 9 !== 0) {
        y += chunk.cellSize;
        this.context.moveTo(0, y);
        this.context.lineTo(chunk.width, y);
      }
    });
    this.context.stroke();
  }

  private computeChunk() {
    const canvas = this.context.canvas;
    const offset = this.getOffset();
    const canvasSize = new Vector2(canvas.width, canvas.height);
    return new Chunk(CELL_SIZE, this.cellsCount, canvasSize, offset);
  }

  private getOffset() {
    return new Vector2(this.scrollArea.scrollLeft, this.scrollArea.scrollTop);
  }

  public destroy() {
    if (this.isDestroyed) {
      return;
    }

    this._isDestroyed = true;
    this.detach();
    this.context.canvas.remove();
    this.scrollArea.remove();

    this.emit('destroy', {}) || this.onDestroy();
  }

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onDestroy(): boolean | void {}
}
