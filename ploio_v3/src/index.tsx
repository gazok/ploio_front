import React from 'react';
import * as ReactDOM from 'react-dom';
import './css/index.css';
//import Router from './tsx/Router'
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import AppRoutes from './tsx/AppRoutes.tsx';

ReactDOM.render(
  <React.StrictMode>
    <FluentProvider theme={webLightTheme}>
      <div className="app">
        <AppRoutes />
      </div>
    </FluentProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
