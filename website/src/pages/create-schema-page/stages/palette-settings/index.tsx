import { PaletteReduceAlgorithm } from '@fancywork/core';
import {
  Button,
  Checkbox,
  Col,
  Form,
  Image,
  InputNumber,
  Row,
  Select,
} from 'antd';
import { FC, useState } from 'react';
import styles from './index.module.scss';

export type PaletteSettingsValues = {
  reduceAlgorithm?: PaletteReduceAlgorithm;
  maxColorsCount?: number;
  unlimitedColors: boolean;
  withDithering: boolean;
};

type Props = {
  imageURL: string;
  initialValues?: PaletteSettingsValues;
  onSubmit: (values: PaletteSettingsValues) => void;
};

export const PaletteSettings: FC<Props> = ({
  imageURL,
  initialValues,
  onSubmit,
}) => {
  const [unlimitedColors, setUnlimitedColors] = useState<boolean>(
    initialValues ? initialValues.unlimitedColors : false
  );

  const [withDithering, setWithDithering] = useState<boolean>(
    initialValues ? initialValues.withDithering : true
  );

  const onFinish = (values: any) => {
    const result: PaletteSettingsValues = {
      reduceAlgorithm: values.reduceAlgorithm,
      maxColorsCount: values.maxColorsCount,
      unlimitedColors,
      withDithering,
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
            {unlimitedColors ? null : (
              <>
                <Form.Item
                  name="reduceAlgorithm"
                  label="Palette reduce algorithm"
                  initialValue={initialValues?.reduceAlgorithm}
                  rules={[{ required: true, message: 'Required field' }]}
                >
                  <Select>
                    <Select.Option value="nearest">Nearest color</Select.Option>
                    <Select.Option value="contrast">
                      Contrast color
                    </Select.Option>
                    <Select.Option value="average-distance">
                      Average distance color
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item
                  name="maxColorsCount"
                  label="Max colors count"
                  initialValue={initialValues?.maxColorsCount}
                  rules={[{ required: true, message: 'Required field' }]}
                >
                  <InputNumber min={1} className={styles.inputNumber} />
                </Form.Item>
              </>
            )}
            <div className={styles.checkbox}>
              <Checkbox
                onChange={(value) => {
                  setUnlimitedColors(value.target.checked);
                }}
                checked={unlimitedColors}
              >
                Unlimited colors
              </Checkbox>
            </div>
            <div className={styles.checkbox}>
              <Checkbox
                onChange={(value) => {
                  setWithDithering(value.target.checked);
                }}
                checked={withDithering}
              >
                Dithering
              </Checkbox>
            </div>
            <Button htmlType="submit" type="primary" className={styles.button}>
              Generate
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
