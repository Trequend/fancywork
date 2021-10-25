export type SizeType = 'centimeter' | 'inch' | 'stitch';

const CENTIMETERS_IN_INCH = 2.54;

export function convertSchemaSize(
  width: number,
  height: number,
  stitchCount: number,
  sizeType: SizeType
): {
  width: number;
  height: number;
} {
  switch (sizeType) {
    case 'centimeter':
      width /= CENTIMETERS_IN_INCH;
      height /= CENTIMETERS_IN_INCH;
      return convertSchemaSize(width, height, stitchCount, 'inch');
    case 'inch':
      width *= stitchCount;
      height *= stitchCount;
      break;
    case 'stitch':
      break;
    default:
      throw new Error('Undefined size type');
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}
