import { createSchemaImage, createWork, SchemaMetadata } from '@fancywork/core';
import { useDatabase } from '@fancywork/storage-react';
import { Button, Form, Input, message, Modal, Tag } from 'antd';
import { FC, useState } from 'react';
import { useHistory } from 'react-router';
import { WORK_PATHNAME } from '../../work-page/constants';
import { WORKS_PATHNAME } from '../../works-page/constants';
import styles from './index.module.scss';

type Props = {
  metadata?: SchemaMetadata;
  onCancel?: () => void;
};

export const CreateWorkModal: FC<Props> = ({ metadata, onCancel }) => {
  const database = useDatabase();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    if (metadata) {
      const action = async () => {
        setLoading(true);
        try {
          const schema = await database.schemas.get(metadata.id);
          if (schema) {
            const image = await createSchemaImage(schema);
            const work = createWork(values.name, schema);
            await database.works.add(work, image);
            history.push(WORKS_PATHNAME);
            history.push(`${WORK_PATHNAME}?id=${work.metadata.id}`);
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

  if (metadata) {
    return (
      <Modal
        title="Create work"
        closable
        visible
        onCancel={onCancel}
        width="400px"
        footer={null}
        centered
      >
        <Form layout="horizontal" requiredMark={false} onFinish={onFinish}>
          <p>
            Based on <Tag className={styles.tag}>{metadata.name}</Tag>
          </p>
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
            Create
          </Button>
        </Form>
      </Modal>
    );
  } else {
    return null;
  }
};
