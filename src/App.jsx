import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import AppRoutes from './routes/AppRoutes';

const styles = ``;

function App(props) {
    return (
        <StorageProvider>
            <AuthProvider>
                <AppRoutes />
                <style> {styles} </style>
            </AuthProvider>
        </StorageProvider>
    );
}

export default App;
