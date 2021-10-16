import { ColumnType } from 'antd/lib/table';
import { Table, TableProps } from 'antd';
import { FC } from 'react';
import { Schema } from 'src/core/types';

type Props = {
  schema: Schema;
} & Omit<TableProps<any>, 'dataSource' | 'columns' | 'rowKey'>;

export const SchemaInfoTable: FC<Props> = ({ schema, ...rest }) => {
  const columns: Array<ColumnType<any>> = [
    {
      title: 'Property',
      dataIndex: 'property',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
  ];

  const data = [
    {
      property: 'Name',
      value: schema.metadata.name,
    },
    {
      property: 'Width (stitch)',
      value: schema.width,
    },
    {
      property: 'Height (stitch)',
      value: schema.height,
    },
    {
      property: 'Palette name',
      value: schema.palette.name,
    },
    {
      property: 'Colors count',
      value: schema.palette.colors.length,
    },
    {
      property: 'Stitch count',
      value: schema.grid.reduce((accumulator, value) => {
        if (value === undefined) {
          return accumulator;
        } else {
          return (accumulator ?? 0) + 1;
        }
      }, 0),
    },
  ];

  return (
    <Table columns={columns} dataSource={data} rowKey="property" {...rest} />
  );
};
