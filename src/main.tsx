import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeLangProvider } from './ThemeLangContext.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeLangProvider>
        <App />
      </ThemeLangProvider>
    </ErrorBoundary>
  </StrictMode>,
);
