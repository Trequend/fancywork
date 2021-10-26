import { FC, useEffect, useRef, useState } from 'react';
import { Layout } from '../layout';
import { Work } from 'lib/types';
import { WorkCanvas, WorkViewProvider } from 'lib/classes';
import styles from './index.module.scss';

type Props = {
  work: Work;
  onCanvasInit?: (canvas: WorkCanvas) => void;
  onBack?: () => void;
};

export const WorkViewer: FC<Props> = ({ work, onCanvasInit, onBack }) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [canvas, setCanvas] = useState<WorkCanvas | null>(null);

  useEffect(() => {
    if (rootRef.current === null) {
      throw new Error('No root');
    }

    const provider = new WorkViewProvider(work);

    const workCanvas = new WorkCanvas(provider, rootRef.current);
    setCanvas(workCanvas);

    return () => {
      workCanvas.destroy();
      setCanvas(null);
    };
  }, [work]);

  useEffect(() => {
    if (canvas && onCanvasInit) {
      onCanvasInit(canvas);
    }
  }, [canvas, onCanvasInit]);

  return (
    <div className={styles.wrapper}>
      <Layout title={work.name} onBack={onBack}>
        <div className={styles.root} ref={rootRef} />
      </Layout>
    </div>
  );
};
