import { WorkGrid, WorkMetadata } from '@fancywork/core';
import { WorkChunk, WorkChunkMetadata } from '../../types';
import { computeChunkBoundaries } from './computeChunkBoundaries';

export function insertChunk(
  workMetadata: WorkMetadata,
  embroidered: WorkGrid,
  chunkMetadata: WorkChunkMetadata,
  chunk: WorkChunk
) {
  const { start, end, offset, chunkWidth } = computeChunkBoundaries(
    workMetadata,
    chunkMetadata,
    chunk.number
  );
  for (let j = start, index = 0; j < end; j += offset) {
    for (let i = 0; i < chunkWidth; i++, index++) {
      embroidered[j + i] = chunk.embroidered[index];
    }
  }
}
