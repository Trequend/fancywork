import Dragger from 'antd/lib/upload/Dragger';
import { FC } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { BasicLayout } from 'src/components/layouts';

type Props = {
  onChoose: (image: File) => void;
};

export const ChooseImage: FC<Props> = ({ onChoose }) => {
  return (
    <BasicLayout title="Choose image">
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
        <p className="ant-upload-text">
          Click or drag file to this area to choose image
        </p>
      </Dragger>
    </BasicLayout>
  );
};
