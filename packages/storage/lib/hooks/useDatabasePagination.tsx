import { useDatabase } from 'lib/components';
import { Database } from 'lib/database';
import { IterableCollection } from 'lib/types';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParam } from './useSearchParam';

export type DatabasePagination<T> = {
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

export function useDatabasePagination<T>(
  pageSize: number,
  query: (database: Database) => IterableCollection<T>
): DatabasePagination<T> {
  const database = useDatabase();

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
          const collection = queryRef.current(database);

          const total = await collection.count();
          if (page > 1 && previousPage * pageSize >= total) {
            page = Math.ceil(total / pageSize);
            setPageNumber(page);
            return;
          }

          const data = await collection.range(
            previousPage * pageSize,
            pageSize
          );

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
    [setPageNumber, database, pageSize]
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
