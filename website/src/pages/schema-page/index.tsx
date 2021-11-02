import { SchemaViewer } from '@fancywork/core-react';
import { useDatabaseItem } from '@fancywork/storage-react';
import { Result } from 'antd';
import { useEffect } from 'react';
import { useHistory } from 'react-router';
import { FullscreenSpin } from '../../components';
import { useQueryParam } from '../../hooks';
import { AppPage } from '../../types';
import { SCHEMA_PATHNAME } from './constants';

export const SchemaPage: AppPage = () => {
  const history = useHistory();
  const id = useQueryParam('id');
  const { item, loading, error } = useDatabaseItem((database) => {
    return database.schemas.get(id);
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
      <SchemaViewer
        schema={item}
        onBack={() => {
          history.goBack();
        }}
      />
    );
  } else {
    return <FullscreenSpin />;
  }
};

SchemaPage.pathname = SCHEMA_PATHNAME;
