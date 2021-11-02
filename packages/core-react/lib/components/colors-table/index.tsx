import { HexColor, Palette, palettes } from '@fancywork/core';
import { Table, TableProps, Typography } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { FC, useMemo } from 'react';

type Props = {
  palette: Palette;
  symbolResolver?: (code: string) => string;
  stitchCountResolver?: (code: string) => string;
} & Omit<TableProps<any>, 'dataSource' | 'columns' | 'rowKey'>;

export const ColorsTable: FC<Props> = ({
  palette,
  symbolResolver,
  stitchCountResolver,
  ...rest
}) => {
  const otherPalettes = useMemo(() => {
    const copy = [...palettes];
    const index = copy.findIndex((value) => value.name === palette.name);
    copy.splice(index, 1);
    return copy;
  }, [palette]);

  const data = useMemo(() => {
    const getAnalogs = (hex: HexColor) => {
      const analogs: Record<string, string | undefined> = {};
      otherPalettes.forEach((palette) => {
        analogs[palette.name] =
          palette.colors.find((color) => {
            return color.hex === hex;
          })?.code ?? '-';
      });

      return analogs;
    };

    return palette.colors.map((color) => {
      return {
        symbol: symbolResolver ? symbolResolver(color.code) : undefined,
        hex: color.hex,
        code: color.code,
        stitchCount: stitchCountResolver
          ? stitchCountResolver(color.code)
          : undefined,
        analogs: getAnalogs(color.hex),
      };
    });
  }, [palette, symbolResolver, stitchCountResolver, otherPalettes]);

  const symbolColumn: Array<ColumnType<any>> = symbolResolver
    ? [
        {
          title: 'Symbol',
          dataIndex: 'symbol',
        },
      ]
    : [];

  const stitchCountColumn: Array<ColumnType<any>> = stitchCountResolver
    ? [
        {
          title: 'Stitch count',
          dataIndex: 'stitchCount',
          render: (value) => {
            return <Typography.Text ellipsis>{value}</Typography.Text>;
          },
        },
      ]
    : [];

  const columns: Array<ColumnType<any> | ColumnGroupType<any>> = [
    ...symbolColumn,
    {
      title: 'Color',
      dataIndex: 'hex',
      render: (value) => {
        return (
          <>
            <div
              style={{
                display: 'inline-block',
                marginRight: '5px',
                width: '10px',
                height: '10px',
                backgroundColor: value,
              }}
            />
            {value}
          </>
        );
      },
    },
    ...stitchCountColumn,
    {
      title: palette.name,
      dataIndex: 'code',
    },
    {
      title: 'Analogs',
      children: otherPalettes.map((palette) => {
        return {
          title: palette.name,
          dataIndex: ['analogs', palette.name],
        };
      }),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="code" {...rest} />;
};
