import { Palette } from 'lib/types';
import { RGBColor } from '../common';
import { PaletteReducer } from './PaletteReducer';
import { Vertex } from './Vertex';

export class KMeansPalette {
  public readonly name: string;

  private verticies: Array<Vertex>;

  constructor(palette: Palette) {
    this.name = palette.name;
    this.verticies = palette.colors.map((color) => new Vertex(color));
  }

  public increaseColorWeight(color: RGBColor) {
    const vertext = this.getNearestVertex(color);
    if (vertext) {
      vertext.attachColor(color);
    }
  }

  public getSimilarColor(color: RGBColor) {
    const vertex = this.getNearestVertex(color);
    if (vertex) {
      return vertex.paletteColor;
    } else {
      throw new Error('No similar color in palette');
    }
  }

  public reduce(): void;
  public reduce(requiredSize: number, reducer: PaletteReducer): void;
  public reduce(requiredSize?: number, reducer?: PaletteReducer): void {
    this.deleteUnusedVerticies();

    if (requiredSize && reducer) {
      while (this.verticies.length > requiredSize) {
        reducer.reduce(this.verticies);
      }
    }
  }

  private deleteUnusedVerticies() {
    this.verticies = this.verticies.sort((vertex, otherVertex) => {
      return otherVertex.compareTo(vertex);
    });

    for (let i = 0; i < this.verticies.length; i++) {
      if (this.verticies[i].attachedColorsCount === 0) {
        this.verticies.splice(i);
        return;
      }
    }
  }

  private getNearestVertex(color: RGBColor) {
    let minDistance = Number.POSITIVE_INFINITY;
    let nearest: Vertex | undefined = undefined;
    for (let i = 0; i < this.verticies.length; i++) {
      const distance = this.verticies[i].distance(color);
      if (distance < minDistance) {
        minDistance = distance;
        nearest = this.verticies[i];
      }
    }

    return nearest;
  }
}
