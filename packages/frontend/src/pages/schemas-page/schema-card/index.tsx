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
import { SchemaImage, useDatabase } from '@fancywork/storage';
import { Button, Card, Image, Popconfirm } from 'antd';
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SCHEMA_PATHNAME } from 'src/pages/schema-page/constants';
import { CreateWorkModal } from '../create-work-modal';
import styles from './index.module.scss';

type Props = {
  metadata: SchemaMetadata;
  image?: SchemaImage;
  onDelete?: (id: string) => Promise<void> | void;
};

export const SchemaCard: FC<Props> = ({ metadata, image, onDelete }) => {
  const database = useDatabase();
  const history = useHistory();

  const [modalVisible, setModalVisible] = useState(false);

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
          <SettingOutlined key="edit" />,
          <Popconfirm
            title="Delete schema"
            key="delete"
            okType="danger"
            onConfirm={async () => {
              onDelete && (await onDelete(metadata.id));
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
