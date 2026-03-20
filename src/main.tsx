import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n'

const rootEl = document.getElementById('root');

if (!rootEl) {
  throw new Error('Root element not found');
}

const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

if (rootEl.hasChildNodes()) {
  hydrateRoot(rootEl, app);
} else {
  createRoot(rootEl).render(app);
}
