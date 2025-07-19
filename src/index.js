import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

// Use a static version key for production/development
const APP_VERSION = '1.0.0'; // Change this for each deploy/build, or use a build hash

const lastVersion = localStorage.getItem('lastAppVersion');
if (lastVersion !== APP_VERSION) {
  localStorage.setItem('lastAppVersion', APP_VERSION);
  sessionStorage.removeItem('hasSession');
  localStorage.removeItem('token');
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
} else if (!sessionStorage.getItem('hasSession')) {
  // First visit in this tab/window
  sessionStorage.setItem('hasSession', 'true');
  localStorage.removeItem('token');
  if (window.location.pathname !== '/login') {
    window.location.replace('/login');
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <SocketProvider>
          <App />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
); 