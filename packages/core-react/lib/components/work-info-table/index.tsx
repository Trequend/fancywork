import { convertSize, WorkMetadata } from '@fancywork/core';
import { Table, TableProps, Typography } from 'antd';
import { ColumnType } from 'antd/lib/table';
import { FC } from 'react';

type Props = {
  metadata: WorkMetadata;
} & Omit<TableProps<any>, 'dataSource' | 'columns' | 'rowKey'>;

export const WorkInfoTable: FC<Props> = ({ metadata, ...rest }) => {
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

  const { schemaMetadata } = metadata;

  const size = {
    width: schemaMetadata.canvasMetadata.width,
    height: schemaMetadata.canvasMetadata.height,
  };

  const sizeInCentimeters = convertSize(size.width, size.height, {
    from: 'stitch',
    to: 'centimeter',
    stitchesPerInch: schemaMetadata.canvasMetadata.stitchesPerInch,
  });

  const sizeInInches = convertSize(size.width, size.height, {
    from: 'stitch',
    to: 'inch',
    stitchesPerInch: schemaMetadata.canvasMetadata.stitchesPerInch,
  });

  const round = (number: number) => {
    return Math.round(number * 100) / 100;
  };

  const data = [
    {
      property: 'Name',
      value: metadata.name,
    },
    {
      property: 'Schema name',
      value: schemaMetadata.name,
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
      value: schemaMetadata.canvasMetadata.stitchesPerInch,
    },
    {
      property: 'Palette name',
      value: schemaMetadata.paletteMetadata.name,
    },
    {
      property: 'Number of colors',
      value: schemaMetadata.paletteMetadata.colorsCount,
    },
    {
      property: 'Number of stitches',
      value: schemaMetadata.stitchCount,
    },
    {
      property: 'Embroidered stitches',
      value: metadata.stitchEmbroideredCount,
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey="property" {...rest} />
  );
};
