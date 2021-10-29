import { PageHeader, PageHeaderProps } from 'antd';
import { FC, ReactNode } from 'react';
import styles from './index.module.scss';

export type LayoutProps = {
  headerChildren?: ReactNode;
} & Omit<PageHeaderProps, 'className'>;

export const Layout: FC<LayoutProps> = ({
  style,
  headerChildren,
  children,
  ...rest
}) => {
  return (
    <div className={styles.root} style={style}>
      <PageHeader {...rest} className={styles.header}>
        {headerChildren}
      </PageHeader>
      <main className={styles.main}>{children}</main>
    </div>
  );
};
