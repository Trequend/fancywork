import { PaletteReducer } from '../PaletteReducer';
import { Vertex } from '../Vertex';

export class AverageDistanceReducer extends PaletteReducer {
  public reduce(verticies: Array<Vertex>) {
    let minDistanceAverage = Number.POSITIVE_INFINITY;
    let index1 = -1;
    for (let i = 0; i < verticies.length; i++) {
      let distanceAverage = 0;
      for (let j = 0; j < verticies.length; j++) {
        if (i !== j) {
          distanceAverage += verticies[i].distance(verticies[j]);
        }
      }

      distanceAverage /= verticies.length - 1;
      if (distanceAverage < minDistanceAverage) {
        minDistanceAverage = distanceAverage;
        index1 = i;
      }
    }

    let minDistance = Number.POSITIVE_INFINITY;
    let index2 = -1;
    for (let i = 0; i < verticies.length; i++) {
      if (i !== index1) {
        const distance = verticies[index1].distance(verticies[i]);
        if (distance < minDistance) {
          minDistance = distance;
          index2 = i;
        }
      }
    }

    verticies[index2].merge(verticies[index1]);
    verticies.splice(index1, 1);
  }
}
