import { BasicLayout } from 'src/components/layouts';
import { AppPage } from 'src/types';
import { SCHEMAS_PATHNAME } from './constants';
import {
  Button,
  Card,
  Col,
  Pagination,
  Row,
  Image,
  Popconfirm,
  Spin,
} from 'antd';
import { useStorePagination } from 'src/storage/useStorePagination';
import styles from './Schemas.module.scss';
import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { SchemaInfoTable, SchemaViewer } from 'src/components/schema';
import { useEffect, useState } from 'react';
import { Schema } from 'src/core/types';
import { useAppStorage } from 'src/storage/AppStorageContext';

const PAGE_SIZE = 4;

export const Schemas: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();
  const { loading, data, total, page, refresh, setPage } =
    useStorePagination(PAGE_SIZE);
  const [schema, setSchema] = useState<Schema>();

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  if (schema) {
    return (
      <div className={styles.schema}>
        <SchemaViewer
          schema={schema}
          onBack={() => {
            setSchema(undefined);
          }}
        />
      </div>
    );
  }

  return (
    <BasicLayout
      title="My schemas"
      onBack={() => {
        history.goBack();
      }}
    >
      <div className={styles.root}>
        <Spin spinning={loading} delay={500}>
          <div></div>
          <Row gutter={[24, 24]}>
            {data.map((schema) => {
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
                          await appStorage.deleteSchema(schema.id);
                          refresh();
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
                      <Button type="primary" className={styles.cardButton}>
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
        </Spin>
        <div className={styles.pagination}>
          {total ? (
            <Pagination
              total={total}
              pageSize={PAGE_SIZE}
              current={page}
              hideOnSinglePage
              onChange={(page) => {
                setPage(page);
              }}
            />
          ) : null}
        </div>
      </div>
    </BasicLayout>
  );
};

Schemas.pathname = SCHEMAS_PATHNAME;
