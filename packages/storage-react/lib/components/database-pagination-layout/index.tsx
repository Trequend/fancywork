import { Empty, PageHeader, PageHeaderProps, Pagination, Spin } from 'antd';
import { FC, ReactNode, useEffect } from 'react';
import { useDatabasePagination } from '../../hooks';
import styles from './index.module.scss';

export type DatabasePaginationLayoutProps = {
  databasePagination: ReturnType<typeof useDatabasePagination>;
  noDataText?: string;
  extraContent?: ReactNode;
} & Omit<PageHeaderProps, 'className'>;

export const DatabasePaginationLayout: FC<DatabasePaginationLayoutProps> = ({
  children,
  style,
  databasePagination,
  noDataText,
  extraContent,
  ...props
}) => {
  const { loading, total, page, pageSize, setPage } = databasePagination;

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
          <>{extraContent}</>
          {(loading && total === undefined) || total !== 0 ? (
            <>
              <Spin
                spinning={loading}
                delay={total === undefined ? 50 : 0}
                className={styles.spin}
              >
                {children}
              </Spin>
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
            </>
          ) : (
            <div className={styles.empty}>
              <Spin spinning={loading} className={styles.emptySpin} delay={250}>
                <Empty description={noDataText} />
              </Spin>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
