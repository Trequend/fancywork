import { WorkViewer } from '@fancywork/core-react';
import { useDatabase, useDatabaseItem } from '@fancywork/storage-react';
import { Result } from 'antd';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { FullscreenSpin } from 'src/components';
import { useQueryParam } from 'src/hooks';
import { AppPage } from 'src/types';
import { AUTO_SAVE_TIMEOUT, WORK_PATHNAME } from './constants';

export const WorkPage: AppPage = () => {
  const database = useDatabase();
  const history = useHistory();
  const id = useQueryParam('id');
  const { item, loading, error } = useDatabaseItem((database) => {
    return database.works.get(id);
  });

  useEffect(() => {
    if (item) {
      const saved = document.title;
      document.title = `${item.metadata.name} - Fancywork`;
      return () => {
        document.title = saved;
      };
    }
  }, [item]);

  if (loading) {
    return <FullscreenSpin />;
  } else if (error) {
    return <Result title="Error" subTitle={error} />;
  }

  if (item) {
    return (
      <WorkViewer
        work={item}
        autoSaveTimeout={AUTO_SAVE_TIMEOUT}
        onBack={() => {
          history.goBack();
        }}
        onSave={async () => {
          if (item) {
            await database.works.put(item);
          }
        }}
      />
    );
  } else {
    return <FullscreenSpin />;
  }
};

WorkPage.pathname = WORK_PATHNAME;
