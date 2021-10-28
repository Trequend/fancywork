import {
  DatabasePaginationLayout,
  Search,
  useDatabase,
  useDatabasePagination,
} from '@fancywork/storage';
import { Col, Row } from 'antd';
import { useHistory } from 'react-router-dom';
import { AppPage } from 'src/types';
import { SCHEMAS_PATHNAME } from './constants';
import styles from './index.module.scss';
import { SchemaCard } from './schema-card';

const PAGE_SIZE = 10;
const PARAM_NAME = 'search';

export const SchemasPage: AppPage = () => {
  const history = useHistory();
  const database = useDatabase();

  const pagination = useDatabasePagination(PAGE_SIZE, (database) => {
    const params = new URLSearchParams(history.location.search);
    return database.schemas.collection(params.get(PARAM_NAME));
  });

  return (
    <DatabasePaginationLayout
      title="My schemas"
      noDataText="No Schemas"
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
            <SchemaCard
              metadata={metadata}
              image={image}
              onDelete={async (id) => {
                await database.schemas.delete(id);
                pagination.refresh();
              }}
            />
          </Col>
        ))}
      </Row>
    </DatabasePaginationLayout>
  );
};

SchemasPage.pathname = SCHEMAS_PATHNAME;
