import { useCallback, useEffect, useState } from 'react';
import { Schema } from 'src/core/types';
import { useAppStorage } from './AppStorageContext';

export function useStorePagination(pageSize: number) {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Schema[]>([]);

  const appStorage = useAppStorage();

  const setPage = useCallback(
    (page: number) => {
      page = page < 1 ? 1 : page;
      let previousPage = page - 1;

      const action = async () => {
        setLoading(true);
        try {
          const total = await appStorage.getSchemasCount();
          if (page > 1 && previousPage * pageSize >= total) {
            page = Math.floor(total / pageSize) + 1;
            previousPage = page - 1;
          }

          const data = await appStorage.getSchemas(
            pageSize,
            previousPage * pageSize
          );
          setData(data);
          setTotal(total);
          setPageNumber(page);
        } catch (error) {
          if (error instanceof Error) {
            setError(error.message);
          } else {
            setError('Error');
          }
        } finally {
          setLoading(false);
        }
      };

      action();
    },
    [appStorage, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [setPage]);

  return {
    loading,
    total,
    page: pageNumber,
    data,
    error,
    setPage,
  };
}
