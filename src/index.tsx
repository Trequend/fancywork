import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { CreateScheme, Home } from './pages';
import { AppPage } from './types/AppPage';
import './styles/global.scss';
import 'antd/dist/antd.css';

const pages: Array<AppPage> = [Home, CreateScheme];

ReactDOM.render(
  <BrowserRouter>
    {pages.map((page) => (
      <Route
        key={page.pathname}
        path={page.pathname}
        exact={page.isExactPathname}
        component={page}
      />
    ))}
  </BrowserRouter>,
  document.getElementById('root')
);

serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
