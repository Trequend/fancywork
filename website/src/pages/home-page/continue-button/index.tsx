import { WorkMetadata } from '@fancywork/core';
import { useDatabase } from '@fancywork/storage-react';
import { Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { WORK_PATHNAME } from '../../work-page/constants';

export const ContinueButton: FC = () => {
  const database = useDatabase();
  const history = useHistory();
  const [metadata, setMetadata] = useState<WorkMetadata>();

  useEffect(() => {
    const updateMetadata = async () => {
      const workMetadata = await database.works.getLastWorkMetadata();
      setMetadata(workMetadata);
    };

    updateMetadata();

    database.addEventListener('changes', updateMetadata);
    return () => {
      database.removeEventListener('changes', updateMetadata);
    };
  }, [database]);

  if (metadata) {
    return (
      <Button
        type="ghost"
        disabled={metadata === undefined}
        onClick={() => {
          if (metadata) {
            history.push(`${WORK_PATHNAME}?id=${metadata?.id}`);
          }
        }}
      >
        Continue
      </Button>
    );
  } else {
    return null;
  }
};
