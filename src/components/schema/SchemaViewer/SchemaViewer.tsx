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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) {
      throw new Error('No canvas');
    }

    if (scrollAreaRef.current === null) {
      throw new Error('No scroll area');
    }

    const provider = new SchemaViewProvider(schema);

    const schemaCanvas = new SchemaCanvas(
      provider,
      canvasRef.current,
      scrollAreaRef.current
    );

    return () => {
      schemaCanvas.destroy();
    };
  }, [schema]);

  return (
    <div className={styles.root}>
      <BasicLayout
        title={schema.metadata.name}
        subTitle="view only"
        onBack={onBack}
      >
        <div className={styles.area}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div ref={scrollAreaRef} className={styles.scrollArea} />
        </div>
      </BasicLayout>
    </div>
  );
};
