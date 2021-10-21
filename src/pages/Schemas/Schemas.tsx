import { StorePaginationLayout } from 'src/components/layouts';
import { AppPage } from 'src/types';
import { SCHEMAS_PATHNAME } from './constants';
import { Button, Card, Col, Row, Image, Popconfirm, message } from 'antd';
import styles from './Schemas.module.scss';
import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { SchemaInfoTable, SchemaViewer } from 'src/components/schema';
import { useState } from 'react';
import { Schema } from 'src/core/types';
import { useAppStorage } from 'src/storage/AppStorageContext';
import { useStorePagination } from 'src/storage/useStorePagination';
import { createWork } from 'src/core/functions/createWork';

const PAGE_SIZE = 4;

export const Schemas: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const storePagination = useStorePagination('schemas', PAGE_SIZE);

  const [schema, setSchema] = useState<Schema>();

  if (schema) {
    return (
      <SchemaViewer
        schema={schema}
        onBack={() => {
          setSchema(undefined);
        }}
      />
    );
  }

  return (
    <StorePaginationLayout
      title="My schemas"
      onBack={() => {
        history.goBack();
      }}
      storePagination={storePagination}
    >
      <Row gutter={[24, 24]}>
        {storePagination.data.map((schema) => {
          return (
            <Col span={24} md={12} key={schema.id}>
              <Card
                className={styles.card}
                actions={[
                  <SettingOutlined key="edit" />,
                  <Popconfirm
                    title="Delete schema"
                    key="delete"
                    okType="danger"
                    onConfirm={async () => {
                      await appStorage.delete('schemas', schema.id);
                      storePagination.refresh();
                    }}
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  avatar={
                    <div className={styles.image}>
                      <Image
                        preview={{
                          mask: <EyeOutlined />,
                        }}
                        src={schema.metadata.schemaImageDataURL}
                        alt={schema.metadata.name}
                      />
                    </div>
                  }
                  title={schema.metadata.name}
                />
                <SchemaInfoTable
                  schema={schema}
                  pagination={false}
                  className={styles.table}
                  scroll={{ x: true }}
                />
                <div className={styles.cardButtons}>
                  <Button
                    type="primary"
                    className={styles.cardButton}
                    onClick={async () => {
                      const work = createWork(schema);
                      await appStorage.add('works', work);
                      message.success('Work created');
                    }}
                  >
                    To Embroider
                  </Button>
                  <Button
                    className={styles.cardButton}
                    onClick={() => {
                      setSchema(schema);
                    }}
                  >
                    View Schema
                  </Button>
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </StorePaginationLayout>
  );
};

Schemas.pathname = SCHEMAS_PATHNAME;
