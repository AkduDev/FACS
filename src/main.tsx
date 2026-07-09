import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ThemeLangProvider } from './ThemeLangContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeLangProvider>
      <App />
    </ThemeLangProvider>
  </StrictMode>,
);
