import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import appRoutes from './routes/AppRoutes';
import { AlertProvider } from './contexts/AlertContext';
import 'react-material-symbols/rounded';

const styles = ``;

function App(props) {
    return (
        <StorageProvider>
            <AuthProvider>
                <AlertProvider>
                    <RouterProvider router={createBrowserRouter(appRoutes)} />
                    <style> {styles} </style>
                </AlertProvider>
            </AuthProvider>
        </StorageProvider>
    );
}

export default App;
