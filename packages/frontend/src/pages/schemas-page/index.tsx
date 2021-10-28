import {
  DeleteOutlined,
  EyeOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import {
  DownloadButton,
  SchemaInfoTable,
  SchemaMetadata,
} from '@fancywork/core';
import {
  SchemaImage,
  SchemaImageIndex,
  SchemaIndex,
  Search,
  TablePaginationLayout,
  useAppStorage,
  useTablePagination,
} from '@fancywork/storage';
import { Button, Card, Col, Image, Popconfirm, Row } from 'antd';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppPage } from 'src/types';
import { SCHEMA_PATHNAME } from '../schema-page/constants';
import { SCHEMAS_PATHNAME } from './constants';
import { CreateWorkModal } from './create-work-modal';
import styles from './index.module.scss';

const PAGE_SIZE = 10;
const PARAM_NAME = 'search';

export const SchemasPage: AppPage = () => {
  const history = useHistory();
  const appStorage = useAppStorage();

  const [schemaMetadata, setSchemaMetadata] = useState<SchemaMetadata>();

  const tablePagination = useTablePagination<
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
    <>
      <CreateWorkModal
        metadata={schemaMetadata}
        onCancel={() => {
          setSchemaMetadata(undefined);
        }}
      />
      <TablePaginationLayout
        title="My schemas"
        noDataText="No Schemas"
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
            const { additionalData } = tablePagination;
            const image = additionalData ? additionalData[index] : undefined;

            return (
              <Col span={24} md={12} key={metadata.id}>
                <Card
                  className={styles.card}
                  actions={[
                    <SettingOutlined key="edit" />,
                    <Popconfirm
                      title="Delete schema"
                      key="delete"
                      okType="danger"
                      onConfirm={async () => {
                        await appStorage.deleteSchema(metadata.id);
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
                    metadata={metadata}
                    pagination={false}
                    className={styles.table}
                    scroll={{ x: true }}
                  />
                  <div className={styles.cardButtons}>
                    <Button
                      type="primary"
                      className={styles.cardButton}
                      onClick={() => {
                        setSchemaMetadata(metadata);
                      }}
                    >
                      To Embroider
                    </Button>
                    <Button
                      className={styles.cardButton}
                      onClick={() => {
                        history.push(`${SCHEMA_PATHNAME}?id=${metadata.id}`);
                      }}
                    >
                      View Schema
                    </Button>
                    <DownloadButton
                      className={styles.cardButton}
                      schemaLoader={async () => {
                        const schema = await appStorage
                          .table('schemas')
                          .get({ [SchemaIndex.Id]: metadata.id });

                        if (schema) {
                          return schema;
                        } else {
                          throw new Error('No schema');
                        }
                      }}
                    />
                  </div>
                </Card>
              </Col>
            );
          })}
        </Row>
      </TablePaginationLayout>
    </>
  );
};

SchemasPage.pathname = SCHEMAS_PATHNAME;
