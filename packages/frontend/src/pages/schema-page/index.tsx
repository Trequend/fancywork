import { Result } from 'antd';
import { useHistory } from 'react-router';
import { SchemaViewer } from '@fancywork/core';
import { FullscreenSpin } from 'src/components';
import { useQueryParam } from 'src/hooks';
import { useStoreItem } from '@fancywork/storage';
import { AppPage } from 'src/types';
import { SCHEMA_PATHNAME } from './constants';

export const SchemaPage: AppPage = () => {
  const history = useHistory();
  const id = useQueryParam('id');
  const { item, loading, error } = useStoreItem('schemas', id);

  if (loading) {
    return <FullscreenSpin />;
  } else if (error) {
    return <Result title="Error" subTitle={error} />;
  }

  if (item) {
    return (
      <SchemaViewer
        schema={item}
        onBack={() => {
          history.goBack();
        }}
      />
    );
  } else {
    return <Result title="Error" subTitle="Unknown error" />;
  }
};

SchemaPage.pathname = SCHEMA_PATHNAME;
