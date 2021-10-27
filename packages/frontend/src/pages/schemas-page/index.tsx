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
  TablePaginationLayout,
  useTablePagination,
  Search,
  SchemaIndex,
} from '@fancywork/storage';
import { CreateWorkModal } from './create-work-modal';
import { SCHEMAS_PATHNAME } from './constants';
import styles from './index.module.scss';
import { SCHEMA_PATHNAME } from '../schema-page/constants';

const PAGE_SIZE = 4;

export const SchemasPage: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const [schema, setSchema] = useState<Schema>();

  const tablePagination = useTablePagination(PAGE_SIZE, (storage) => {
    const params = new URLSearchParams(history.location.search);
    return params.has('search')
      ? storage
          .table('schemas')
          .where(SchemaIndex.Name)
          .startsWithIgnoreCase(params.get('search')!)
      : storage.table('schemas').toCollection();
  });

  return (
    <>
      <CreateWorkModal
        schema={schema}
        onCancel={() => {
          setSchema(undefined);
        }}
      />
      <TablePaginationLayout
        title="My schemas"
        noDataText="No Schemas"
        onBack={() => {
          history.goBack();
        }}
        tablePagination={tablePagination}
        extraContent={
          <Search
            paramName="search"
            size="large"
            className={styles.search}
            onSearch={() => {
              tablePagination.reset();
            }}
          />
        }
      >
        <Row gutter={[24, 24]}>
          {tablePagination.data.map((schema) => {
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
                        await appStorage
                          .table('schemas')
                          .where(SchemaIndex.Id)
                          .equals(schema.id)
                          .delete();
                        tablePagination.refresh();
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
      </TablePaginationLayout>
    </>
  );
};

SchemasPage.pathname = SCHEMAS_PATHNAME;
