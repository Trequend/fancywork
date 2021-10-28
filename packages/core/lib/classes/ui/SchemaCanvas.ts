import { CELL_SIZE, HALF_CELL_SIZE } from 'lib/constants';
import { cellsEquals } from 'lib/functions';
import { BorderCell, SchemaCell } from 'lib/types';
import { EventEmitter, Vector2, Vector2Int } from '../common';
import { Chunk } from './Chunk';
import { SchemaViewProvider } from './SchemaViewProvider';

export type SchemaCanvasEventMap = {
  schemaCellClick: { cell: SchemaCell; mouseEvent: MouseEvent };
  borderCellClick: { cell: BorderCell; mouseEvent: MouseEvent };
  schemaCellMouseMove: { cell: SchemaCell; mouseEvent: MouseEvent };
  borderCellMouseMove: { cell: BorderCell; mouseEvent: MouseEvent };
  destroy: {};
  redraw: Chunk;
};

export class SchemaCanvas<
  Provider extends SchemaViewProvider = SchemaViewProvider,
  EventMap extends SchemaCanvasEventMap = SchemaCanvasEventMap
> extends EventEmitter<EventMap, SchemaCanvas<Provider, EventMap>> {
  protected readonly context: CanvasRenderingContext2D;

  protected readonly cellsCount;

  private readonly scrollArea: HTMLDivElement;

  private drawRequired: boolean = true;

  private _isDestroyed: boolean = false;

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

    const mock = document.createElement('div');
    mock.style.width = `${CELL_SIZE * (this.cellsCount.x + 1)}px`;
    mock.style.height = `${CELL_SIZE * (this.cellsCount.y + 1)}px`;

    scrollArea.appendChild(mock);
    return scrollArea;
  }

  private attach() {
    this.scrollArea.addEventListener('mousedown', this.mouseDown);
    this.scrollArea.addEventListener('click', this.onClick);
    this.scrollArea.addEventListener('mousemove', this.mouseMove);
    this.scrollArea.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
    window.requestAnimationFrame(() => {
      this.drawLoop();
    });
  }

  private detach() {
    window.removeEventListener('resize', this.onResize);
    this.scrollArea.removeEventListener('mousedown', this.mouseDown);
    this.scrollArea.removeEventListener('click', this.onClick);
    this.scrollArea.removeEventListener('mousemove', this.mouseMove);
    this.scrollArea.removeEventListener('scroll', this.onScroll);
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

  private mouseDownPosition?: Vector2;

  private mouseDown = (mouseEvent: MouseEvent) => {
    this.mouseDownPosition = this.clientPositionToCanvas(
      mouseEvent.clientX,
      mouseEvent.clientY
    );
  };

  private onClick = (mouseEvent: MouseEvent) => {
    if (this.mouseDownPosition === undefined) {
      return;
    }

    const chunk = this.computeChunk();

    const clickPosition = this.clientPositionToCanvas(
      mouseEvent.clientX,
      mouseEvent.clientY
    );

    const mouseDownCell = chunk.mousePositionToCell(
      this.mouseDownPosition.x,
      this.mouseDownPosition.y
    );
    const clickCell = chunk.mousePositionToCell(
      clickPosition.x,
      clickPosition.y
    );

    if (mouseDownCell === undefined || clickCell === undefined) {
      return;
    }

    if (cellsEquals(mouseDownCell, clickCell)) {
      switch (clickCell.type) {
        case 'border':
          this.emit('borderCellClick', { cell: clickCell, mouseEvent }) ||
            this.onBorderCellClick(clickCell, mouseEvent);
          break;
        case 'schema':
          this.emit('schemaCellClick', { cell: clickCell, mouseEvent }) ||
            this.onSchemaCellClick(clickCell, mouseEvent);
          break;
        default:
          throw new Error('Not implemented');
      }
    }
  };

  protected onBorderCellClick(_cell: BorderCell, _mouseEvent: MouseEvent) {}

  protected onSchemaCellClick(_cell: SchemaCell, _mouseEvent: MouseEvent) {}

  private mouseMove = (mouseEvent: MouseEvent) => {
    const position = this.clientPositionToCanvas(
      mouseEvent.clientX,
      mouseEvent.clientY
    );

    const chunk = this.computeChunk();

    const cell = chunk.mousePositionToCell(position.x, position.y);

    if (cell === undefined) {
      return;
    }

    switch (cell.type) {
      case 'border':
        this.emit('borderCellMouseMove', { cell, mouseEvent }) ||
          this.onBorderCellMouseMove(cell, mouseEvent);
        break;
      case 'schema':
        this.emit('schemaCellMouseMove', { cell, mouseEvent }) ||
          this.onSchemaCellMouseMove(cell, mouseEvent);
        break;
      default:
        throw new Error('Not implemented');
    }
  };

  protected onBorderCellMouseMove(_cell: BorderCell, _mouseEvent: MouseEvent) {}

  protected onSchemaCellMouseMove(_cell: SchemaCell, _mouseEvent: MouseEvent) {}

  private clientPositionToCanvas(x: number, y: number) {
    const rect = this.scrollArea.getBoundingClientRect();
    return new Vector2(x - rect.x, y - rect.y);
  }

  protected requireRedraw() {
    this.drawRequired = true;
  }

  private drawLoop() {
    if (this.isDestroyed) {
      return;
    }

    if (this.drawRequired) {
      this.draw();
      this.drawRequired = false;
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

    this.drawCells(chunk);
    this.drawScale(chunk);
    this.drawGrid(chunk);

    this.emit('redraw', chunk) || this.onRedraw(chunk);
    const delta = Math.round(performance.now() - time);
    this.context.fillText(delta.toString(), HALF_CELL_SIZE, HALF_CELL_SIZE);
  }

  protected onRedraw(_chunk: Chunk) {}

  protected drawCells(chunk: Chunk) {
    this.context.textAlign = 'center';
    this.context.font = '16px sans-serif';
    this.context.textBaseline = 'middle';

    chunk.forEachCell(this.drawCell.bind(this));
  }

  protected drawCell(i: number, j: number, x: number, y: number) {
    const cell = this.viewProvider.getCell(i, j);
    if (cell === null) {
      return;
    }

    this.context.fillStyle = cell.color.hex;
    this.context.fillRect(x, y, CELL_SIZE, CELL_SIZE);

    this.context.fillStyle = cell.symbolColor;
    this.context.fillText(cell.symbol, x + HALF_CELL_SIZE, y + HALF_CELL_SIZE);
  }

  private drawScale(chunk: Chunk) {
    const canvas = this.context.canvas;

    this.context.clearRect(0, 0, canvas.width, CELL_SIZE);
    this.context.clearRect(0, 0, CELL_SIZE, canvas.height);

    this.context.fillStyle = 'black';
    this.context.textAlign = 'center';
    this.context.font = 'bold 16px sans-serif';
    this.context.textBaseline = 'middle';

    const halfCellSize = CELL_SIZE / 2;

    chunk.forEachCellX((i, x) => {
      const number = (i + 1).toString();
      this.context.fillText(number, x + halfCellSize, halfCellSize);
    });

    chunk.forEachCellY((i, y) => {
      const number = (i + 1).toString();
      this.context.fillText(number, halfCellSize, y + halfCellSize);
    });
  }

  private drawGrid(chunk: Chunk) {
    this.context.clearRect(0, 0, CELL_SIZE, CELL_SIZE);

    this.context.fillStyle = 'black';

    this.context.lineWidth = 2.5;
    this.context.beginPath();
    this.context.moveTo(CELL_SIZE, 0);
    this.context.lineTo(CELL_SIZE, chunk.height);
    this.context.moveTo(0, CELL_SIZE);
    this.context.lineTo(chunk.width, CELL_SIZE);
    this.context.stroke();

    this.context.lineWidth = 1.5;
    this.context.beginPath();
    chunk.forEachCellX((i, x) => {
      if ((i + 1) % 9 === 0) {
        x += CELL_SIZE;
        this.context.moveTo(x, 0);
        this.context.lineTo(x, chunk.height);
      }
    });
    chunk.forEachCellY((i, y) => {
      if ((i + 1) % 9 === 0) {
        y += CELL_SIZE;
        this.context.moveTo(0, y);
        this.context.lineTo(chunk.width, y);
      }
    });
    this.context.stroke();

    this.context.lineWidth = 0.5;
    this.context.beginPath();
    chunk.forEachCellX((i, x) => {
      if ((i + 1) % 9 !== 0) {
        x += CELL_SIZE;
        this.context.moveTo(x, 0);
        this.context.lineTo(x, chunk.height);
      }
    });
    chunk.forEachCellY((i, y) => {
      if ((i + 1) % 9 !== 0) {
        y += CELL_SIZE;
        this.context.moveTo(0, y);
        this.context.lineTo(chunk.width, y);
      }
    });
    this.context.stroke();
  }

  private computeChunk() {
    const canvas = this.context.canvas;
    const offset = this.getOffset();
    const size = new Vector2(canvas.width, canvas.height);
    return new Chunk(CELL_SIZE, this.cellsCount, size, offset);
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

  protected onDestroy() {}
}
