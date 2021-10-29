import { RGBColor, Vector3 } from '../../../common';
import { BezierCurve } from './BezierCurve';

export class BezierCurveRGB extends BezierCurve<RGBColor, Vector3> {
  constructor(states: Array<RGBColor>) {
    super(states, {
      multiply: (a, b) => {
        return a.multiply(b);
      },
      add: (a, b) => {
        return a.add(b);
      },
      convertFromIntermediate: (vector) => {
        return new RGBColor(
          Math.floor(vector.x),
          Math.floor(vector.y),
          Math.floor(vector.z)
        );
      },
      convertToIntermediate: (color) => {
        return new Vector3(color.red, color.green, color.blue);
      },
    });
  }
}
