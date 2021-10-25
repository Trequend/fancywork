import { Schema } from '.';

export type Work = {
  id: string;
  name: string;
  schema: Schema;
  embroidered: Array<boolean | null>;
};
