import { v4 as uuidv4 } from 'uuid';
import { Schema, Work } from '../../types';

export function createWork(name: string, schema: Schema): Work {
  const length = schema.grid.length;
  const embroidered: Array<boolean | null> = new Array(length);

  for (let i = 0; i < length; i++) {
    embroidered[i] = schema.grid[i] === undefined ? null : false;
  }

  return {
    metadata: {
      id: uuidv4(),
      name,
      createdAt: new Date(),
      lastActivity: new Date(),
      stitchEmbroideredCount: 0,
      schemaMetadata: schema.metadata,
    },
    schema,
    embroidered,
  };
}
