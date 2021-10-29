type OriginCell = {
  type: 'border';
  axis: 'origin';
};

export type BorderCell =
  | {
      type: 'border';
      axis: 'x' | 'y';
      number: number;
    }
  | OriginCell;

export type SchemaCell = {
  type: 'schema';
  /**
   * Cell number along the `x` axis. Starts from `0`
   */
  i: number;
  /**
   * Cell number along the `y` axis. Starts from `0`
   */
  j: number;
};

export type Cell = {
  /**
   * Cell number along the `x` axis
   */
  i: number;
  /**
   * Cell number along the `y` axis
   */
  j: number;
};
