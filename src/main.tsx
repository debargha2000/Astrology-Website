import { QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App';
import NavigationSync from './components/NavigationSync';
import { usePWA, useServiceWorker, useAnalytics } from './hooks';
import { queryClient } from './lib/queryClient';
import './index.css';

function AppWrapper() {
  // Initialize PWA
  usePWA();
  useServiceWorker();

  // Initialize Analytics
  useAnalytics();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <NavigationSync />
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
