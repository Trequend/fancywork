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
import styles from './WorksPage.module.scss';
import { WORK_PATHNAME } from '../WorkPage/constants';

const PAGE_SIZE = 4;

export const WorksPage: AppPage = () => {
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
                  title={work.name}
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
                    onClick={() => {
                      history.push(`${WORK_PATHNAME}?id=${work.id}`);
                    }}
                  >
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

WorksPage.pathname = WORKS_PATHNAME;
