import { useDatabase } from 'lib/components';
import { Database } from 'lib/database';
import { useEffect, useRef, useState } from 'react';

export function useDatabaseItem<T>(query: (database: Database) => Promise<T>) {
  const database = useDatabase();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [item, setItem] = useState<T>();

  const queryRef = useRef(query);

  useEffect(() => {
    const action = async () => {
      setLoading(true);
      try {
        const item = await queryRef.current(database);
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
  }, [database]);

  return {
    item,
    error,
    loading,
  };
}
