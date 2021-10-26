import React, { FC, useContext, useEffect, useState } from 'react';
import { AppStorage } from '../../AppStorage';

const AppStorageContext = React.createContext<AppStorage | undefined>(
  undefined
);

export function useAppStorage() {
  const appStorage = useContext(AppStorageContext);

  if (appStorage === undefined) {
    throw new Error('No app storage provider');
  } else {
    return appStorage;
  }
}

export const AppStorageProvider: FC = ({ children }) => {
  const [appStorage, setAppStorage] = useState<AppStorage>();

  useEffect(() => {
    let isDestroyed = false;
    let close = () => {
      isDestroyed = true;
    };

    const action = async () => {
      const result = await AppStorage.open();
      if (isDestroyed) {
        result.closeStorage();
      } else {
        setAppStorage(result.appStorage);
        close = result.closeStorage;
      }
    };

    action();

    return () => {
      close();
    };
  }, []);

  if (appStorage) {
    return (
      <AppStorageContext.Provider value={appStorage}>
        {children}
      </AppStorageContext.Provider>
    );
  } else {
    return null;
  }
};
