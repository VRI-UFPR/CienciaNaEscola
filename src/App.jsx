import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import appRoutes from './routes/AppRoutes';

const styles = ``;

function App(props) {
    return (
        <StorageProvider>
            <AuthProvider>
                <RouterProvider router={createBrowserRouter(appRoutes)} />
                <style> {styles} </style>
            </AuthProvider>
        </StorageProvider>
    );
}

export default App;
