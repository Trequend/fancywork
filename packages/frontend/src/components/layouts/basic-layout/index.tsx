import { PageHeader, PageHeaderProps } from 'antd';
import { FC } from 'react';
import styles from './index.module.scss';

export type BasicLayoutProps = Omit<PageHeaderProps, 'className'>;

export const BasicLayout: FC<BasicLayoutProps> = ({
  style,
  children,
  ...rest
}) => {
  return (
    <div className={styles.root} style={style}>
      <PageHeader {...rest} className={styles.header} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
