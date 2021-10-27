import { Collection } from 'dexie';
import { useEffect, useRef, useState } from 'react';
import { AppStorage } from '../AppStorage';
import { useAppStorage } from '../components';

export function useTableItem<T>(
  query: (storage: AppStorage) => Collection<T, any>
) {
  const appStorage = useAppStorage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [item, setItem] = useState<T>();

  const queryRef = useRef(query);

  useEffect(() => {
    const action = async () => {
      setLoading(true);
      try {
        const item = await queryRef.current(appStorage).first();
        setItem(item);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    };

    action();
  }, [appStorage]);

  return {
    item,
    error,
    loading,
  };
}
