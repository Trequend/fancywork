import { Button, Result } from 'antd';
import { useHistory } from 'react-router-dom';
import { AppPage } from '../../types';
import styles from './index.module.scss';

export const Error404Page: AppPage = () => {
  const history = useHistory();

  return (
    <div className={styles.root}>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist"
        extra={
          <Button
            type="primary"
            onClick={() => {
              history.push('/');
            }}
          >
            Back Home
          </Button>
        }
      />
    </div>
  );
};

Error404Page.pathname = '*';
