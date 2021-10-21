import { Result } from 'antd';
import { useHistory } from 'react-router';
import { WorkViewer } from 'src/components/schema';
import { FullscreenSpin } from 'src/components/ui/FullscreenSpin';
import { useQueryParam } from 'src/hooks/useQueryParam';
import { useStoreItem } from 'src/storage/useStoreItem';
import { AppPage } from 'src/types';
import { WORK_PATHNAME } from './constants';

export const WorkPage: AppPage = () => {
  const history = useHistory();
  const id = useQueryParam('id');
  const { item, loading, error } = useStoreItem('works', id);

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
