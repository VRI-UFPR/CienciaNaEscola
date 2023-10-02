import React from 'react';
import { Routes, Route } from 'react-router-dom';

import LoginPage from './../pages/LoginPage';
import HomePage from './../pages/HomePage';
import InfosPage from './../pages/InfosPage';
import ProfilePage from './../pages/ProfilePage';
import ProtocolPage from './../pages/ProtocolPage';
import HelpPage from './../pages/HelpPage';
import LogoutPage from './../pages/LogoutPage';
import SignUpPage from './../pages/SignUpPage';
import CreateProtocolPage from './../pages/CreateProtocolPage';
import AnswerPage from '../pages/AnswerPage';
import { aboutPICCE } from '../utils/constants';

function AppRoutes(props) {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/home" element={<HomePage />} />
            <Route
                path="/terms"
                element={<InfosPage key="terms" title="Termos de uso" showAccept={false} showNavTogglerDesktop={false} />}
            />
            <Route
                path="/acceptterms"
                element={
                    <InfosPage
                        key="acceptterms"
                        title="Termos de uso"
                        showSidebar={false}
                        showAccept={true}
                        showNavTogglerMobile={false}
                        showNavTogglerDesktop={false}
                    />
                }
            />
            <Route path="/profile" element={<ProfilePage allowEdit={false} />} />
            <Route path="/protocol/:id" element={<ProtocolPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/createprotocol" element={<CreateProtocolPage />} />
            <Route path="/editprotocol/:id" element={<CreateProtocolPage edit={true} />} />

            <Route path="/about" element={<InfosPage title="Sobre o PICCE" content={aboutPICCE} showAccept={false} showNavTogglerDesktop={false} />} />
    
            <Route path="/logout" element={<LogoutPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/answer/:id" element={<AnswerPage />} />
            {/* <Route
                path="/textimage"
                element={
                    <TextImageInput
                        options={['Área de plantação', 'Jardim', 'Praça', 'Escola']}
                        image={'https://picsum.photos/380/380'}
                    />
                }
            />
            <Route
                path="/imageradio"
                element={
                    <ImageRadioButtonsInput
                        options={['Área de plantação', 'Jardim', 'Praça', 'Escola']}
                        images={[
                            'https://picsum.photos/108/148',
                            'https://picsum.photos/108/148',
                            'https://picsum.photos/108/148',
                            'https://picsum.photos/108/148',
                            'https://picsum.photos/108/148',
                        ]}
                    />
                }
            /> */}
        </Routes>
    );
}

export default AppRoutes;
