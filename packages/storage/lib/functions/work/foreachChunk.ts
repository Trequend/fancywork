import { Work } from '@fancywork/core';
import { WorkChunk, WorkChunkMetadata } from '../../types';
import { computeChunksCount } from './computeChunksCount';
import { extractChunk } from './extractChunk';

export function foreachChunk(
  work: Work,
  chunkMetadata: WorkChunkMetadata,
  callback: (chunk: WorkChunk) => void
) {
  const chunksCount = computeChunksCount(work, chunkMetadata);
  for (let i = 0; i < chunksCount; i++) {
    const chunk = extractChunk(work, chunkMetadata, i);
    callback(chunk);
  }
}
