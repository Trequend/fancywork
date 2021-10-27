import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AppStore, StoreMap, GetRangeOptions } from '../AppStorage';
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
  pageSize: number,
  options: Omit<GetRangeOptions<K>, 'start' | 'count'>
): StorePagination<K> {
  const history = useHistory();
  const appStorage = useAppStorage();

  const [pageNumber, setPageNumber] = useState(() => {
    const params = new URLSearchParams(history.location.search);
    if (params.has('page')) {
      return Number.parseInt(params.get('page')!, 10);
    } else {
      return 1;
    }
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState<number>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<Array<StoreMap[K]>>([]);

  const { direction, index, query } = options;
  const setPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(history.location.search);
      if (page === 1) {
        params.delete('page');
      } else {
        params.set('page', page.toString());
      }

      history.replace({ search: params.toString() });
      setPageNumber(page);
    },
    [history]
  );

  const loadData = useCallback(
    (page: number) => {
      page = Number.isNaN(page) || page < 1 ? 1 : page;
      let previousPage = page - 1;

      const action = async () => {
        setLoading(true);
        try {
          const total = await appStorage.getCount(storeName);
          if (page > 1 && previousPage * pageSize >= total) {
            page = Math.ceil(total / pageSize);
            setPage(page);
            return;
          }

          const data = await appStorage.getRange(storeName, {
            start: previousPage * pageSize,
            count: pageSize,
            direction,
            index,
            query,
          });

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
    [setPage, storeName, appStorage, pageSize, direction, index, query]
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
    setPage,
  };
}
