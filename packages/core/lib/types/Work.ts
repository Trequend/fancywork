import { Schema } from '.';

export type Work = {
  id: string;
  createdAt: Date;
  lastActivity: Date;
  name: string;
  schema: Schema;
  embroidered: Array<boolean | null>;
};
