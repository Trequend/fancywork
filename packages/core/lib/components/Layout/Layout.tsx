import { FC } from 'react';
import { PageHeader, PageHeaderProps } from 'antd';
import styles from './Layout.module.scss';

export type LayoutProps = Omit<PageHeaderProps, 'className'>;

export const Layout: FC<LayoutProps> = ({ style, children, ...rest }) => {
  return (
    <div className={styles.root} style={style}>
      <PageHeader {...rest} className={styles.header} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
