import { PaletteReducer } from '../PaletteReducer';
import { Vertex } from '../Vertex';

export class NearestReducer extends PaletteReducer {
  public reduce(verticies: Array<Vertex>) {
    let minDistance = Number.POSITIVE_INFINITY;
    let index1 = -1;
    let index2 = -1;
    for (let i = 0; i < verticies.length - 1; i++) {
      for (let j = i + 1; j < verticies.length; j++) {
        const distance = verticies[i].distance(verticies[j]);
        if (distance < minDistance) {
          minDistance = distance;
          index1 = i;
          index2 = j;
        }
      }
    }

    if (verticies[index1].compareTo(verticies[index2]) >= 0) {
      verticies[index1].merge(verticies[index2]);
      verticies.splice(index2, 1);
    } else {
      verticies[index2].merge(verticies[index1]);
      verticies.splice(index1, 1);
    }
  }
}
