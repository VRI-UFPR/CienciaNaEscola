/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { StorageProvider } from './contexts/StorageContext';
import appRoutes from './routes/AppRoutes';
import { AlertProvider } from './contexts/AlertContext';
import ScrollToTopButton from './components/ScrollToTopButton';

const styles = `
    .user-list {
        max-height: 15vh;
        overflow-y: auto;
    }
    .user-list::-webkit-scrollbar {
        width: 10px;
    }
    .user-list::-webkit-scrollbar-track {
        background: #53535360;
        border-radius: 16px;
    }
    .user-list::-webkit-scrollbar-thumb {
        background: #53535390;
        border-radius: 16px;  /* Rounded corners for the thumb */
    }
    .user-list::-webkit-scrollbar-thumb:hover {
        background: #535353;
    }
`;

function App(props) {
    return (
        <StorageProvider>
            <AuthProvider>
                <AlertProvider>
                    <RouterProvider router={createBrowserRouter(appRoutes)} />
                    <ScrollToTopButton />
                    <style> {styles} </style>
                </AlertProvider>
            </AuthProvider>
        </StorageProvider>
    );
}

export default App;
