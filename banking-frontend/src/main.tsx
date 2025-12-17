import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

import { AuthProvider } from './contexts/AuthProvider';
import { LoadingProvider } from './contexts/LoadingProvider';
import { AccountProvider } from './contexts/AccountProvider';

import GlobalLoading from './components/GlobalLoading';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <LoadingProvider>
          <AccountProvider>
            <GlobalLoading />
            <App />
          </AccountProvider>
        </LoadingProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
