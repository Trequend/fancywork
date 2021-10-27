import { Button, ButtonProps, Popover } from 'antd';
import { downloadSchema } from 'lib/functions';
import { Schema } from 'lib/types';
import { FC, useState } from 'react';

export type DownloadButtonProps = {
  schema: Schema;
} & Omit<ButtonProps, 'onClick'>;

export const DownloadButton: FC<DownloadButtonProps> = ({
  schema,
  ...props
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      trigger="click"
      visible={visible}
      onVisibleChange={setVisible}
      content={
        <>
          <Button
            type="link"
            onClick={() => {
              downloadSchema(schema, true);
              setVisible(false);
            }}
          >
            Download minimized
          </Button>
          <Button
            type="link"
            onClick={() => {
              downloadSchema(schema, false);
              setVisible(false);
            }}
          >
            Download formatted
          </Button>
        </>
      }
    >
      <Button {...props} onClick={undefined}>
        Download Schema
      </Button>
    </Popover>
  );
};
