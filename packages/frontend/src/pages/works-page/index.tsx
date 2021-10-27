import { AppPage } from 'src/types';
import { WORKS_PATHNAME } from './constants';
import { Button, Card, Col, Row, Image, Popconfirm } from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { SchemaInfoTable } from '@fancywork/core';
import {
  useAppStorage,
  useTablePagination,
  TablePaginationLayout,
  WorkIndex,
  Search,
} from '@fancywork/storage';
import { WORK_PATHNAME } from '../work-page/constants';
import styles from './index.module.scss';

const PAGE_SIZE = 4;
const PARAM_NAME = 'search';

export const WorksPage: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const tablePagination = useTablePagination(PAGE_SIZE, (storage) => {
    const params = new URLSearchParams(history.location.search);
    const param = params.get(PARAM_NAME);
    return param
      ? storage
          .table('works')
          .where(WorkIndex.NameWords)
          .startsWithAnyOf(param.toLowerCase().split(' '))
      : storage.table('works').orderBy(WorkIndex.LastActivity);
  });

  return (
    <TablePaginationLayout
      title="My works"
      noDataText="No Works"
      onBack={() => {
        history.goBack();
      }}
      tablePagination={tablePagination}
      extraContent={
        <Search
          paramName={PARAM_NAME}
          size="large"
          className={styles.search}
          onSearch={() => {
            tablePagination.reset();
          }}
        />
      }
    >
      <Row gutter={[24, 24]}>
        {tablePagination.data.map((work) => {
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
                      await appStorage
                        .table('works')
                        .where(WorkIndex.Id)
                        .equals(work.id)
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
    </TablePaginationLayout>
  );
};

WorksPage.pathname = WORKS_PATHNAME;
