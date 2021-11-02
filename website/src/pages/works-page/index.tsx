import {
  DatabasePaginationLayout,
  Search,
  useDatabasePagination,
} from '@fancywork/storage-react';
import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import { AppPage } from '../../types';
import { WORKS_PATHNAME } from './constants';
import styles from './index.module.scss';
import { WorkCard } from './work-card';

const PAGE_SIZE = 10;

const PARAM_NAME = 'search';

export const WorksPage: AppPage = () => {
  const history = useHistory();

  const pagination = useDatabasePagination(PAGE_SIZE, (database) => {
    const params = new URLSearchParams(history.location.search);
    return database.works.collection(params.get(PARAM_NAME));
  });

  return (
    <DatabasePaginationLayout
      title="My works"
      noDataText="No Works"
      onBack={() => {
        history.goBack();
      }}
      databasePagination={pagination}
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
        {pagination.data.map(({ metadata, image }) => (
          <Col span={24} md={12} key={metadata.id}>
            <WorkCard metadata={metadata} image={image} />
          </Col>
        ))}
      </Row>
    </DatabasePaginationLayout>
  );
};

WorksPage.pathname = WORKS_PATHNAME;
