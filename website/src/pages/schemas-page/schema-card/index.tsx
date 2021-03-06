import {
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { SchemaMetadata } from '@fancywork/core';
import { DownloadButton, SchemaInfoTable } from '@fancywork/core-react';
import { SchemaImage } from '@fancywork/storage';
import { useDatabase } from '@fancywork/storage-react';
import { Button, Card, Image, Popconfirm, Spin } from 'antd';
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SCHEMA_PATHNAME } from '../../schema-page/constants';
import { CreateWorkModal } from '../create-work-modal';
import styles from './index.module.scss';
import { SchemaSettingsButton } from './schema-settings-button';

type Props = {
  metadata: SchemaMetadata;
  image?: SchemaImage;
};

export const SchemaCard: FC<Props> = ({ metadata, image }) => {
  const database = useDatabase();
  const history = useHistory();

  const [modalVisible, setModalVisible] = useState(false);
  const [deletePending, setDeletePending] = useState(false);

  return (
    <>
      {modalVisible ? (
        <CreateWorkModal
          metadata={metadata}
          onCancel={() => {
            setModalVisible(false);
          }}
        />
      ) : null}
      <Card
        className={styles.root}
        actions={[
          <SchemaSettingsButton
            key="settings"
            metadata={metadata}
            onChangeName={async (name: string) => {
              await database.schemas.changeName(metadata.id, name);
            }}
          />,
          <Popconfirm
            title="Delete schema"
            key="delete"
            okType="danger"
            disabled={deletePending}
            onConfirm={async () => {
              setDeletePending(true);
              await database.schemas.delete(metadata.id);
              setDeletePending(false);
            }}
          >
            <Spin spinning={deletePending} indicator={<LoadingOutlined />}>
              <DeleteOutlined />
            </Spin>
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
              setModalVisible(true);
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
              const schema = await database.schemas.get(metadata.id);

              if (schema) {
                return schema;
              } else {
                throw new Error('No schema');
              }
            }}
          />
        </div>
      </Card>
    </>
  );
};
