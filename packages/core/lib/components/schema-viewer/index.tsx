import { FC, useEffect, useRef } from 'react';
import { Layout } from '../layout';
import { Schema } from 'lib/types';
import { SchemaCanvas, SchemaViewProvider } from 'lib/classes';
import styles from './index.module.scss';

type Props = {
  schema: Schema;
  onBack?: () => void;
};

export const SchemaViewer: FC<Props> = ({ schema, onBack }) => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current === null) {
      throw new Error('No root');
    }

    const provider = new SchemaViewProvider(schema);

    const schemaCanvas = new SchemaCanvas(provider, rootRef.current);

    return () => {
      schemaCanvas.destroy();
    };
  }, [schema]);

  return (
    <div className={styles.wrapper}>
      <Layout title={schema.metadata.name} onBack={onBack}>
        <div className={styles.root} ref={rootRef} />
      </Layout>
    </div>
  );
};
