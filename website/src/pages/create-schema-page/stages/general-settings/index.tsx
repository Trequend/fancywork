import { Palette, palettes } from '@fancywork/core';
import {
  Button,
  Col,
  Form,
  Image,
  Input,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { FC } from 'react';
import styles from './index.module.scss';

export type GeneralSettingsValues = {
  name: string;
  palette: Palette;
  stitchesPerInch: number;
};

type Props = {
  imageURL: string;
  initialValues?: GeneralSettingsValues;
  onSubmit: (values: GeneralSettingsValues) => void;
};

export const GeneralSettings: FC<Props> = ({
  imageURL,
  initialValues,
  onSubmit,
}) => {
  const onFinish = (values: any) => {
    const result: GeneralSettingsValues = {
      name: values.name,
      palette: palettes.find((palette) => palette.name === values.palette)!,
      stitchesPerInch: values.stitchesPerInch,
    };

    onSubmit(result);
  };

  return (
    <div className={styles.root}>
      <Row gutter={{ xs: 0, md: 24 }} className={styles.row}>
        <Col span={24} md={12}>
          <div className={styles.image}>
            <Image src={imageURL} />
          </div>
        </Col>
        <Col span={24} md={12}>
          <Form
            layout="vertical"
            className={styles.form}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item
              name="name"
              label="Name"
              initialValue={initialValues?.name}
              rules={[{ required: true, message: 'Required field' }]}
            >
              <Input type="text" />
            </Form.Item>
            <Form.Item
              name="palette"
              label="Threads palette"
              initialValue={initialValues?.palette.name}
              rules={[{ required: true, message: 'Required field' }]}
            >
              <Select>
                {palettes.map((palette) => {
                  return (
                    <Select.Option value={palette.name} key={palette.name}>
                      {palette.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="stitchesPerInch"
              label="Stitches per inch"
              tooltip="Canvas property"
              initialValue={initialValues?.stitchesPerInch}
              normalize={(value) =>
                value === '' ? '' : Math.abs(Math.round(value))
              }
              rules={[{ required: true, message: 'Required field' }]}
            >
              <InputNumber min={1} className={styles.inputNumber} />
            </Form.Item>
            <Button htmlType="submit" type="primary" className={styles.button}>
              Next step
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
