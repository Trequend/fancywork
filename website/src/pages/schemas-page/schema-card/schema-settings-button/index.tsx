import { SettingOutlined } from '@ant-design/icons';
import { SchemaMetadata } from '@fancywork/core';
import { Button, Popover } from 'antd';
import { FC, useState } from 'react';
import { ChangeSchemaNameModal } from './change-schema-name-modal';

type Props = {
  metadata: SchemaMetadata;
  onChangeName?: (name: string) => Promise<void> | void;
};

export const SchemaSettingsButton: FC<Props> = ({ metadata, onChangeName }) => {
  const [visible, setVisible] = useState(false);
  const [changeNameVisible, setChangeNameVisible] = useState(false);

  return (
    <>
      {changeNameVisible ? (
        <ChangeSchemaNameModal
          metadata={metadata}
          onChange={onChangeName}
          onClose={() => setChangeNameVisible(false)}
        />
      ) : null}
      <Popover
        trigger="click"
        visible={visible}
        onVisibleChange={setVisible}
        content={
          <>
            <Button
              type="link"
              onClick={() => {
                setChangeNameVisible(true);
                setVisible(false);
              }}
            >
              Change name
            </Button>
          </>
        }
      >
        <SettingOutlined />
      </Popover>
    </>
  );
};
