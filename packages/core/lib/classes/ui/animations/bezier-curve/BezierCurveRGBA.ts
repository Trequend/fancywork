import { RGBAColor, Vector4 } from '../../../common';
import { BezierCurve } from './BezierCurve';

export class BezierCurveRGBA extends BezierCurve<RGBAColor, Vector4> {
  constructor(states: Array<RGBAColor>) {
    super(states, {
      multiply: (a, b) => {
        return a.multiply(b);
      },
      add: (a, b) => {
        return a.add(b);
      },
      convertFromIntermediate: (vector) => {
        return new RGBAColor(
          Math.floor(vector.x),
          Math.floor(vector.y),
          Math.floor(vector.z),
          Math.floor(vector.w)
        );
      },
      convertToIntermediate: (color) => {
        return new Vector4(color.red, color.green, color.blue, color.alpha);
      },
    });
  }
}
