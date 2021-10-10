import { Link } from 'react-router-dom';
import styles from './Home.module.scss';
import logo from '../../assets/logo.svg';
import { AppPage } from '../../types/AppPage';
import { CREATE_SCHEMA_PATHNAME } from '../CreateSchema/constants';
import { HOME_PATHNAME } from './constants';

const Home: AppPage = () => {
  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <img src={logo} className={styles.logo} alt="logo" />
        Fancywork
      </header>
      <main className={styles.main}>
        <div className={styles.grid}>
          <div className={styles.blockContinueWork}>
            <div className={styles.text}>Continue</div>
          </div>
          <div className={styles.blockSettings}>
            <div className={styles.text}>Settings</div>
          </div>
          <div className={styles.blockMyWorks}>
            <div className={styles.text}>My works</div>
          </div>
          <div className={styles.blockMySchemas}>
            <div className={styles.text}>My schemas</div>
          </div>
          <Link to={CREATE_SCHEMA_PATHNAME}>
            <div className={styles.blockCreateSchema}>
              <div className={styles.text}>Create schema</div>
            </div>
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
Home.isExactPathname = true;

export default Home;
