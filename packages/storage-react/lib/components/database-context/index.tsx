import { Database } from '@fancywork/storage';
import React, { FC, useContext, useEffect, useState } from 'react';

const DatabaseContext = React.createContext<Database | undefined>(undefined);

export function useDatabase() {
  const database = useContext(DatabaseContext);

  if (database === undefined) {
    throw new Error('No app storage provider');
  } else {
    return database;
  }
}

export const DatabaseProvider: FC = ({ children }) => {
  const [database, setDatabase] = useState<Database>();

  useEffect(() => {
    let isDestroyed = false;
    let close = () => {
      isDestroyed = true;
    };

    const action = async () => {
      const result = await Database.open();
      if (isDestroyed) {
        result.close();
      } else {
        setDatabase(result.database);
        close = result.close;
      }
    };

    action();

    return () => {
      close();
    };
  }, []);

  if (database) {
    return (
      <DatabaseContext.Provider value={database}>
        {children}
      </DatabaseContext.Provider>
    );
  } else {
    return null;
  }
};
