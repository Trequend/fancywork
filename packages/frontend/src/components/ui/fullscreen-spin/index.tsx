import { FC, useEffect, useState } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import styles from './index.module.scss';

type Props = {
  loading?: boolean;
  delay?: number;
};

export const FullscreenSpin: FC<Props> = ({ loading, delay }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (loading && delay) {
      let timeoutEnd = false;
      const timeout = setTimeout(() => {
        timeoutEnd = true;
        setVisible(true);
      }, delay);

      return () => {
        if (!timeoutEnd) {
          clearTimeout(timeout);
        }
      };
    } else {
      setVisible(loading ?? false);
    }
  }, [loading, delay]);

  useEffect(() => {
    if (visible) {
      const previousValue = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousValue;
      };
    }
  }, [visible]);

  if (visible) {
    return (
      <div className={styles.root}>
        <Spin indicator={<LoadingOutlined className={styles.icon} />} />
      </div>
    );
  } else {
    return null;
  }
};
