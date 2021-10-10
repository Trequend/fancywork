import { FC, useEffect, useState } from 'react';
import { Image, ImageProps } from 'antd';

type Props = {
  image: File;
  imageProps?: Omit<ImageProps, 'src'>;
};

export const PreviewFileImage: FC<Props> = ({ image, imageProps }) => {
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    const url = URL.createObjectURL(image);
    setSrc(url);

    return () => {
      setSrc(undefined);
      URL.revokeObjectURL(url);
    };
  }, [image]);

  /* eslint-disable-next-line */
  return <Image {...imageProps} src={src} />;
};

PreviewFileImage.defaultProps = {} as Partial<Props>;
