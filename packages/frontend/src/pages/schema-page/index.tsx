import { SchemaViewer } from '@fancywork/core';
import { SchemaIndex, useTableItem } from '@fancywork/storage';
import { Result } from 'antd';
import { useHistory } from 'react-router';
import { FullscreenSpin } from 'src/components';
import { useQueryParam } from 'src/hooks';
import { AppPage } from 'src/types';
import { SCHEMA_PATHNAME } from './constants';

export const SchemaPage: AppPage = () => {
  const history = useHistory();
  const id = useQueryParam('id');
  const { item, loading, error } = useTableItem((storage) => {
    return storage.table('schemas').where(SchemaIndex.Id).equals(id);
  });

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
