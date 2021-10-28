import { Table, TableProps } from 'antd';
import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { palettes } from 'lib/palettes';
import { HexColor, Palette } from 'lib/types';
import { FC, useMemo } from 'react';

type Props = {
  palette: Palette;
} & Omit<TableProps<any>, 'dataSource' | 'columns' | 'rowKey'>;

export const ColorsTable: FC<Props> = ({ palette, ...rest }) => {
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
        hex: color.hex,
        code: color.code,
        analogs: getAnalogs(color.hex),
      };
    });
  }, [palette, otherPalettes]);

  const columns: Array<ColumnType<any> | ColumnGroupType<any>> = [
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
