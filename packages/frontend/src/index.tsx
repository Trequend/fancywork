import '@fancywork/core/dist/main.css';
import { AppStorageProvider } from '@fancywork/storage';
import '@fancywork/storage/dist/main.css';
import 'antd/dist/antd.css';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { pages } from './pages';
import { reportWebVitals } from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './styles/global.scss';

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
