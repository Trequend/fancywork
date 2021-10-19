/* eslint-disable */

import { createImagePalette } from 'src/core/functions/createImagePalette';
import { createSchemaGridWithPalette } from 'src/core/functions/createSchemaGridWithPalette';
import { WorkerInput, WorkerOutput } from './worker.types';

self.addEventListener('message', ({ data }: { data: WorkerInput }) => {
  const output = createSchemaGrid(data);
  self.postMessage(output);
});

function createSchemaGrid({
  imageData,
  withDithering,
  options,
}: WorkerInput): WorkerOutput {
  const imagePalette = createImagePalette(imageData, options);
  return createSchemaGridWithPalette(imageData, imagePalette, withDithering);
}
