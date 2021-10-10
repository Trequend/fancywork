import { Col, Row, Form, Select, Input, Button } from 'antd';
import { FC } from 'react';
import { BasicLayout } from 'src/components/layouts';
import { PreviewFileImage } from 'src/components/ui/image';
import styles from './Generator.module.scss';

type Props = {
  sourceImage: File;
};

const Generator: FC<Props> = ({ sourceImage }) => {
  return (
    <BasicLayout title="Generator">
      <div className={styles.root}>
        <Row gutter={24} className={styles.row}>
          <Col span={24} md={12}>
            <div className={styles.image}>
              <PreviewFileImage image={sourceImage} />
            </div>
          </Col>
          <Col span={24} md={12}>
            <Form className={styles.form}>
              <h2 className={styles.formHeader}>Settings</h2>
              <Form.Item name="pallet">
                <Select placeholder="Pallet">
                  <Select.Option value="dmc">DMC</Select.Option>
                  <Select.Option value="madeira">Madeira</Select.Option>
                  <Select.Option value="anchor">Anchor</Select.Option>
                  <Select.Option value="gamma">Gamma</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="name">
                <Input type="text" placeholder="Name" />
              </Form.Item>
              <Row gutter={12}>
                <Col span={24} md={12}>
                  <Form.Item name="width">
                    <Input type="number" placeholder="Width (cm)" />
                  </Form.Item>
                </Col>
                <Col span={24} md={12}>
                  <Form.Item name="height">
                    <Input type="number" placeholder="Height (cm)" />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                htmlType="submit"
                type="primary"
                className={styles.submitButton}
              >
                Generate
              </Button>
            </Form>
          </Col>
        </Row>
      </div>
    </BasicLayout>
  );
};

export default Generator;
