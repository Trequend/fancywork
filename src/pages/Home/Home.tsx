import { Link } from 'react-router-dom';
import { AppPage } from 'src/types';
import { CREATE_SCHEMA_PATHNAME } from '../CreateSchema/constants';
import { HOME_PATHNAME } from './constants';
import styles from './Home.module.scss';
import logo from 'src/assets/logo.svg';
import { SCHEMAS_PATHNAME } from '../Schemas/constants';

export const Home: AppPage = () => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="Logo" />
        Fancywork
      </header>
      <main className={styles.main}>
        <div className={styles.buttons}>
          <Link
            to="/#"
            onClick={(event) => {
              event.preventDefault();
            }}
            title="Continue"
            aria-disabled="true"
            className={`${styles.button} ${styles.disabled}`}
          >
            Continue
          </Link>
          <Link to="/#" title="My works" className={styles.button}>
            My works
          </Link>
          <Link
            to={SCHEMAS_PATHNAME}
            title="My schemas"
            className={styles.button}
          >
            My schemas
          </Link>
          <Link
            to={CREATE_SCHEMA_PATHNAME}
            title="Create schema"
            className={styles.button}
          >
            Create schema
          </Link>
          <Link to="/#" title="Settings" className={styles.button}>
            Settings
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

Home.pathname = HOME_PATHNAME;
