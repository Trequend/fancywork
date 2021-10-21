import { FC, useEffect, useRef } from 'react';
import { BasicLayout } from 'src/components/layouts';
import { Schema } from 'src/core/types';
import { SchemaCanvas, SchemaViewProvider } from 'src/core/classes';
import styles from './SchemaViewer.module.scss';

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
      <BasicLayout title={schema.metadata.name} onBack={onBack}>
        <div className={styles.root} ref={rootRef} />
      </BasicLayout>
    </div>
  );
};
