import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import { ThemeProvider } from './Theme';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById("rpg-note") as HTMLElement);
root.render(<React.StrictMode>
  <ThemeProvider>
    <App />
  </ThemeProvider>
</React.StrictMode>);
