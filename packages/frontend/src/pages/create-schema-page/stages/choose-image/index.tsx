import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/lib/upload/Dragger';
import { FC } from 'react';
import styles from './index.module.scss';

type Props = {
  onChoose: (image: File) => void;
};

export const ChooseImage: FC<Props> = ({ onChoose }) => {
  return (
    <Dragger
      accept="image/*"
      onChange={(info) => {
        if (info.file && info.file.originFileObj) {
          onChoose(info.file.originFileObj);
        }
      }}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className={`${styles.message} ant-upload-text`}>
        Click or drag file to this area to choose image
      </p>
    </Dragger>
  );
};
