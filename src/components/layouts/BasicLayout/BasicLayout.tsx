import { FC } from 'react';
import { Button, PageHeader, PageHeaderProps } from 'antd';
import styles from './BasicLayout.module.scss';
import { CloseOutlined } from '@ant-design/icons';

type Props = Omit<PageHeaderProps, 'className' | 'extra'>;

export const BasicLayout: FC<Props> = ({ children, ...rest }) => {
  return (
    <div className={styles.root}>
      <PageHeader
        {...rest}
        className={styles.header}
        extra={<Button type="text" shape="circle" icon={<CloseOutlined />} />}
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
