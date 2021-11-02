import { downloadSchema, Schema } from '@fancywork/core';
import { Button, ButtonProps, Popover } from 'antd';
import { FC, useState } from 'react';

export type DownloadButtonProps = {
  schemaLoader: () => Promise<Schema> | Schema;
} & Omit<ButtonProps, 'onClick'>;

export const DownloadButton: FC<DownloadButtonProps> = ({
  schemaLoader,
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
            onClick={async () => {
              const schema = await schemaLoader();
              downloadSchema(schema, true);
              setVisible(false);
            }}
          >
            Download minimized
          </Button>
          <Button
            type="link"
            onClick={async () => {
              const schema = await schemaLoader();
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
