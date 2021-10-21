export type BorderCell = {
  type: 'border';
  axis: 'x' | 'y' | 'origin';
  number: number;
};

export type SchemaCell = {
  type: 'schema';
  i: number;
  j: number;
};

export type Cell = BorderCell | SchemaCell;
