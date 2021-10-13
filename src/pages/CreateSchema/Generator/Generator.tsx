import { Col, Row, Image as AntdImage } from 'antd';
import { FC, useEffect, useState } from 'react';
import { BasicLayout } from 'src/components/layouts';
import { GeneratorForm } from './GeneratorForm';
import styles from './Generator.module.scss';

type Props = {
  sourceImage: File;
};

export const Generator: FC<Props> = ({ sourceImage }) => {
  const [imageURL, setImageURL] = useState<string>();
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const url = URL.createObjectURL(sourceImage);
    setImageURL(url);

    return () => {
      setImageURL(undefined);
      URL.revokeObjectURL(url);
    };
  }, [sourceImage]);

  useEffect(() => {
    if (imageURL) {
      const image = new Image();
      image.src = imageURL;
      image.onload = () => {
        setImage(image);
      };

      return () => {
        image.remove();
      };
    }
  }, [imageURL]);

  return (
    <BasicLayout title="Generator">
      <div className={styles.root}>
        <Row gutter={24} className={styles.row}>
          <Col span={24} md={12}>
            <div className={styles.image}>
              <AntdImage src={imageURL} />
            </div>
          </Col>
          <Col span={24} md={12}>
            {image && imageURL ? (
              <GeneratorForm
                className={styles.form}
                image={image}
                imageURL={imageURL}
              />
            ) : null}
          </Col>
        </Row>
      </div>
    </BasicLayout>
  );
};
