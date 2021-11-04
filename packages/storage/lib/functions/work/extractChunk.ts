import { Work } from '@fancywork/core';
import { WorkChunk, WorkChunkMetadata } from '../../types';
import { createEmptyWorkGrid } from './createEmptyWorkGrid';
import { computeChunkBoundaries } from './computeChunkBoundaries';

export function extractChunk(
  work: Work,
  chunkMetadata: WorkChunkMetadata,
  chunkNumber: number
): WorkChunk {
  const { start, end, offset, chunkWidth, chunkHeight } =
    computeChunkBoundaries(work.metadata, chunkMetadata, chunkNumber);
  const embroidered = createEmptyWorkGrid(chunkWidth, chunkHeight);
  for (let j = start, index = 0; j < end; j += offset) {
    for (let i = 0; i < chunkWidth; i++, index++) {
      embroidered[index] = work.embroidered[j + i];
    }
  }

  return {
    workId: work.metadata.id,
    number: chunkNumber,
    embroidered,
  };
}
