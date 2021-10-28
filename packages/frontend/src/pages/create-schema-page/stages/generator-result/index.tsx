import {
  ColorsTable,
  DownloadButton,
  Schema,
  SchemaInfoTable,
  SchemaViewer,
} from '@fancywork/core';
import { Button, Col, Image, Row } from 'antd';
import React, { FC, useState } from 'react';
import styles from './index.module.scss';

type Props = {
  schema: Schema;
  schemaImage: string;
  layout: React.ComponentType<any>;
  onSave?: () => void;
};

export const GeneratorResult: FC<Props> = ({
  schema,
  schemaImage,
  layout: Layout,
  onSave,
}) => {
  const [previewSchema, setPreviewSchema] = useState(false);

  if (previewSchema) {
    return (
      <SchemaViewer
        schema={schema}
        onBack={() => {
          setPreviewSchema(false);
        }}
      />
    );
  }

  return (
    <Layout>
      <div className={styles.root}>
        <div className={styles.firstBlock}>
          <Row gutter={{ xs: 0, md: 24 }} className={styles.row}>
            <Col span={24} md={12}>
              <div className={styles.image}>
                <Image src={schemaImage} />
              </div>
            </Col>
            <Col span={24} md={12}>
              <div className={styles.info}>
                <Button
                  className={styles.button}
                  type="primary"
                  onClick={() => {
                    onSave && onSave();
                  }}
                >
                  Save
                </Button>
                <Button
                  className={styles.button}
                  onClick={() => {
                    setPreviewSchema(true);
                  }}
                >
                  View Schema
                </Button>
                <DownloadButton
                  schemaLoader={() => schema}
                  className={styles.button}
                />
                <SchemaInfoTable
                  metadata={schema.metadata}
                  pagination={false}
                  scroll={{ x: true }}
                />
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.secondBlock}>
          <ColorsTable palette={schema.palette} scroll={{ x: true }} />
        </div>
      </div>
    </Layout>
  );
};
