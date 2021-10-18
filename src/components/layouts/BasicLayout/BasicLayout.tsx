import { FC } from 'react';
import { PageHeader, PageHeaderProps } from 'antd';
import styles from './BasicLayout.module.scss';

type Props = Omit<PageHeaderProps, 'className' | 'extra'>;

export const BasicLayout: FC<Props> = ({ children, ...rest }) => {
  return (
    <div className={styles.root}>
      <PageHeader {...rest} className={styles.header} />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
