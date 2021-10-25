import { Vertex } from '../Vertex';
import { PaletteReducer } from '../PaletteReducer';

export class ContrastReducer extends PaletteReducer {
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

    let count = 0;
    let distance1 = 0;
    let distance2 = 0;
    for (let i = 0; i < verticies.length; i++) {
      if (i !== index1 && i !== index2) {
        count++;
        distance1 = verticies[i].distance(verticies[index1]);
        distance2 = verticies[i].distance(verticies[index2]);
      }
    }

    if (count !== 0) {
      distance1 /= count;
      distance2 /= count;
      if (distance1 < distance2) {
        verticies[index2].merge(verticies[index1]);
        verticies.splice(index2, 1);
      } else {
        verticies[index1].merge(verticies[index2]);
        verticies.splice(index1, 1);
      }
    } else {
      verticies[index1].merge(verticies[index2]);
      verticies.splice(index2, 1);
    }
  }
}
