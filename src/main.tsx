import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {lazy, Suspense} from 'react';
import App from './App.tsx';
import { ThemeLangProvider } from './ThemeLangContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const AdminDashboard = lazy(() => import('./components/AdminDashboard.tsx'));

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeLangProvider>
        <App />
      </ThemeLangProvider>
    </ErrorBoundary>
  </StrictMode>,
);

export { AdminDashboard };
