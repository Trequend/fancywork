import { WorkViewer } from '@fancywork/core';
import { useTableItem, WorkIndex } from '@fancywork/storage';
import { Result } from 'antd';
import { useHistory } from 'react-router';
import { FullscreenSpin } from 'src/components';
import { useQueryParam } from 'src/hooks';
import { AppPage } from 'src/types';
import { WORK_PATHNAME } from './constants';

export const WorkPage: AppPage = () => {
  const history = useHistory();
  const id = useQueryParam('id');
  const { item, loading, error } = useTableItem((storage) => {
    return storage.table('works').where(WorkIndex.Id).equals(id);
  });

  if (loading) {
    return <FullscreenSpin />;
  } else if (error) {
    return <Result title="Error" subTitle={error} />;
  }

  if (item) {
    return (
      <WorkViewer
        work={item}
        onBack={() => {
          history.goBack();
        }}
      />
    );
  } else {
    return <Result title="Error" subTitle="Unknown error" />;
  }
};

WorkPage.pathname = WORK_PATHNAME;
