/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import SignInPage from '../pages/SignInPage';
import ApplicationsPage from './../pages/ApplicationsPage';
import InfosPage from './../pages/InfosPage';
import ProfilePage from './../pages/ProfilePage';
import ApplicationPage from '../pages/ApplicationPage';
import ProtocolPage from './../pages/ProtocolPage';
import CreateProtocolPage from './../pages/CreateProtocolPage';
import AnswerPage from '../pages/AnswerPage';
import { aboutPICCE, terms } from '../utils/constants';
import InstallPage from '../pages/InstallPage';
import { LayoutProvider } from '../contexts/LayoutContext';
import ProtocolsPage from '../pages/ProtocolsPage';
import InstitutionsPage from '../pages/InstitutionsPage';
import CreateInstitutionPage from '../pages/CreateInstitutionPage';
import InstitutionPage from '../pages/InstitutionPage';
import CreateApplicationPage from '../pages/CreateApplicationPage';
import CreateUserPage from '../pages/CreateUserPage';
import CreateClassroomPage from '../pages/CreateClassroomPage';

// App navigation flow
// Install page (InstallPage) -> Login (SignInPage) -> Visible applications (ApplicationsPage) -> Answer application (ApplicationPage)
//                                                  \                                          \> Applicattion statistics/details (AnswersPage)
//                                                  \                                          \> About/Developers (InfosPage)
//                                                  \> Terms of use (InfosPage)
//                                                  \> Profile (ProfilePage) ?
// Dashboard navigation flow
// Login (SignInPage) -> Created/visible applications (ApplicationsPage) -> Manage application (CreateApplicationPage)
//                    \                                                  \> Application statistics/details (AnswersPage)
//                    \> Created/visible protocols (ProtocolsPage) -> View protocol (ProtocolPage) -> Create application (CreateApplicationPage)
//                    \                                                                            \> Manage protocol (CreateProtocolPage)
//                    \                                                                            \> Protocol statistics/details (AnswersPage)
//                    \                                                                            \> Create protocol (CreateProtocolPage)
//                    \> Managed institutions (InstitutionsPage) -> View institution (InstitutionPage) -> Manage institution (CreateInstitutionPage)
//                                                                                                     \> Create institution (CreateInstitutionPage)
//                                                                                                     \> Manage user (CreateUserPage)
//                                                                                                     \> Create user (CreateUserPage)
//                                                                                                     \> Manage classroom (CreateClassroomPage)
//                                                                                                     \> Create classroom (CreateClassroomPage)
//*Manage = Edit object and children objects

const appRoutes = [
    {
        path: '/',
        element: <LayoutProvider isDashboard={false} />,
        children: [
            { path: '', element: <InstallPage /> },
            { path: 'signin', element: <SignInPage /> },
            { path: 'about', element: <InfosPage content={aboutPICCE} showAccept={false} showNavTogglerDesktop={false} /> },
            { path: 'terms', element: <InfosPage content={terms} showAccept={false} showNavTogglerDesktop={false} /> },
            { path: 'profile', element: <ProfilePage /> },
            {
                path: 'acceptTerms',
                element: <InfosPage content={terms} showNavTogglerDesktop={false} showNavTogglerMobile={false} showSidebar={false} />,
            },
            { path: 'applications', element: <ApplicationsPage /> },
            { path: 'applications/:applicationId', element: <ApplicationPage /> },
            { path: 'applications/:applicationId/answers', element: <AnswerPage /> },
        ],
    },
    {
        path: '/dash',
        element: <LayoutProvider isDashboard={true} />,
        children: [
            { path: '', element: <SignInPage /> },
            { path: 'signin', element: <SignInPage /> },
            { path: 'about', element: <InfosPage content={aboutPICCE} showAccept={false} showNavTogglerDesktop={false} /> },
            { path: 'terms', element: <InfosPage content={terms} showAccept={false} showNavTogglerDesktop={false} /> },
            { path: 'profile', element: <ProfilePage /> },
            { path: 'profile/manage', element: <CreateUserPage isEditing={true} /> },
            {
                path: 'acceptTerms',
                element: <InfosPage content={terms} showSidebar={false} showNavTogglerDesktop={false} showNavTogglerMobile={false} />,
            },
            { path: 'applications', element: <ApplicationsPage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'applications/:applicationId', element: <ApplicationPage /> },
            { path: 'applications/:applicationId/manage', element: <CreateApplicationPage isEditing={true} /> },
            { path: 'protocols', element: <ProtocolsPage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'protocols/create', element: <CreateProtocolPage /> },
            { path: 'protocols/:protocolId', element: <ProtocolPage /> },
            { path: 'protocols/:protocolId/manage', element: <CreateProtocolPage isEditing={true} /> },
            { path: 'protocols/:protocolId/apply', element: <CreateApplicationPage /> },
            { path: 'applications/:applicationId/answers', element: <AnswerPage /> },
            { path: 'institutions', element: <InstitutionsPage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'institutions/create', element: <CreateInstitutionPage /> },
            { path: 'institutions/:institutionId', element: <InstitutionPage /> },
            { path: 'institutions/:institutionId/manage', element: <CreateInstitutionPage isEditing={true} /> },
            { path: 'institutions/:institutionId/users/create', element: <CreateUserPage /> },
            { path: 'institutions/:institutionId/users/:userId/manage', element: <CreateUserPage isEditing={true} /> },
            { path: 'institutions/:institutionId/classrooms/create', element: <CreateClassroomPage /> },
            { path: 'institutions/:institutionId/classrooms/:classroomId/manage', element: <CreateClassroomPage isEditing={true} /> },
            { path: 'institutions/my', element: <InstitutionPage /> },
            { path: 'institutions/my/users/create', element: <CreateUserPage /> },
            { path: 'institutions/my/users/:userId/manage', element: <CreateUserPage isEditing={true} /> },
            { path: 'institutions/my/classrooms/create', element: <CreateClassroomPage /> },
            { path: 'institutions/my/classrooms/:classroomId/manage', element: <CreateClassroomPage isEditing={true} /> },
        ],
    },
];

export default appRoutes;
