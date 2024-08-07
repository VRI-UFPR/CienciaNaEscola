/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './../pages/LoginPage';
import HomePage from './../pages/HomePage';
import InfosPage from './../pages/InfosPage';
import ProfilePage from './../pages/ProfilePage';
import SignUpPage from './../pages/SignUpPage';
import ProtocolPage from './../pages/ProtocolPage';
import CreateProtocolPage from './../pages/CreateProtocolPage';
import AnswerPage from '../pages/AnswerPage';
import { aboutPICCE, terms } from '../utils/constants';
import InstallPage from '../pages/InstallPage';

function AppRoutes(props) {
    return (
        <Routes>
            <Route path="/" element={<InstallPage />} />
            <Route
                path="/dash"
                element={
                    <InfosPage
                        content={terms}
                        showAccept={true}
                        showNavTogglerDesktop={false}
                        showNavTogglerMobile={false}
                        showSidebar={false}
                    />
                }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dash/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/about" element={<InfosPage content={aboutPICCE} showAccept={false} showNavTogglerDesktop={false} />} />
            <Route path="/terms" element={<InfosPage content={terms} showAccept={false} showNavTogglerDesktop={false} />} />
            <Route
                path="/acceptTerms"
                element={<InfosPage content={terms} showNavTogglerDesktop={false} showNavTogglerMobile={false} showSidebar={false} />}
            />
            <Route path="/profile" element={<ProfilePage allowEdit={false} />} />
            <Route path="/protocol/:id" element={<ProtocolPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dash/home" element={<HomePage showNavTogglerMobile={true} showNavTogglerDesktop={false} />} />
            <Route path="/createprotocol" element={<CreateProtocolPage />} />
            <Route path="/editprotocol/:id" element={<CreateProtocolPage edit={true} />} />
            <Route path="/answer/:id" element={<AnswerPage />} />
        </Routes>
    );
}

export default AppRoutes;
