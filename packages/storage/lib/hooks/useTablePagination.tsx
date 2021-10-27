import { Collection } from 'dexie';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppStorage } from '../AppStorage';
import { useAppStorage } from '../components';
import { useSearchParam } from './useSearchParam';

export type TablePagination<T> = {
  loading: boolean;
  total?: number;
  page: number;
  pageSize: number;
  error?: string;
  data: Array<T>;
  setPage: (page: number) => void;
  refresh: () => void;
  reset: () => void;
};

export function useTablePagination<T>(
  pageSize: number,
  query: (appStorage: AppStorage) => Collection<T, any>
): TablePagination<T> {
  const appStorage = useAppStorage();

  const [pageNumber, setPageNumber] = useSearchParam<number>('page', {
    parse: (value) => {
      if (value) {
        const page = Number.parseInt(value, 10);
        return Number.isNaN(page) || page < 1 ? 1 : page;
      } else {
        return 1;
      }
    },
    isDefaultValue: (value) => value === 1,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Array<T>>([]);

  const queryRef = useRef(query);

  useEffect(() => {
    queryRef.current = query;
  }, [query]);

  const loadData = useCallback(
    (page: number) => {
      let previousPage = page - 1;

      const action = async () => {
        setLoading(true);
        try {
          const collection = queryRef.current(appStorage);

          const total = await collection.count();
          if (page > 1 && previousPage * pageSize >= total) {
            page = Math.ceil(total / pageSize);
            setPageNumber(page);
            return;
          }

          const data = await collection
            .offset(previousPage * pageSize)
            .limit(pageSize)
            .toArray();

          setData(data);
          setTotal(total);
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
    [setPageNumber, appStorage, pageSize]
  );

  useEffect(() => {
    loadData(pageNumber);
  }, [loadData, pageNumber]);

  return {
    loading,
    total,
    page: pageNumber,
    pageSize,
    data,
    error,
    refresh: () => {
      loadData(pageNumber);
    },
    setPage: (page) => {
      setPageNumber(page);
    },
    reset: () => {
      if (pageNumber === 1) {
        loadData(pageNumber);
      } else {
        setPageNumber(1);
      }
    },
  };
}
