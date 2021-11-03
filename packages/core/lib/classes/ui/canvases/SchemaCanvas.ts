import { CELL_SIZE } from '../../../constants';
import { cellsEquals } from '../../../functions';
import { BorderCell, SchemaCell } from '../../../types';
import { EventEmitter, RGBAColor, Vector2, Vector2Int } from '../../common';
import { Chunk } from '../Chunk';
import {
  Renderer,
  SchemaInfo,
  WebGL1Renderer,
  WebGL2Renderer,
} from '../renderer';
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
  protected readonly renderer: Renderer;

  protected readonly cellsCount;

  private readonly canvas: HTMLCanvasElement;

  private readonly scrollArea: HTMLDivElement;

  private readonly timeDisplay: HTMLDivElement;

  private drawRequired = true;

  private _isDestroyed = false;

  public get isDestroyed() {
    return this._isDestroyed;
  }

  constructor(public readonly viewProvider: Provider, root: HTMLDivElement) {
    super();

    const { width, height } = this.viewProvider.schema.metadata.canvasMetadata;

    this.cellsCount = new Vector2Int(width, height);

    this.canvas = this.createCanvas();
    this.renderer = this.createRenderer();
    this.scrollArea = this.createScrollArea();
    this.timeDisplay = this.createTimeDisplay();

    root.innerHTML = '';
    root.appendChild(this.canvas);
    root.appendChild(this.scrollArea);
    root.appendChild(this.timeDisplay);

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

  private createRenderer(): Renderer {
    const schemaInfo: SchemaInfo = {
      cellSize: CELL_SIZE,
      width: this.cellsCount.x,
      height: this.cellsCount.y,
      symbols: this.viewProvider.getSymbols(),
    };

    const webgl2 = this.canvas.getContext('webgl2');
    if (webgl2) {
      return new WebGL2Renderer(webgl2, schemaInfo);
    }

    const webgl = this.canvas.getContext('webgl');
    if (webgl) {
      return new WebGL1Renderer(webgl, schemaInfo);
    }

    throw new Error('webgl not supported');
  }

  private createTimeDisplay() {
    const timeDisplay = document.createElement('div');
    timeDisplay.style.position = 'absolute';
    timeDisplay.style.top = '0';
    timeDisplay.style.left = '0';
    timeDisplay.style.width = '30px';
    timeDisplay.style.height = '30px';
    timeDisplay.style.display = 'none';
    timeDisplay.style.justifyContent = 'center';
    timeDisplay.style.alignItems = 'center';
    return timeDisplay;
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
    window.addEventListener('keydown', this.onKeyDown);
    window.requestAnimationFrame(() => {
      this.drawLoop();
    });

    // Local
    this.scrollArea.addEventListener('scroll', this.onScroll);

    this.scrollArea.addEventListener('pointerdown', this.onPointerDown);
    this.scrollArea.addEventListener('pointermove', this.onPointerMove);
    this.scrollArea.addEventListener('pointerup', this.onPointerUp);
    this.scrollArea.addEventListener('pointercancel', this.onPointerCancel);

    this.scrollArea.addEventListener('touchstart', this.onTouchStart);
    this.scrollArea.addEventListener('touchmove', this.onTouchMove);
    this.scrollArea.addEventListener('touchend', this.onTouchEnd);
  }

  private detach() {
    // Global only
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private onResize = () => {
    this.resize();
  };

  private resize() {
    const canvas = this.canvas;
    canvas.style.width = `${this.scrollArea.clientWidth}px`;
    canvas.style.height = `${this.scrollArea.clientHeight}px`;
    const rect = canvas.getBoundingClientRect();
    const width = Math.round(rect.width * window.devicePixelRatio);
    const height = Math.round(rect.height * window.devicePixelRatio);
    canvas.width = width;
    canvas.height = height;
    this.drawRequired = true;
  }

  private onKeyDown = (keyboardEvent: KeyboardEvent) => {
    if (keyboardEvent.code === 'Period' && !keyboardEvent.repeat) {
      this.toggleTimeDisplay();
    }
  };

  private onScroll = () => {
    this.drawRequired = true;
  };

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

  private toggleTimeDisplay() {
    if (this.timeDisplay.style.display === 'none') {
      this.timeDisplay.style.display = 'flex';
    } else {
      this.timeDisplay.style.display = 'none';
    }
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

    const chunk = this.computeChunk();

    this.renderer.start();
    this.preRender(chunk);
    this.drawCells(chunk);
    this.drawScale(chunk);
    this.drawGrid(chunk);
    this.postRender(chunk);
    this.renderer.end();

    this.emit('redraw', chunk) || this.onRedraw(chunk);
    const delta = Math.round(performance.now() - time);
    this.timeDisplay.innerText = delta.toString();
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

    const rectColor = RGBAColor.fromHex(cell.color.hex);
    this.renderer.drawRect(x, y, chunk.cellSize, chunk.cellSize, rectColor);

    const symbolColor = RGBAColor.fromHex(cell.symbolColor);
    this.renderer.drawSchemaSymbol(cell.symbol, x, y, symbolColor);
  }

  private drawScale(chunk: Chunk) {
    const whiteColor = new RGBAColor(255, 255, 255, 255);
    this.renderer.drawRect(0, 0, chunk.width, chunk.cellSize, whiteColor);
    this.renderer.drawRect(0, 0, chunk.cellSize, chunk.height, whiteColor);

    chunk.forEachCellI((i, x) => {
      this.renderer.drawBorderNumber(i, x, 0);
    });

    chunk.forEachCellJ((j, y) => {
      this.renderer.drawBorderNumber(j, 0, y);
    });
  }

  private drawGrid(chunk: Chunk) {
    const whiteColor = new RGBAColor(255, 255, 255, 255);
    this.renderer.drawRect(0, 0, chunk.cellSize, chunk.cellSize, whiteColor);

    let color = new RGBAColor(0, 0, 0, 255);
    let lineWidth = 2.5;
    this.renderer.drawLine(chunk.cellSize, 0, chunk.cellSize, chunk.height, {
      lineWidth,
      color,
    });
    this.renderer.drawLine(0, chunk.cellSize, chunk.width, chunk.cellSize, {
      lineWidth,
      color,
    });

    color = new RGBAColor(50, 50, 50, 255);
    lineWidth = 1;
    chunk.forEachCellI((i, x) => {
      if ((i + 1) % 9 !== 0) {
        x += chunk.cellSize;
        this.renderer.drawLine(x, 0, x, chunk.height, {
          lineWidth,
          color,
        });
      }
    });
    chunk.forEachCellJ((j, y) => {
      if ((j + 1) % 9 !== 0) {
        y += chunk.cellSize;
        this.renderer.drawLine(0, y, chunk.width, y, {
          lineWidth,
          color,
        });
      }
    });

    lineWidth = 2;
    chunk.forEachCellI((i, x) => {
      if ((i + 1) % 9 === 0) {
        x += chunk.cellSize;
        this.renderer.drawLine(x, 0, x, chunk.height, {
          lineWidth,
          color,
        });
      }
    });
    chunk.forEachCellJ((j, y) => {
      if ((j + 1) % 9 === 0) {
        y += chunk.cellSize;
        this.renderer.drawLine(0, y, chunk.width, y, {
          lineWidth,
          color,
        });
      }
    });
  }

  private computeChunk() {
    const canvas = this.canvas;
    const offset = this.getOffset();
    const canvasSize = new Vector2(canvas.width, canvas.height);
    return new Chunk(CELL_SIZE, this.cellsCount, canvasSize, offset);
  }

  private getOffset() {
    const clamp = (x: number, min: number, max: number) => {
      return x < min ? min : x > max ? max : x;
    };

    const x = clamp(
      this.scrollArea.scrollLeft,
      0,
      this.scrollArea.scrollWidth - this.scrollArea.clientWidth
    );
    const y = clamp(
      this.scrollArea.scrollTop,
      0,
      this.scrollArea.scrollHeight - this.scrollArea.clientHeight
    );
    return new Vector2(x, y);
  }

  public destroy() {
    if (this.isDestroyed) {
      return;
    }

    this._isDestroyed = true;
    this.detach();
    this.canvas.remove();
    this.scrollArea.remove();
    this.renderer.destroy();

    this.emit('destroy', {}) || this.onDestroy();
  }

  /**
   * @returns `true` if you need to stop the propagation
   */
  protected onDestroy(): boolean | void {}
}
