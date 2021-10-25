import { Vertex } from './Vertex';

export abstract class PaletteReducer {
  public abstract reduce(verticies: Array<Vertex>): void;
}
