import { SizeType } from 'lib/types';

const CENTIMETERS_IN_INCH = 2.54;

export type ConvertSizeOptions = {
  stitchCount: number;
  from: SizeType;
  to: SizeType;
  floor?: boolean;
};

export function convertSize(
  width: number,
  height: number,
  options: ConvertSizeOptions
): {
  width: number;
  height: number;
} {
  const converter = [
    [
      // Centimeter to centimeter
      () => ({ width, height }),

      // Centimeter to inch
      () => ({
        width: width / CENTIMETERS_IN_INCH,
        height: height / CENTIMETERS_IN_INCH,
      }),

      // Centimeter to stitch
      () => ({
        width: (width / CENTIMETERS_IN_INCH) * options.stitchCount,
        height: (width / CENTIMETERS_IN_INCH) * options.stitchCount,
      }),
    ],
    [
      // Inch to centimeter
      () => ({
        width: width * CENTIMETERS_IN_INCH,
        height: width * CENTIMETERS_IN_INCH,
      }),

      // Inch to inch
      () => ({ width, height }),

      // Inch to stitch
      () => ({
        width: width * options.stitchCount,
        height: height * options.stitchCount,
      }),
    ],
    [
      // Stitch to centimeter
      () => ({
        width: (width / options.stitchCount) * CENTIMETERS_IN_INCH,
        height: (height / options.stitchCount) * CENTIMETERS_IN_INCH,
      }),

      // Stitch to inch
      () => ({
        width: width / options.stitchCount,
        height: height / options.stitchCount,
      }),

      // Stitch to stitch
      () => ({ width, height }),
    ],
  ];

  const fromIndex = getTypeIndex(options.from);
  const toIndex = getTypeIndex(options.to);

  const size = converter[fromIndex][toIndex]();
  if (options.floor) {
    return {
      width: Math.floor(size.width),
      height: Math.floor(size.height),
    };
  } else {
    return size;
  }
}

function getTypeIndex(sizeType: SizeType) {
  switch (sizeType) {
    case 'centimeter':
      return 0;
    case 'inch':
      return 1;
    case 'stitch':
      return 2;
    default:
      throw new Error('Not implemented');
  }
}
