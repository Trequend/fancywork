import { StorePaginationLayout } from 'src/components/layouts';
import { AppPage } from 'src/types';
import { WORKS_PATHNAME } from './constants';
import { Button, Card, Col, Row, Image, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { SchemaInfoTable } from 'src/components/schema';
import { useAppStorage } from 'src/storage/AppStorageContext';
import { useStorePagination } from 'src/storage/useStorePagination';
import styles from './Works.module.scss';

const PAGE_SIZE = 4;

export const Works: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const storePagination = useStorePagination('works', PAGE_SIZE);

  return (
    <StorePaginationLayout
      title="My works"
      onBack={() => {
        history.goBack();
      }}
      storePagination={storePagination}
    >
      <Row gutter={[24, 24]}>
        {storePagination.data.map((work) => {
          const { schema } = work;

          return (
            <Col span={24} md={12} key={work.id}>
              <Card
                className={styles.card}
                actions={[
                  <SettingOutlined key="edit" />,
                  <Popconfirm
                    title="Delete work"
                    key="delete"
                    okType="danger"
                    onConfirm={async () => {
                      await appStorage.delete('works', work.id);
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
                  <Button type="primary" className={styles.cardButton}>
                    Continue
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

Works.pathname = WORKS_PATHNAME;
