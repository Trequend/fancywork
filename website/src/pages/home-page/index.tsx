import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import { AppPage } from '../../types';
import { CREATE_SCHEMA_PATHNAME } from '../create-schema-page/constants';
import { SCHEMAS_PATHNAME } from '../schemas-page/constants';
import { WORKS_PATHNAME } from '../works-page/constants';
import { HOME_PATHNAME } from './constants';
import { ContinueButton } from './continue-button';
import styles from './index.module.scss';

export const HomePage: AppPage = () => {
  const history = useHistory();

  return (
    <div className={styles.root}>
      <main className={styles.main}>
        <div className={styles.menu}>
          <div className={styles.header}>
            <img src={logo} className={styles.logo} alt="Logo" />
            Fancywork
          </div>
          <div className={styles.buttons}>
            <ContinueButton />
            <Button
              type="ghost"
              onClick={() => {
                history.push(CREATE_SCHEMA_PATHNAME);
              }}
            >
              Create schema
            </Button>
            <Button
              type="ghost"
              onClick={() => {
                history.push(SCHEMAS_PATHNAME);
              }}
            >
              My schemas
            </Button>
            <Button
              type="ghost"
              onClick={() => {
                history.push(WORKS_PATHNAME);
              }}
            >
              My works
            </Button>
          </div>
          <a
            href="https://github.com/Trequend/fancywork"
            rel="noreferrer"
            target="_blank"
          >
            View source code
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <div>
          Logo icon made by{' '}
          <a href="https://www.freepik.com" title="Freepik">
            Freepik
          </a>{' '}
          from{' '}
          <a href="https://www.flaticon.com/" title="Flaticon">
            www.flaticon.com
          </a>
        </div>
      </footer>
    </div>
  );
};

HomePage.pathname = HOME_PATHNAME;
