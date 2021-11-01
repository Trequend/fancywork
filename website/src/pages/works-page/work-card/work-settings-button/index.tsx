import { SettingOutlined } from '@ant-design/icons';
import { WorkMetadata } from '@fancywork/core';
import { Button, Popover } from 'antd';
import { FC, useState } from 'react';
import { ChangeWorkNameModal } from './change-work-name-modal';

type Props = {
  metadata: WorkMetadata;
  onChangeName?: (name: string) => Promise<void> | void;
};

export const WorkSettingsButton: FC<Props> = ({ metadata, onChangeName }) => {
  const [visible, setVisible] = useState(false);
  const [changeNameVisible, setChangeNameVisible] = useState(false);

  return (
    <>
      {changeNameVisible ? (
        <ChangeWorkNameModal
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
