import { Button, Modal, Form, Input, message } from 'antd';
import { FC, useState } from 'react';
import { useHistory } from 'react-router';
import { Schema, createWork } from '@fancywork/core';
import { WORKS_PATHNAME } from '../../works-page/constants';
import { useAppStorage } from '@fancywork/storage';
import styles from './index.module.scss';

type Props = {
  schema?: Schema;
  onCancel?: () => void;
};

export const CreateWorkModal: FC<Props> = ({ schema, onCancel }) => {
  const appStorage = useAppStorage();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    if (schema) {
      const action = async () => {
        setLoading(true);
        try {
          const work = createWork(values.name, schema);
          await appStorage.table('works').add(work);
          history.push(WORKS_PATHNAME);
        } catch (error) {
          setLoading(false);
          if (error instanceof Error) {
            message.error(error.message);
          } else {
            message.error('Unknown error');
          }
        }
      };

      action();
    }
  };

  return (
    <Modal
      title="Create work"
      visible={!!schema}
      closable
      onCancel={onCancel}
      width="400px"
      footer={null}
      centered
    >
      <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
        <p>Based on schema: {schema?.metadata.name}</p>
        <Form.Item
          name="name"
          label="Name"
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
          Create
        </Button>
      </Form>
    </Modal>
  );
};
