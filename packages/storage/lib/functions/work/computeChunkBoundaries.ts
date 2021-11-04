import { WorkMetadata } from '@fancywork/core';
import { WorkChunkMetadata } from '../../types';

export function computeChunkBoundaries(
  workMetadata: WorkMetadata,
  chunkMetadata: WorkChunkMetadata,
  chunkNumber: number
) {
  const { chunksPerRow, lastChunkWidth } = chunkMetadata;
  const chunkI = chunkNumber % chunksPerRow;
  const chunkJ = (chunkNumber - chunkI) / chunksPerRow;

  const { width: schemaWidth, height: schemaHeight } =
    workMetadata.schemaMetadata.canvasMetadata;
  const deltaX = schemaWidth - chunkI * chunkMetadata.width;
  const deltaY = schemaHeight - chunkJ * chunkMetadata.height;
  const chunkWidth = Math.min(deltaX, chunkMetadata.width);
  const chunkHeight = Math.min(deltaY, chunkMetadata.height);

  const start =
    (chunkMetadata.width * chunkMetadata.height * (chunksPerRow - 1) +
      lastChunkWidth * chunkMetadata.height) *
      chunkJ +
    chunkMetadata.width * chunkI;
  const end = start + schemaWidth * chunkHeight;

  return {
    start,
    end,
    offset: schemaWidth,
    chunkWidth,
    chunkHeight,
  };
}
