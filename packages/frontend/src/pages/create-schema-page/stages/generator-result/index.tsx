import { Col, Row, Image, Button } from 'antd';
import React, { FC, useState } from 'react';
import {
  ColorsTable,
  SchemaInfoTable,
  SchemaViewer,
  Schema,
  downloadSchema,
} from '@fancywork/core';
import styles from './index.module.scss';

type Props = {
  schema: Schema;
  layout: React.ComponentType<any>;
  onSave?: () => void;
};

export const GeneratorResult: FC<Props> = ({
  schema,
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
                <Image src={schema.metadata.schemaImageDataURL} />
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
                <Button
                  className={styles.button}
                  onClick={() => {
                    downloadSchema(schema);
                  }}
                >
                  Download
                </Button>
                <SchemaInfoTable
                  schema={schema}
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
