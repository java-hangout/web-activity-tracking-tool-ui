// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18+
import './index.css'; // Global styles
import App from './App';
import AuthProvider from './context/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create root for React 18
root.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>
);
