import { Chunk } from './Chunk';
import { Vector2 } from './Vector2';
import { Vector2Int } from './Vector2Int';
import { SchemaViewProvider } from './SchemaViewProvider';

const CELL_SIZE = 30;

export class SchemaCanvas {
  private readonly context: CanvasRenderingContext2D;
  private drawRequired: boolean = true;
  private isDestroyed: boolean = false;
  private readonly cellsCount;

  constructor(
    private readonly schemaViewProvider: SchemaViewProvider,
    canvas: HTMLCanvasElement,
    private readonly scrollArea: HTMLDivElement
  ) {
    const context = canvas.getContext('2d');
    if (context) {
      this.context = context;
    } else {
      throw new Error('2d context not supported');
    }

    this.cellsCount = new Vector2Int(
      this.schemaViewProvider.schema.width,
      this.schemaViewProvider.schema.height
    );

    this.attach();
  }

  private attach() {
    const div = document.createElement('div');
    div.style.width = `${CELL_SIZE * (this.cellsCount.x + 1)}px`;
    div.style.height = `${CELL_SIZE * (this.cellsCount.y + 1)}px`;
    this.scrollArea.innerHTML = '';
    this.scrollArea.appendChild(div);

    this.resize();

    this.scrollArea.addEventListener('scroll', this.onScroll);
    window.addEventListener('resize', this.onResize);
    window.requestAnimationFrame(() => {
      this.drawLoop();
    });
  }

  private detach() {
    window.removeEventListener('resize', this.onResize);
    this.scrollArea.removeEventListener('scroll', this.onScroll);
  }

  private onScroll = () => {
    this.drawRequired = true;
  };

  private onResize = () => {
    this.resize();
  };

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

  private draw() {
    const canvas = this.context.canvas;
    this.context.clearRect(0, 0, canvas.width, canvas.height);

    const chunk = this.computeChunk();

    this.drawCells(chunk);
    this.drawScale(chunk);
    this.drawGrid(chunk);
  }

  private drawCells(chunk: Chunk) {
    this.context.textAlign = 'center';
    this.context.font = '16px sans-serif';
    this.context.textBaseline = 'middle';

    const halfCellSize = CELL_SIZE / 2;

    chunk.forEachCell((i, j, x, y) => {
      const cell = this.schemaViewProvider.getCell(i, j);
      if (cell === undefined) {
        return;
      }

      this.context.fillStyle = cell.color.hexColor;
      this.context.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      this.context.fillStyle = cell.symbolColor;
      this.context.fillText(cell.symbol, x + halfCellSize, y + halfCellSize);
    });
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

    this.isDestroyed = true;
    this.detach();
  }
}
