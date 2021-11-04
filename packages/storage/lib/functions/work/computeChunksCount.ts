import { Work } from '@fancywork/core';
import { WorkChunkMetadata } from '../../types';

export function computeChunksCount(
  work: Work,
  chunkMetadata: WorkChunkMetadata
) {
  const { height } = work.metadata.schemaMetadata.canvasMetadata;
  const rowsCount = Math.ceil(height / chunkMetadata.height);
  return chunkMetadata.chunksPerRow * rowsCount;
}
