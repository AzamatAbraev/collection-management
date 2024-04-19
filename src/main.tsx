import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';

import App from './App.tsx';

import './languages/i18n.ts';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.scss'
import { Helmet } from 'react-helmet';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>MyCollection | Home</title>
      </Helmet>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
)
