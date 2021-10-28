import { WorkMetadata } from '@fancywork/core';
import {
  Search,
  TablePaginationLayout,
  useAppStorage,
  useTablePagination,
  WorkImage,
  WorkImageIndex,
  WorkMetadataIndex,
  WORK_IMAGES_TABLE,
  WORK_METADATA_TABLE,
} from '@fancywork/storage';
import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import { AppPage } from 'src/types';
import { WORKS_PATHNAME } from './constants';
import styles from './index.module.scss';
import { WorkCard } from './work-card';

const PAGE_SIZE = 10;
const PARAM_NAME = 'search';

export const WorksPage: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const pagination = useTablePagination<WorkMetadata, WorkImage | undefined>(
    PAGE_SIZE,
    {
      query: (storage) => {
        const params = new URLSearchParams(history.location.search);
        const param = params.get(PARAM_NAME)?.toLowerCase();
        return param
          ? storage
              .table(WORK_METADATA_TABLE)
              .filter(
                (metadata) => metadata.name.toLowerCase().indexOf(param) !== -1
              )
          : storage
              .table(WORK_METADATA_TABLE)
              .orderBy(WorkMetadataIndex.LastActivity);
      },
      loadAdditional: async (data) => {
        return await Promise.all(
          data.map(({ id }) => {
            return appStorage
              .table(WORK_IMAGES_TABLE)
              .get({ [WorkImageIndex.Id]: id });
          })
        );
      },
    }
  );

  return (
    <TablePaginationLayout
      title="My works"
      noDataText="No Works"
      onBack={() => {
        history.goBack();
      }}
      tablePagination={pagination}
      extraContent={
        <Search
          paramName={PARAM_NAME}
          size="large"
          className={styles.search}
          onSearch={() => {
            pagination.reset();
          }}
        />
      }
    >
      <Row gutter={[24, 24]}>
        {pagination.data.map((metadata, index) => {
          const { additionalData } = pagination;
          const image = additionalData ? additionalData[index] : undefined;

          return (
            <Col span={24} md={12} key={metadata.id}>
              <WorkCard
                metadata={metadata}
                image={image}
                onDelete={async (id) => {
                  await appStorage.deleteWork(id);
                  pagination.refresh();
                }}
              />
            </Col>
          );
        })}
      </Row>
    </TablePaginationLayout>
  );
};

WorksPage.pathname = WORKS_PATHNAME;
