import { Cell } from '@fancywork/core';
import { WorkChunkMetadata } from '../../types';

export function cellToChunkNumber(
  { i, j }: Cell,
  { width, height, chunksPerRow }: WorkChunkMetadata
): number {
  const chunkI = Math.floor(i / width);
  const chunkJ = Math.floor(j / height);
  return chunkJ * chunksPerRow + chunkI;
}
