import { BasicLayout } from 'src/components/layouts';
import { AppPage } from 'src/types';
import { SCHEMAS_PATHNAME } from './constants';
import { Button, Card, Col, Pagination, Row, Image } from 'antd';
import { useStorePagination } from 'src/storage/useStorePagination';
import styles from './Schemas.module.scss';
import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { SchemaInfoTable } from 'src/components/schema';

const PAGE_SIZE = 4;

export const Schemas: AppPage = () => {
  const history = useHistory();
  const { loading, data, total, page, setPage } = useStorePagination(PAGE_SIZE);

  return (
    <BasicLayout
      title="My schemas"
      onBack={() => {
        history.goBack();
      }}
    >
      <div className={styles.root}>
        {loading && data.length === 0 ? (
          <p>Loading</p>
        ) : (
          <Row gutter={[24, 24]}>
            {data.map((schema) => {
              return (
                <Col span={24} md={12} key={schema.id}>
                  <Card
                    className={styles.card}
                    actions={[
                      <SettingOutlined key="edit" />,
                      <DeleteOutlined key="delete" />,
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
                      style={{ marginTop: '24px' }}
                      scroll={{ x: true }}
                      footer={() => <Button type="link">More info</Button>}
                    />
                    <Button
                      type="primary"
                      style={{ marginTop: '24px', width: '100%' }}
                    >
                      To Embroider
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
        <div className={styles.pagination}>
          {total ? (
            <Pagination
              total={total}
              defaultCurrent={1}
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
