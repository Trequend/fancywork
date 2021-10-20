import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { reportWebVitals } from './reportWebVitals';
import { CreateScheme, Home, Schemas } from './pages';
import { AppPage } from './types';
import './styles/global.scss';
import 'antd/dist/antd.css';
import { AppStorageProvider } from './storage/AppStorageContext';

const pages: Array<AppPage> = [Home, CreateScheme, Schemas];

ReactDOM.render(
  <AppStorageProvider>
    <BrowserRouter>
      {pages.map((page) => (
        <Route
          exact
          key={page.pathname}
          path={page.pathname}
          component={page}
        />
      ))}
    </BrowserRouter>
  </AppStorageProvider>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
