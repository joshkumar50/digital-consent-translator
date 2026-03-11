import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
// import './index.css'; // <-- This default stylesheet is causing the button to be invisible. We are removing it.
import './App.css';     // <-- This is our stylesheet, which has the correct blue button style.

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);