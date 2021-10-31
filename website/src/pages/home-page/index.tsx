import { Link } from 'react-router-dom';
import logo from 'src/assets/logo.svg';
import { AppPage } from 'src/types';
import { CREATE_SCHEMA_PATHNAME } from '../create-schema-page/constants';
import { SCHEMAS_PATHNAME } from '../schemas-page/constants';
import { WORKS_PATHNAME } from '../works-page/constants';
import { HOME_PATHNAME } from './constants';
import styles from './index.module.scss';

export const HomePage: AppPage = () => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="Logo" />
        Fancywork
      </header>
      <main className={styles.main}>
        <div className={styles.buttons}>
          <Link
            to={CREATE_SCHEMA_PATHNAME}
            title="Create schema"
            className={styles.button}
          >
            Create schema
          </Link>
          <Link
            to={SCHEMAS_PATHNAME}
            title="My schemas"
            className={styles.button}
          >
            My schemas
          </Link>
          <Link to={WORKS_PATHNAME} title="My works" className={styles.button}>
            My works
          </Link>
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
