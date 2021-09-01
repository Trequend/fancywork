import { FC } from 'react';
import { IoMdArrowBack } from 'react-icons/io';
import { Link, useHistory } from 'react-router-dom';
import { IconType } from 'react-icons/lib';
import styles from './BasicLayout.module.scss';
import logo from '../../../assets/logo.svg';
import { Button, IconButton } from '../../ui/button';

interface Action {
  name: string;
  invoke: () => void;
  Icon: IconType;
}

interface Props {
  title: string;
  buttonVariant?: 'back' | 'home';
  action?: Action;
}

const BasicLayout: FC<Props> = ({ buttonVariant, title, action, children }) => {
  const history = useHistory();

  return (
    <div className={styles.root}>
      <header className={styles.header}>
        <div className={styles.headerLookup}>
          {buttonVariant === 'home' ? (
            <Link to="/">
              <img src={logo} alt="home" className={styles.headerHomeButton} />
            </Link>
          ) : (
            <button
              className={styles.headerBackButton}
              type="button"
              onClick={history.goBack}
            >
              <IoMdArrowBack className={styles.headerBackButtonIcon} />
            </button>
          )}
          <h1 className={styles.headerTitle}>{title}</h1>
        </div>
        {action ? (
          <Button
            className={styles.actionButton}
            text={action.name}
            onClick={action.invoke}
          />
        ) : null}
      </header>
      <main className={styles.main}>{children}</main>
      {action ? (
        <IconButton
          Icon={action.Icon}
          className={styles.balloon}
          onClick={action.invoke}
        />
      ) : null}
    </div>
  );
};

BasicLayout.defaultProps = {
  buttonVariant: 'back',
} as Partial<Props>;

export default BasicLayout;
