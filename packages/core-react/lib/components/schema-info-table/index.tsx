import { convertSize, SchemaMetadata } from '@fancywork/core';
import { Table, TableProps, Typography } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { FC } from 'react';

type Props = {
  metadata: SchemaMetadata;
} & Omit<TableProps<any>, 'dataSource' | 'columns' | 'rowKey'>;

export const SchemaInfoTable: FC<Props> = ({ metadata, ...rest }) => {
  const columns: Array<ColumnType<any>> = [
    {
      title: 'Property',
      dataIndex: 'property',
      render: (value) => {
        return <Typography.Text ellipsis>{value}</Typography.Text>;
      },
    },
    {
      title: 'Value',
      dataIndex: 'value',
      render: (value) => {
        return <Typography.Text ellipsis>{value}</Typography.Text>;
      },
    },
  ];

  const size = {
    width: metadata.canvasMetadata.width,
    height: metadata.canvasMetadata.height,
  };

  const sizeInCentimeters = convertSize(size.width, size.height, {
    from: 'stitch',
    to: 'centimeter',
    stitchesPerInch: metadata.canvasMetadata.stitchesPerInch,
  });

  const sizeInInches = convertSize(size.width, size.height, {
    from: 'stitch',
    to: 'inch',
    stitchesPerInch: metadata.canvasMetadata.stitchesPerInch,
  });

  const round = (number: number) => {
    return Math.round(number * 100) / 100;
  };

  const data = [
    {
      property: 'Schema name',
      value: metadata.name,
    },
    {
      property: 'Width',
      value: `${size.width} stitch, ${round(
        sizeInCentimeters.width
      )} cm, ${round(sizeInInches.width)} inch`,
    },
    {
      property: 'Height',
      value: `${size.height} stitch, ${round(
        sizeInCentimeters.height
      )} cm, ${round(sizeInInches.height)} inch`,
    },
    {
      property: 'Stitches per inch',
      value: metadata.canvasMetadata.stitchesPerInch,
    },
    {
      property: 'Palette name',
      value: metadata.paletteMetadata.name,
    },
    {
      property: 'Number of colors',
      value: metadata.paletteMetadata.colorsCount,
    },
    {
      property: 'Number of stitches',
      value: metadata.stitchCount,
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey="property" {...rest} />
  );
};
