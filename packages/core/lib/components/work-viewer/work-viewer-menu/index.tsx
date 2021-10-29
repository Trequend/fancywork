import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Image, Menu, message, Modal, Spin } from 'antd';
import { WorkViewProvider } from 'lib/classes';
import { createWorkImage } from 'lib/functions';
import { Work } from 'lib/types';
import { FC, useState } from 'react';
import { ColorsTable } from '../../colors-table';
import { WorkInfoTable } from '../../work-info-table';
import styles from './index.module.scss';

type Props = {
  work: Work;
  viewProvider: WorkViewProvider;
  onSave?: () => void;
};

export const WorkViewerMenu: FC<Props> = ({ work, viewProvider, onSave }) => {
  const [visible, setVisible] = useState(false);
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [colorsModalVisible, setColorsModalVisible] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [result, setResult] = useState<string>();
  const [loading, setLoading] = useState(false);

  const menu = (
    <Menu
      disabled={loading}
      onClick={async (event) => {
        switch (event.key) {
          case 'save':
            onSave && onSave();
            break;
          case 'info':
            setInfoModalVisible(true);
            break;
          case 'colors':
            setColorsModalVisible(true);
            break;
          case 'result':
            setLoading(true);
            try {
              const image = await createWorkImage(work);
              setResult(image);
              setResultModalVisible(true);
            } catch (error) {
              if (error instanceof Error) {
                message.error(error.message);
              } else {
                message.error('Unknown error');
              }
            } finally {
              setLoading(false);
            }
            break;
        }

        setVisible(false);
      }}
    >
      {onSave ? (
        <Menu.Item key="save" className={styles.button}>
          Save
        </Menu.Item>
      ) : null}
      <Menu.Item key="info" className={styles.button}>
        Info
      </Menu.Item>
      <Menu.Item key="colors" className={styles.button}>
        Colors
      </Menu.Item>
      <Menu.Item key="result" className={styles.button}>
        <Spin spinning={loading}>Result</Spin>
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Modal
        title="Info"
        visible={infoModalVisible}
        width={550}
        onCancel={() => {
          setInfoModalVisible(false);
        }}
        footer={null}
        centered
      >
        <WorkInfoTable
          metadata={work.metadata}
          scroll={{ x: true }}
          pagination={false}
        />
      </Modal>
      <Modal
        visible={colorsModalVisible}
        width={1200}
        title="Colors"
        onCancel={() => {
          setColorsModalVisible(false);
        }}
        footer={null}
        centered
      >
        <ColorsTable
          palette={work.schema.palette}
          symbolResolver={(code) => {
            return viewProvider.getColorSymbol(code) ?? 'none';
          }}
          scroll={{ x: true }}
          pagination={{ simple: true }}
        />
      </Modal>
      <Modal
        visible={resultModalVisible}
        width={1200}
        title="Result"
        onCancel={() => {
          setResultModalVisible(false);
        }}
        footer={null}
        centered
      >
        <Image alt="Result" preview={false} src={result} />
      </Modal>
      <Dropdown
        overlay={menu}
        visible={visible}
        onVisibleChange={(value) => {
          setVisible(value);
        }}
        trigger={['click']}
      >
        <Button
          style={{
            border: 'none',
            padding: 0,
          }}
        >
          <EllipsisOutlined
            style={{
              fontSize: 20,
              verticalAlign: 'top',
            }}
          />
        </Button>
      </Dropdown>
    </>
  );
};
