import { ClearOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, message, Tag } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { WorkCanvas, WorkViewProvider, Work } from '@fancywork/core';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Layout } from '../layout';
import { WorkProgress } from '../work-progress';
import { ColorsList } from './colors-list';
import styles from './index.module.scss';
import { WorkViewerMenu } from './work-viewer-menu';

type Props = {
  work: Work;
  onBack?: () => void;
  onSave?: () => Promise<void> | void;
};

export const WorkViewer: FC<Props> = ({ work, onBack, onSave }) => {
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

  useEffect(() => {
    if (rootRef.current === null) {
      throw new Error('No root');
    }

    const workCanvas = new WorkCanvas(viewProvider, rootRef.current);
    setCanvas(workCanvas);

    const update = () => {
      forceUpdate({});
      setChanged(true);
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
      canvas.eraseMode = eraseMode;
      canvas.penColorCode = penColorCode;
    }
  }, [canvas, eraseMode, penColorCode]);

  const save = async () => {
    if (saving || !onSave) {
      return;
    }

    setSaving(true);
    setChanged(false);
    try {
      await onSave();
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
  };

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
              <Button
                type="primary"
                loading={saving}
                onClick={save}
                icon={<SaveOutlined />}
              >
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
