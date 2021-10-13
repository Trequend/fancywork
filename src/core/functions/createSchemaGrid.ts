import {
  WorkerInput,
  WorkerOutput,
} from '../workers/create-schema-grid/worker.types';
import { getWorkerResult } from './getWorkerResult';

export async function createSchemaGrid(
  input: WorkerInput
): Promise<WorkerOutput> {
  const worker = new Worker(
    '../workers/create-schema-grid/createSchemaGrid.worker.ts',
    { type: 'module' }
  );

  try {
    const result = await getWorkerResult<WorkerInput, WorkerOutput>(
      worker,
      input
    );
    return result;
  } finally {
    worker.terminate();
  }
}
