export abstract class BezierCurve<T, I> {
  private convertedStates: Array<I>;

  constructor(
    private readonly states: Array<T>,
    private readonly options: {
      multiply: (a: I, b: number) => I;
      add: (a: I, b: I) => I;
      convertToIntermediate: (value: T) => I;
      convertFromIntermediate: (value: I) => T;
    }
  ) {
    this.convertedStates = this.states.map(options.convertToIntermediate);
  }

  public evaluate(t: number): T {
    if (t < 0) {
      t = 0;
    } else if (t > 1) {
      t = 1;
    }

    const points = [...this.convertedStates];

    const { add, multiply } = this.options;
    const length = this.convertedStates.length;
    for (let limit = length; limit > 1; limit--) {
      for (let i = 0; i < limit - 1; i++) {
        points[i] = add(multiply(points[i], 1 - t), multiply(points[i + 1], t));
      }
    }

    const result = points[0];
    return this.options.convertFromIntermediate(result);
  }
}
