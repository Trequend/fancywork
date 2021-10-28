import { ColumnType } from 'antd/lib/table';
import { Table, TableProps, Typography } from 'antd';
import { FC } from 'react';
import { SchemaMetadata } from 'lib/types';

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

  const data = [
    {
      property: 'Schema name',
      value: metadata.name,
    },
    {
      property: 'Width (stitch)',
      value: metadata.canvasMetadata.width,
    },
    {
      property: 'Height (stitch)',
      value: metadata.canvasMetadata.height,
    },
    {
      property: 'Palette name',
      value: metadata.paletteMetadata.name,
    },
    {
      property: 'Colors count',
      value: metadata.paletteMetadata.colorsCount,
    },
    {
      property: 'Stitch count',
      value: metadata.stitchCount,
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey="property" {...rest} />
  );
};
