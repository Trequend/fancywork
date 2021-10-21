import {
  Col,
  Row,
  Form,
  Select,
  InputNumber,
  Checkbox,
  Button,
  Image,
} from 'antd';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { SizeType } from 'src/core/functions/convertSchemaSize';
import styles from './SizeSettings.module.scss';

export type SizeSettingsValues = {
  width: number;
  height: number;
  sizeType: SizeType;
  keepAspectRatio: boolean;
};

type Props = {
  imageURL: string;
  image: HTMLImageElement;
  initialValues?: SizeSettingsValues;
  onSubmit: (values: SizeSettingsValues) => void;
};

export const SizeSettings: FC<Props> = ({
  imageURL,
  image,
  initialValues,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [sizeType, setSizeType] = useState<string | undefined>(
    initialValues?.sizeType ?? 'stitch'
  );
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(
    initialValues?.keepAspectRatio ?? true
  );
  const aspectRatio = useMemo(() => image.width / image.height, [image]);

  const normalize = useCallback(
    (value: any): string => {
      if (value === '' || value === undefined) {
        return '';
      } else {
        value = Math.abs(value);
        if (sizeType === 'stitch') {
          return Math.round(value).toString();
        } else {
          return value.toString();
        }
      }
    },
    [sizeType]
  );

  useEffect(() => {
    let width = form.getFieldValue('width');
    let height = form.getFieldValue('height');
    if (keepAspectRatio) {
      if (width !== undefined) {
        height = width ? +width / aspectRatio : undefined;
      } else if (height !== undefined) {
        width = height ? +height * aspectRatio : undefined;
      }
    }

    form.setFieldsValue({
      width: normalize(width),
      height: normalize(height),
    });
  }, [normalize, form, aspectRatio, keepAspectRatio]);

  const onFinish = (values: any) => {
    const result: SizeSettingsValues = {
      width: values.width,
      height: values.height,
      sizeType: values.sizeType,
      keepAspectRatio,
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
            form={form}
            layout="vertical"
            className={styles.form}
            requiredMark={false}
            onFinish={onFinish}
          >
            <Form.Item
              name="sizeType"
              label="Size type"
              initialValue={sizeType}
              rules={[{ required: true, message: 'Required field' }]}
            >
              <Select
                onChange={(value) => {
                  setSizeType(value?.toString());
                }}
              >
                <Select.Option value="stitch">Size in stitches</Select.Option>
                <Select.Option value="centimeter">
                  Size in centimeters
                </Select.Option>
                <Select.Option value="inch">Size in inches</Select.Option>
              </Select>
            </Form.Item>
            <Row gutter={12}>
              <Col span={24} md={12}>
                <Form.Item
                  name="width"
                  label="Width"
                  initialValue={initialValues?.width}
                  normalize={normalize}
                  rules={[{ required: true, message: 'Required field' }]}
                >
                  <InputNumber
                    className={styles.inputNumber}
                    min={sizeType === 'stitch' ? 1 : 0.001}
                    onChange={(width) => {
                      if (keepAspectRatio) {
                        const height = width ? +width / aspectRatio : undefined;
                        form.setFieldsValue({ height: normalize(height) });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
              <Col span={24} md={12}>
                <Form.Item
                  name="height"
                  label="Height"
                  initialValue={initialValues?.height}
                  normalize={normalize}
                  rules={[{ required: true, message: 'Required field' }]}
                >
                  <InputNumber
                    className={styles.inputNumber}
                    min={sizeType === 'stitch' ? 1 : 0.001}
                    onChange={(height) => {
                      if (keepAspectRatio) {
                        const width = height
                          ? +height * aspectRatio
                          : undefined;
                        form.setFieldsValue({ width: normalize(width) });
                      }
                    }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <div className={styles.checkbox}>
              <Checkbox
                onChange={(event) => {
                  setKeepAspectRatio(event.target.checked);
                }}
                checked={keepAspectRatio}
              >
                Keep aspect ratio
              </Checkbox>
            </div>
            <Button htmlType="submit" type="primary" className={styles.button}>
              Next step
            </Button>
          </Form>
        </Col>
      </Row>
    </div>
  );
};
