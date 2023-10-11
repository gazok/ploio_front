//index.tsx
//랜더링 시작

import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import './index.css';
import AppRoutes from './AppRoutes';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOMClient.createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <AppRoutes />
    </React.StrictMode>
  );
} else {
  console.error("Element with ID 'root' not found.");
}
