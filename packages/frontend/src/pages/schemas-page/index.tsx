import { SchemaMetadata } from '@fancywork/core';
import {
  SchemaImage,
  SchemaImageIndex,
  Search,
  TablePaginationLayout,
  useAppStorage,
  useTablePagination,
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
  const appStorage = useAppStorage();

  const pagination = useTablePagination<
    SchemaMetadata,
    SchemaImage | undefined
  >(PAGE_SIZE, {
    query: (storage) => {
      const params = new URLSearchParams(history.location.search);
      const param = params.get(PARAM_NAME)?.toLowerCase();
      return param
        ? storage
            .table('schema_metadata')
            .filter(
              (metadata) => metadata.name.toLowerCase().indexOf(param) !== -1
            )
        : storage.table('schema_metadata').toCollection();
    },
    loadAdditional: async (data) => {
      return await Promise.all(
        data.map(({ id }) => {
          return appStorage
            .table('schema_images')
            .get({ [SchemaImageIndex.Id]: id });
        })
      );
    },
  });

  return (
    <TablePaginationLayout
      title="My schemas"
      noDataText="No Schemas"
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
              <SchemaCard
                metadata={metadata}
                image={image}
                onDelete={async (id) => {
                  await appStorage.deleteSchema(id);
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

SchemasPage.pathname = SCHEMAS_PATHNAME;
