import { WorkMetadata } from '@fancywork/core';
import { WorkChunkMetadata } from '../../types';

export function createChunkMetadata(
  width: number,
  height: number,
  metadata: WorkMetadata
): WorkChunkMetadata {
  const { canvasMetadata } = metadata.schemaMetadata;
  const chunksPerRow = Math.ceil(canvasMetadata.width / width);
  const lastChunkWidth = canvasMetadata.width - (chunksPerRow - 1) * width;
  return {
    workId: metadata.id,
    width,
    height,
    chunksPerRow,
    lastChunkWidth,
  };
}
