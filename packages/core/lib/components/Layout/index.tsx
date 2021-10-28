import { PageHeader, PageHeaderProps } from 'antd';
import { FC } from 'react';
import styles from './index.module.scss';

export type LayoutProps = Omit<PageHeaderProps, 'className'>;

export const Layout: FC<LayoutProps> = ({ style, children, ...rest }) => {
  return (
    <div className={styles.root} style={style}>
      <PageHeader {...rest} className={styles.headerTest} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
