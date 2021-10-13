import { Col, Row, Form, Select, Checkbox, Input, Button } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { convertSchemaSize } from 'src/core/functions/convertSchemaSize';
import { createSchema } from 'src/core/functions/createSchema';
import { palettes } from 'src/core/palettes';
import styles from './GeneratorForm.module.scss';

type Props = {
  imageURL: string;
  image: HTMLImageElement;
  className?: string;
};

export const GeneratorForm: FC<Props> = ({ imageURL, image, className }) => {
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [sizeType, setSizeType] = useState<string>();
  const [unlimitedColors, setUnlimitedColors] = useState<boolean>();
  const [keepAspectRatio, setKeepAspectRatio] = useState<boolean>(true);
  const aspectRatio = useMemo(() => image.width / image.height, [image]);

  const normalizeSize = useCallback(
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
      width: normalizeSize(width),
      height: normalizeSize(height),
    });
  }, [normalizeSize, form, aspectRatio, keepAspectRatio]);

  const onFinish = (values: any) => {
    const action = async () => {
      if (imageURL) {
        setLoading(true);

        const size =
          values.sizeType === 'original'
            ? { width: undefined, height: undefined }
            : convertSchemaSize(
                values.width,
                values.height,
                values.stitchCount,
                values.sizeType
              );

        await createSchema(imageURL, {
          name: values.name,
          palette: palettes.find((palette) => palette.name === values.palette)!,
          colorsCount: unlimitedColors ? undefined : +values.colorsCount,
          reduceAlgorithm: unlimitedColors
            ? undefined
            : values.paletteReduceAlgorithm,
          width: size.width,
          height: size.height,
          stitchCount: +values.stitchCount,
        });

        setLoading(false);
      }
    };

    action();
  };

  return (
    <Form
      layout="vertical"
      form={form}
      className={className}
      requiredMark={false}
      onFinish={onFinish}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input type="text" />
      </Form.Item>
      <Form.Item
        name="palette"
        label="Threads palette"
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
        name="stitchCount"
        label="Stitch Count"
        normalize={(value) => (value === '' ? '' : Math.abs(Math.round(value)))}
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        name="sizeType"
        label="Size type"
        rules={[{ required: true, message: 'Required field' }]}
      >
        <Select
          onChange={(value) => {
            setSizeType(value?.toString());
          }}
        >
          <Select.Option value="original">Image size</Select.Option>
          <Select.Option value="stitch">Size in stitches</Select.Option>
          <Select.Option value="centimeter">Size in centimeters</Select.Option>
          <Select.Option value="inch">Size in inches</Select.Option>
        </Select>
      </Form.Item>
      {sizeType === undefined || sizeType === 'original' ? null : (
        <>
          <Row gutter={12}>
            <Col span={24} md={12}>
              <Form.Item
                name="width"
                label="Width"
                normalize={normalizeSize}
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input
                  type="number"
                  onChange={(event) => {
                    const width = event.target.value;
                    if (keepAspectRatio) {
                      const height = width ? +width / aspectRatio : undefined;
                      form.setFieldsValue({ height: normalizeSize(height) });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item
                name="height"
                label="Height"
                normalize={normalizeSize}
                rules={[{ required: true, message: 'Required field' }]}
              >
                <Input
                  type="number"
                  onChange={(event) => {
                    const height = event.target.value;
                    if (keepAspectRatio) {
                      const width = height ? +height * aspectRatio : undefined;
                      form.setFieldsValue({ width: normalizeSize(width) });
                    }
                  }}
                />
              </Form.Item>
            </Col>
          </Row>
          <div className={styles.checkbox}>
            <Checkbox
              onChange={(value) => {
                setKeepAspectRatio(value.target.checked);
              }}
              checked={keepAspectRatio}
            >
              Keep aspect ratio
            </Checkbox>
          </div>
        </>
      )}
      {unlimitedColors ? null : (
        <>
          <Form.Item
            name="paletteReduceAlgorithm"
            label="Palette reduce algorithm"
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Select>
              <Select.Option value="nearest">Nearest color</Select.Option>
              <Select.Option value="contrast">Contrast color</Select.Option>
              <Select.Option value="average-distance">
                Average distance color
              </Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="colorsCount"
            label="Max colors count"
            rules={[{ required: true, message: 'Required field' }]}
          >
            <Input type="number" />
          </Form.Item>
        </>
      )}
      <div className={styles.checkbox}>
        <Checkbox
          onChange={(value) => {
            setUnlimitedColors(value.target.checked);
          }}
          className={styles.checkbox}
          checked={unlimitedColors}
        >
          Unlimited colors
        </Checkbox>
      </div>
      <Button
        loading={loading}
        htmlType="submit"
        type="primary"
        className={styles.button}
      >
        Generate
      </Button>
    </Form>
  );
};
