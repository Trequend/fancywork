import { useCallback, useEffect, useState } from 'react';
import { AppStore, StoreMap } from '../AppStorage';
import { useAppStorage } from '../components';

export type StorePagination<K extends AppStore> = {
  loading: boolean;
  total?: number;
  page: number;
  pageSize: number;
  error?: string;
  data: Array<StoreMap[K]>;
  setPage: (page: number) => void;
  refresh: () => void;
};

export function useStorePagination<K extends AppStore>(
  storeName: K,
  pageSize: number
): StorePagination<K> {
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Array<StoreMap[K]>>([]);

  const appStorage = useAppStorage();

  const setPage = useCallback(
    (page: number) => {
      page = page < 1 ? 1 : page;
      let previousPage = page - 1;

      const action = async () => {
        setLoading(true);
        try {
          const total = await appStorage.getCount(storeName);
          if (page > 1 && previousPage * pageSize >= total) {
            page = Math.ceil(total / pageSize);
            previousPage = page - 1;
          }

          const data = await appStorage.getRange(
            storeName,
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
    [storeName, appStorage, pageSize]
  );

  useEffect(() => {
    setPage(1);
  }, [setPage]);

  return {
    loading,
    total,
    page: pageNumber,
    pageSize,
    data,
    error,
    refresh: () => {
      setPage(pageNumber);
    },
    setPage,
  };
}
