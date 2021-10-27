import { useEffect, useState } from 'react';
import { AppStore, StoreMap } from '../AppStorage';
import { useAppStorage } from '../components';

export function useStoreItem<K extends AppStore>(storeName: K, id: string) {
  const appStorage = useAppStorage();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [item, setItem] = useState<StoreMap[K]>();

  useEffect(() => {
    const action = async () => {
      setLoading(true);
      try {
        const item = await appStorage.getById(storeName, id);
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
  }, [appStorage, storeName, id]);

  return {
    item,
    error,
    loading,
  };
}
