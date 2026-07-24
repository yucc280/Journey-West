import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { AnalysisProvider } from './context/AnalysisContext';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <AnalysisProvider>
        <App />
      </AnalysisProvider>
    </HashRouter>
  </StrictMode>,
);
