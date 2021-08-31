import { FC } from 'react';
import styles from './Home.module.scss';
import logo from '../../assets/logo.svg';

const Home: FC = () => {
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
          <div className={styles.blockMySchemes}>
            <div className={styles.text}>My schemes</div>
          </div>
          <div className={styles.blockCreateScheme}>
            <div className={styles.text}>Create scheme</div>
          </div>
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

export default Home;
