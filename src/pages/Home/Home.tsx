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
        <img src={logo} className={styles.logo} alt="logo" />
        Fancywork
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>
          <a href="/#" className={styles.blockContinueWork}>
            <div className={styles.text}>Continue</div>
          </a>
          <a href="/#" className={styles.blockSettings}>
            <div className={styles.text}>Settings</div>
          </a>
          <a href="/#" className={styles.blockMyWorks}>
            <div className={styles.text}>My works</div>
          </a>
          <Link to={SCHEMAS_PATHNAME} className={styles.blockMySchemas}>
            <div className={styles.text}>My schemas</div>
          </Link>
          <Link
            to={CREATE_SCHEMA_PATHNAME}
            className={styles.blockCreateSchema}
          >
            <div className={styles.text}>Create schema</div>
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
