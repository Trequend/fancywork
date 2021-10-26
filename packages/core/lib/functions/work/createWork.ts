import { Schema, Work } from 'lib/types';
import { v4 as uuidv4 } from 'uuid';

export function createWork(name: string, schema: Schema): Work {
  const length = schema.grid.length;
  const embroidered: Array<boolean | null> = new Array(length);

  for (let i = 0; i < length; i++) {
    embroidered[i] = schema.grid[i] === undefined ? null : false;
  }

  return {
    id: uuidv4(),
    createdAt: new Date(),
    lastActivity: new Date(),
    name,
    schema,
    embroidered,
  };
}
