import { Cell } from '@fancywork/core';
import { WorkViewer } from '@fancywork/core-react';
import { useDatabase, useDatabaseItem } from '@fancywork/storage-react';
import { Result } from 'antd';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { FullscreenSpin } from '../../components';
import { useQueryParam } from '../../hooks';
import { AppPage } from '../../types';
import { AUTO_SAVE_TIMEOUT, WORK_PATHNAME } from './constants';

export const WorkPage: AppPage = () => {
  const database = useDatabase();
  const history = useHistory();
  const id = useQueryParam('id');
  const {
    item: work,
    loading,
    error,
  } = useDatabaseItem((database) => {
    return database.works.get(id);
  });

  useEffect(() => {
    if (work) {
      const saved = document.title;
      document.title = `${work.metadata.name} - Fancywork`;
      return () => {
        document.title = saved;
      };
    }
  }, [work]);

  if (loading) {
    return <FullscreenSpin />;
  } else if (error) {
    return <Result title="Error" subTitle={error} />;
  }

  if (work) {
    return (
      <WorkViewer
        work={work}
        autoSaveTimeout={AUTO_SAVE_TIMEOUT}
        onBack={() => {
          history.goBack();
        }}
        onSave={async (changedCells: Set<Cell>) => {
          if (work) {
            await database.works.saveChanges(work, changedCells);
          }
        }}
      />
    );
  } else {
    return <FullscreenSpin />;
  }
};

WorkPage.pathname = WORK_PATHNAME;
