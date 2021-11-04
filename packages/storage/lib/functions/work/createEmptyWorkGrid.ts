import { WorkGrid } from '@fancywork/core';

export function createEmptyWorkGrid(width: number, height: number) {
  const size = width * height;
  const embroidered: WorkGrid = new Array(size);
  for (let i = 0; i < size; i++) {
    embroidered[i] = null;
  }

  return embroidered;
}
