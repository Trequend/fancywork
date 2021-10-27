import { Button, Card, Col, Row, Image, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppPage } from 'src/types';
import { Schema, SchemaInfoTable, DownloadButton } from '@fancywork/core';
import {
  useAppStorage,
  useStorePagination,
  StorePaginationLayout,
} from '@fancywork/storage';
import { CreateWorkModal } from './create-work-modal';
import { SCHEMAS_PATHNAME } from './constants';
import styles from './index.module.scss';
import { SCHEMA_PATHNAME } from '../schema-page/constants';

const PAGE_SIZE = 4;

export const SchemasPage: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const storePagination = useStorePagination('schemas', PAGE_SIZE, {
    direction: 'prev',
  });

  const [schema, setSchema] = useState<Schema>();

  return (
    <>
      <CreateWorkModal
        schema={schema}
        onCancel={() => {
          setSchema(undefined);
        }}
      />
      <StorePaginationLayout
        title="My schemas"
        noDataText="No Schemas"
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
                        await appStorage.delete('schemas', schema._index);
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
                        setSchema(schema);
                      }}
                    >
                      To Embroider
                    </Button>
                    <Button
                      className={styles.cardButton}
                      onClick={() => {
                        history.push(`${SCHEMA_PATHNAME}?id=${schema.id}`);
                      }}
                    >
                      View Schema
                    </Button>
                    <DownloadButton
                      schema={schema}
                      className={styles.cardButton}
                    />
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </StorePaginationLayout>
    </>
  );
};

SchemasPage.pathname = SCHEMAS_PATHNAME;
