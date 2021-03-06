import {
  DeleteOutlined,
  EyeOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { WorkMetadata } from '@fancywork/core';
import {
  DownloadButton,
  WorkInfoTable,
  WorkProgress,
} from '@fancywork/core-react';
import { WorkImage } from '@fancywork/storage';
import { useDatabase } from '@fancywork/storage-react';
import { Button, Card, Image, Popconfirm, Spin } from 'antd';
import { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WORK_PATHNAME } from '../../work-page/constants';
import styles from './index.module.scss';
import { WorkSettingsButton } from './work-settings-button';

type Props = {
  metadata: WorkMetadata;
  image?: WorkImage;
};

export const WorkCard: FC<Props> = ({ metadata, image }) => {
  const database = useDatabase();
  const history = useHistory();

  const [deletePending, setDeletePending] = useState(false);

  return (
    <Card
      className={styles.root}
      actions={[
        <WorkSettingsButton
          key="settings"
          metadata={metadata}
          onChangeName={async (name: string) => {
            await database.works.changeName(metadata.id, name);
          }}
        />,
        <Popconfirm
          title="Delete work"
          key="delete"
          okType="danger"
          disabled={deletePending}
          onConfirm={async () => {
            setDeletePending(true);
            await database.works.delete(metadata.id);
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
      <WorkInfoTable
        metadata={metadata}
        pagination={false}
        className={styles.table}
        scroll={{ x: true }}
      />
      <div className={styles.progress}>
        <WorkProgress metadata={metadata} />
      </div>
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
        <DownloadButton
          className={styles.cardButton}
          schemaLoader={async () => {
            const work = await database.works.get(metadata.id);

            if (work) {
              return work.schema;
            } else {
              throw new Error('No work');
            }
          }}
        />
      </div>
    </Card>
  );
};
