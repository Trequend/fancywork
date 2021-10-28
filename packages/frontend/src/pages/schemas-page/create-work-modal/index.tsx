import { Button, Modal, Form, Input, message } from 'antd';
import { FC, useState } from 'react';
import { useHistory } from 'react-router';
import { SchemaMetadata, createWork, createSchemaImage } from '@fancywork/core';
import { WORKS_PATHNAME } from '../../works-page/constants';
import { useAppStorage, SchemaIndex } from '@fancywork/storage';
import styles from './index.module.scss';

type Props = {
  metadata?: SchemaMetadata;
  onCancel?: () => void;
};

export const CreateWorkModal: FC<Props> = ({ metadata, onCancel }) => {
  const appStorage = useAppStorage();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    if (metadata) {
      const action = async () => {
        setLoading(true);
        try {
          const schema = await appStorage
            .table('schemas')
            .get({ [SchemaIndex.Id]: metadata.id });

          if (schema) {
            const image = await createSchemaImage(schema);
            const work = createWork(values.name, schema);
            await appStorage.addWork(work, image);
            history.push(WORKS_PATHNAME);
          } else {
            throw new Error('No schema');
          }
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
      visible={!!metadata}
      closable
      onCancel={onCancel}
      width="400px"
      footer={null}
      centered
    >
      <Form layout="vertical" requiredMark={false} onFinish={onFinish}>
        <p>
          Based on schema:
          <br /> {metadata?.name}
        </p>
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
