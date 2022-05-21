import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import BasicConnection from './components/BasicConnection';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BasicConnection />
  </React.StrictMode>
);
