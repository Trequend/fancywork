import { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Home } from '../pages';

const App: FC = () => {
  return (
    <>
      <Switch>
        <Route path="/" component={Home} />
      </Switch>
    </>
  );
};

export default App;
