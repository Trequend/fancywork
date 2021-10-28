import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { SchemaInfoTable, WorkMetadata } from '@fancywork/core';
import {
  Search,
  TablePaginationLayout,
  useAppStorage,
  useTablePagination,
  WorkImage,
  WorkImageIndex,
  WorkMetadataIndex,
} from '@fancywork/storage';
import { Button, Card, Col, Image, Popconfirm, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import { AppPage } from 'src/types';
import { WORK_PATHNAME } from '../work-page/constants';
import { WORKS_PATHNAME } from './constants';
import styles from './index.module.scss';

const PAGE_SIZE = 4;
const PARAM_NAME = 'search';

export const WorksPage: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const tablePagination = useTablePagination<
    WorkMetadata,
    WorkImage | undefined
  >(PAGE_SIZE, {
    query: (storage) => {
      const params = new URLSearchParams(history.location.search);
      const param = params.get(PARAM_NAME)?.toLowerCase();
      return param
        ? storage
            .table('work_metadata')
            .filter(
              (metadata) => metadata.name.toLowerCase().indexOf(param) !== -1
            )
        : storage
            .table('work_metadata')
            .orderBy(WorkMetadataIndex.LastActivity);
    },
    loadAdditional: async (data) => {
      return await Promise.all(
        data.map(({ id }) => {
          return appStorage
            .table('work_images')
            .get({ [WorkImageIndex.Id]: id });
        })
      );
    },
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
        {tablePagination.data.map((metadata, index) => {
          const { schemaMetadata } = metadata;
          const { additionalData } = tablePagination;
          const image = additionalData ? additionalData[index] : undefined;

          return (
            <Col span={24} md={12} key={metadata.id}>
              <Card
                className={styles.card}
                actions={[
                  <SettingOutlined key="edit" />,
                  <Popconfirm
                    title="Delete work"
                    key="delete"
                    okType="danger"
                    onConfirm={async () => {
                      await appStorage.deleteWork(metadata.id);
                      tablePagination.refresh();
                    }}
                  >
                    <DeleteOutlined />
                  </Popconfirm>,
                ]}
              >
                <Card.Meta
                  avatar={
                    image ? (
                      <div className={styles.image}>
                        <Image
                          preview={{
                            mask: <EyeOutlined />,
                          }}
                          src={image.dataURL}
                          alt={metadata.name}
                        />
                      </div>
                    ) : null
                  }
                  title={metadata.name}
                />
                <SchemaInfoTable
                  metadata={schemaMetadata}
                  pagination={false}
                  className={styles.table}
                  scroll={{ x: true }}
                />
                <div className={styles.cardButtons}>
                  <Button
                    type="primary"
                    className={styles.cardButton}
                    onClick={() => {
                      history.push(`${WORK_PATHNAME}?id=${metadata.id}`);
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
