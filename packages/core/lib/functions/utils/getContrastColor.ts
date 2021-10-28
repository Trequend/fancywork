import { RGBColor } from 'lib/classes';
import { HexColor } from 'lib/types';

function convertComponent(component: number) {
  component /= 255;
  if (component <= 0.03928) {
    return component / 12.92;
  } else {
    return ((component + 0.055) / 1.055) ** 2.4;
  }
}

export function getContrastColor(color: HexColor): HexColor;
export function getContrastColor(color: RGBColor): HexColor;
export function getContrastColor(color: HexColor | RGBColor): HexColor {
  const rgbColor = color instanceof RGBColor ? color : RGBColor.fromHex(color);
  const red = convertComponent(rgbColor.red);
  const green = convertComponent(rgbColor.green);
  const blue = convertComponent(rgbColor.blue);
  const l = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
  if ((l + 0.05) / 0.5 > 1.05 / (l + 0.05)) {
    return '#000';
  } else {
    return '#fff';
  }
}
