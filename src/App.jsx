import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';

const styles = ``;

function App(props) {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
                <style> {styles} </style>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
