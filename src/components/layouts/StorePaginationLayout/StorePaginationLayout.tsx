import { Pagination, Spin } from 'antd';
import { FC, useEffect } from 'react';
import { useStorePagination } from 'src/storage/useStorePagination';
import { BasicLayout, BasicLayoutProps } from '../BasicLayout';
import styles from './StorePaginationLayout.module.scss';

export type StorePaginationLayoutProps = {
  storePagination: ReturnType<typeof useStorePagination>;
} & BasicLayoutProps;

export const StorePaginationLayout: FC<StorePaginationLayoutProps> = ({
  children,
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
    <BasicLayout {...props}>
      <div className={styles.root}>
        <Spin spinning={loading} delay={500}>
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
      </div>
    </BasicLayout>
  );
};
