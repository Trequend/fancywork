import { FC } from 'react';
import { PageHeader } from 'antd';
import { useHistory } from 'react-router-dom';
import styles from './BasicLayout.module.scss';

interface Props {
  title: string;
  subTitle?: string;
}

const BasicLayout: FC<Props> = ({ title, subTitle, children }) => {
  const history = useHistory();

  return (
    <div className={styles.root}>
      <PageHeader
        className={styles.header}
        title={title}
        subTitle={subTitle}
        onBack={() => history.goBack()}
      />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

BasicLayout.defaultProps = {} as Partial<Props>;

export default BasicLayout;
