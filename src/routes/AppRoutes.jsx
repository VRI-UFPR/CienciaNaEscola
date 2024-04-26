import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SignInPage from '../pages/SignInPage';
import HomePage from './../pages/HomePage';
import InfosPage from './../pages/InfosPage';
import ProfilePage from './../pages/ProfilePage';
import ApplicationPage from '../pages/ApplicationPage';
import CreateProtocolPage from './../pages/CreateProtocolPage';
import AnswerPage from '../pages/AnswerPage';
import { aboutPICCE, terms } from '../utils/constants';
import InstallPage from '../pages/InstallPage';
import SplashPage from '../pages/SplashPage';

function AppRoutes(props) {
    // App navigation flow
    // Install page -> Login -> Visible applications -> Answer application
    //                                                               -> Applicattion statistics/details
    //                                                               -> About/Developers
    //                                       -> Terms of use
    //                                       -> Profile (?)

    // Dashboard navigation flow
    // Terms of use -> Login -> Created applications -> Manage application
    //                                               -> Application statistics/details
    //                       -> Created protocols ----> Manage protocol
    //                                            ----> Protocol statistics/details
    //                                            ----> Create protocol
    //                       -> Visible protocols ----> View protocol ------------------> Create application
    //                       -> Managed institutions -> Manage institution -------------> Manage users
    //                                                                     -------------> Manage classrooms
    //                                               -> Create institution
    //

    return (
        <Routes>
            <Route path="/" element={<InstallPage />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/about" element={<InfosPage content={aboutPICCE} showAccept={false} showNavTogglerDesktop={false} />} />
            <Route path="/terms" element={<InfosPage content={terms} showAccept={false} showNavTogglerDesktop={false} />} />
            <Route path="/profile" element={<ProfilePage allowEdit={false} />} />
            <Route
                path="/acceptTerms"
                element={<InfosPage content={terms} showNavTogglerDesktop={false} showNavTogglerMobile={false} showSidebar={false} />}
            />
            <Route path="/applications" element={<HomePage />} />
            <Route path="/applications/:id" element={<ApplicationPage />} />

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
            <Route path="/dash/signin" element={<SignInPage />} />
            <Route path="/dash/about" element={<InfosPage content={aboutPICCE} showAccept={false} showNavTogglerDesktop={false} />} />
            <Route path="/dash/terms" element={<InfosPage content={terms} showAccept={false} showNavTogglerDesktop={false} />} />
            <Route path="/dash/profile" element={<ProfilePage allowEdit={false} />} />
            <Route
                path="/dash/acceptTerms"
                element={<InfosPage content={terms} showNavTogglerDesktop={false} showNavTogglerMobile={false} />}
            />
            <Route path="/dash/applications" element={<HomePage showNavTogglerMobile={true} showNavTogglerDesktop={false} />} />
            <Route path="/dash/protocols/create" element={<CreateProtocolPage />} />
            <Route path="/dash/applications/:id" element={<ApplicationPage />} />
            <Route path="/dash/applications/:id/manage" element={<SplashPage />} />
            <Route path="/dash/protocols" element={<SplashPage />} />
            <Route path="/dash/protocols/create" element={<SplashPage />} />
            <Route path="/dash/protocols/:id" element={<SplashPage />} />
            <Route path="/dash/protocols/:id/manage" element={<CreateProtocolPage edit={true} />} />
            <Route path="/dash/applications/:id/answers" element={<AnswerPage />} />
            <Route path="/dash/institutions" element={<SplashPage />} />
            <Route path="/dash/institutions/create" element={<SplashPage />} />
            <Route path="/dash/institutions/:id" element={<SplashPage />} />
            <Route path="/dash/institutions/:id/manage" element={<SplashPage />} />
        </Routes>
    );
}

export default AppRoutes;
