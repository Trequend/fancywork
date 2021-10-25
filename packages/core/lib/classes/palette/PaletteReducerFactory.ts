import { PaletteReduceAlgorithm } from 'lib/types';
import { AverageDistanceReducer } from './algorithms/AverageDistanceReducer';
import { ContrastReducer } from './algorithms/ContrastReducer';
import { NearestReducer } from './algorithms/NearestReducer';

export class PaletteReducerFactory {
  public createReducer(algorithm: PaletteReduceAlgorithm) {
    switch (algorithm) {
      case 'nearest':
        return new NearestReducer();
      case 'contrast':
        return new ContrastReducer();
      case 'average-distance':
        return new AverageDistanceReducer();
      default:
        throw new Error('Undefined algorithm');
    }
  }
}
