import { DatabaseProvider } from '@fancywork/storage-react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { pages } from './pages';
import { reportWebVitals } from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import 'antd/dist/antd.css';
import '@fancywork/core-react/dist/main.css';
import '@fancywork/storage-react/dist/main.css';
import './styles/global.scss';

ReactDOM.render(
  <DatabaseProvider>
    <BrowserRouter>
      <Switch>
        {pages.map((page) => (
          <Route
            exact
            key={page.pathname}
            path={page.pathname}
            component={page}
          />
        ))}
      </Switch>
    </BrowserRouter>
  </DatabaseProvider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
