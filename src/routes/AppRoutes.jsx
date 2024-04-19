import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './../pages/LoginPage';
import HomePage from './../pages/HomePage';
import InfosPage from './../pages/InfosPage';
import ProfilePage from './../pages/ProfilePage';
import LogoutPage from './../pages/LogoutPage';
import SignUpPage from './../pages/SignUpPage';
import ProtocolPage from './../pages/ProtocolPage';
import CreateProtocolPage from './../pages/CreateProtocolPage';
import AnswerPage from '../pages/AnswerPage';
import { aboutPICCE, terms } from '../utils/constants';

function AppRoutes(props) {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
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
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/dash/home" element={<HomePage showNavTogglerMobile={true} showNavTogglerDesktop={false} />} />
            <Route path="/createprotocol" element={<CreateProtocolPage />} />
            <Route path="/editprotocol/:id" element={<CreateProtocolPage edit={true} />} />
            <Route path="/answer/:id" element={<AnswerPage />} />
        </Routes>
    );
}

export default AppRoutes;
