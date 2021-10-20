import { Col, Row, Image, Button } from 'antd';
import { FC, useState } from 'react';
import {
  ColorsTable,
  SchemaInfoTable,
  SchemaViewer,
} from 'src/components/schema';
import { downloadSchema } from 'src/core/functions/downloadSchema';
import { Schema } from 'src/core/types';
import styles from './GeneratorResult.module.scss';

type Props = {
  schema: Schema;
  onSave?: () => void;
};

export const GeneratorResult: FC<Props> = ({ schema, onSave }) => {
  const [previewSchema, setPreviewSchema] = useState(false);

  if (previewSchema) {
    return (
      <div className={styles.schema}>
        <SchemaViewer
          schema={schema}
          onBack={() => {
            setPreviewSchema(false);
          }}
        />
      </div>
    );
  }

  return (
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
  );
};
