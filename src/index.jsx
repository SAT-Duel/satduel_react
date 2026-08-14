import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {AuthProvider} from "./context/AuthContext";
import {BrowserRouter } from 'react-router-dom';
import {HelmetProvider} from 'react-helmet-async';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <AuthProvider>
                    <App/>
                </AuthProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

