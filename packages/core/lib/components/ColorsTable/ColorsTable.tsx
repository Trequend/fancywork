import { ColumnGroupType, ColumnType } from 'antd/lib/table';
import { Table, TableProps } from 'antd';
import { FC, useMemo } from 'react';
import { HexColor, Palette } from 'lib/types';
import { palettes } from 'lib/palettes';

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
    const getAnalogs = (hexColor: HexColor) => {
      const analogs: Record<string, string | undefined> = {};
      otherPalettes.forEach((palette) => {
        analogs[palette.name] =
          palette.colors.find((color) => {
            return color.hexColor === hexColor;
          })?.code ?? '-';
      });

      return analogs;
    };

    return palette.colors.map((color) => {
      return {
        hexColor: color.hexColor,
        code: color.code,
        analogs: getAnalogs(color.hexColor),
      };
    });
  }, [palette, otherPalettes]);

  const columns: Array<ColumnType<any> | ColumnGroupType<any>> = [
    {
      title: 'Color',
      dataIndex: 'hexColor',
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
