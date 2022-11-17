import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { LanguageProvider } from './Language';
import { ThemeProvider } from './Theme';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById("rpg-note") as HTMLElement);
root.render(<React.StrictMode>
  <LanguageProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </LanguageProvider>
</React.StrictMode>);
