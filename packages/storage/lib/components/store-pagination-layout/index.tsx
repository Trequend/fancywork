import { Pagination, Spin, PageHeader, PageHeaderProps } from 'antd';
import { FC, useEffect } from 'react';
import { useStorePagination } from 'lib/hooks';
import styles from './index.module.scss';

export type StorePaginationLayoutProps = {
  storePagination: ReturnType<typeof useStorePagination>;
} & Omit<PageHeaderProps, 'className'>;

export const StorePaginationLayout: FC<StorePaginationLayoutProps> = ({
  children,
  style,
  storePagination,
  ...props
}) => {
  const { loading, total, page, pageSize, setPage } = storePagination;

  useEffect(() => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    });
  }, [page]);

  return (
    <div className={styles.root} style={style}>
      <PageHeader {...props} className={styles.header} />
      <main className={styles.main}>
        <div className={styles.content}>
          <Spin spinning={loading}>{children}</Spin>
          <div className={styles.pagination}>
            {total ? (
              <Pagination
                total={total}
                pageSize={pageSize}
                current={page}
                hideOnSinglePage
                onChange={(page) => {
                  setPage(page);
                }}
              />
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
};
