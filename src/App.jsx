import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import { HashRouter } from 'react-router-dom';

const styles = ``;

function App(props) {
    return (
        <AuthProvider>
            <AppRoutes />
            <style> {styles} </style>
        </AuthProvider>
    );
}

export default App;
