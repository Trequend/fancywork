import { WorkMetadata } from '@fancywork/core';
import { Button, Form, Input } from 'antd';
import { FC } from 'react';
import { ModalForm } from '../../../../../components';
import styles from './index.module.scss';

type Props = {
  metadata: WorkMetadata;
  onChange?: (name: string) => Promise<void> | void;
  onClose?: () => void;
};

export const ChangeWorkNameModal: FC<Props> = ({
  metadata,
  onChange,
  onClose,
}) => {
  const onFinish = async (values: any) => {
    if (metadata && onChange) {
      try {
        await onChange(values.name);
        onClose && onClose();
      } catch (error) {
        throw error;
      }
    }
  };

  return (
    <ModalForm
      onCancel={onClose}
      onFinish={onFinish}
      layout="horizontal"
      requiredMark={false}
    >
      {(loading) => (
        <>
          <Form.Item
            name="name"
            label="Name"
            initialValue={metadata.name}
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input />
          </Form.Item>
          <Button
            loading={loading}
            className={styles.button}
            htmlType="submit"
            type="primary"
          >
            Change
          </Button>
        </>
      )}
    </ModalForm>
  );
};
