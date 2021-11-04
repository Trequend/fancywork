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
  const {
    item: schema,
    loading,
    error,
  } = useDatabaseItem((database) => {
    return database.schemas.get(id);
  });

  useEffect(() => {
    if (schema) {
      const saved = document.title;
      document.title = `${schema.metadata.name} - Fancywork`;
      return () => {
        document.title = saved;
      };
    }
  }, [schema]);

  if (loading) {
    return <FullscreenSpin />;
  } else if (error) {
    return <Result title="Error" subTitle={error} />;
  }

  if (schema) {
    return (
      <SchemaViewer
        schema={schema}
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
