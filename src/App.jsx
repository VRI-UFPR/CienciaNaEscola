import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import AppRoutes from './routes/AppRoutes';

const styles = ``;

function App(props) {
    return (
        <AuthProvider>
            <StorageProvider>
                <BrowserRouter>
                    <AppRoutes />
                    <style> {styles} </style>
                </BrowserRouter>
            </StorageProvider>
        </AuthProvider>
    );
}

export default App;
