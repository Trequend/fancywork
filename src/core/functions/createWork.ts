import { Schema, Work } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function createWork(schema: Schema): Work {
  return {
    id: uuidv4(),
    schema,
  };
}
