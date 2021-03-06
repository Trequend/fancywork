import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import { Cell, Work, WorkCanvas, WorkViewProvider } from '@fancywork/core';
import { Button, message, Tag } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../layout';
import { WorkProgress } from '../work-progress';
import { ColorsList } from './colors-list';
import styles from './index.module.scss';
import { WorkViewerMenu } from './work-viewer-menu';

type Props = {
  work: Work;
  autoSaveTimeout?: number;
  onBack?: () => void;
  onSave?: (changedCells: Set<Cell>) => Promise<void> | void;
};

export const WorkViewer: FC<Props> = ({
  work,
  autoSaveTimeout,
  onBack,
  onSave,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewProvider = useMemo(() => new WorkViewProvider(work), [work]);
  const [canvas, setCanvas] = useState<WorkCanvas>();

  const { sm } = useBreakpoint();

  const [eraseMode, setEraseMode] = useState(false);
  const [penColorCode, setPenColorCode] = useState<string>();

  const [, forceUpdate] = useState<any>();

  const [saving, setSaving] = useState(false);
  const [saveResult, setSaveResult] = useState(true);
  const [changed, setChanged] = useState(false);

  const changedCells = useRef(new Set<Cell>());

  useEffect(() => {
    if (rootRef.current === null) {
      throw new Error('No root');
    }

    const workCanvas = new WorkCanvas(viewProvider, rootRef.current);
    setCanvas(workCanvas);

    const update = ({ data: cell }: { data: Cell }) => {
      forceUpdate({});
      setChanged(true);
      changedCells.current.add(cell);
    };

    workCanvas.addEventListener('cellEmbroidered', update);
    workCanvas.addEventListener('cellErased', update);

    return () => {
      workCanvas.destroy();
      setCanvas(undefined);
    };
  }, [viewProvider]);

  useEffect(() => {
    if (canvas) {
      canvas.setIsEraseMode(eraseMode);
      canvas.setPenColorCode(penColorCode);
    }
  }, [canvas, eraseMode, penColorCode]);

  const save = useCallback(async () => {
    if (!onSave) {
      return;
    }

    setSaving(true);
    setChanged(false);
    try {
      const changes = changedCells.current;
      changedCells.current = new Set<Cell>();
      await onSave(changes);
      setSaveResult(true);
    } catch (error) {
      setSaveResult(false);
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Unknown error');
      }
    } finally {
      setSaving(false);
    }
  }, [onSave]);

  useEffect(() => {
    if (changed && autoSaveTimeout) {
      const timeout = setTimeout(() => {
        save();
      }, autoSaveTimeout);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [changed, save, autoSaveTimeout]);

  return (
    <div className={styles.wrapper}>
      <Layout
        tags={
          saving ? (
            <Tag color="blue">Saving...</Tag>
          ) : changed ? (
            <Tag color="orange">Changed</Tag>
          ) : saveResult ? (
            <Tag color="green">Saved</Tag>
          ) : (
            <Tag color="red">Error</Tag>
          )
        }
        title={work.metadata.name}
        onBack={onBack}
        headerChildren={
          <div className={styles.headerContent}>
            <ColorsList
              className={styles.colors}
              palette={work.schema.palette}
              viewProvider={viewProvider}
              colorCode={penColorCode}
              onColorClick={(colorCode) => {
                if (colorCode === penColorCode) {
                  if (canvas) {
                    canvas.scrollToNotEmbroidered(colorCode);
                  }
                } else {
                  setPenColorCode(colorCode);
                }
              }}
            />
            <WorkProgress
              className={styles.progress}
              metadata={work.metadata}
              type="circle"
              width={65}
            />
          </div>
        }
        extra={
          <>
            {sm ? (
              <Button type="primary" onClick={save} icon={<SaveOutlined />}>
                Save
              </Button>
            ) : null}
            <Button
              type={eraseMode ? 'default' : 'dashed'}
              danger={eraseMode}
              onClick={() => {
                setEraseMode((value) => !value);
              }}
              icon={<ClearOutlined />}
            />
            <WorkViewerMenu
              work={work}
              onSave={sm ? undefined : save}
              viewProvider={viewProvider}
            />
          </>
        }
      >
        <div className={styles.root} ref={rootRef} />
      </Layout>
    </div>
  );
};
