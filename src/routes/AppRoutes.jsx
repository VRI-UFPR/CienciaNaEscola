import SignInPage from '../pages/SignInPage';
import ApplicationsPage from './../pages/ApplicationsPage';
import InfosPage from './../pages/InfosPage';
import ProfilePage from './../pages/ProfilePage';
import ApplicationPage from '../pages/ApplicationPage';
import CreateProtocolPage from './../pages/CreateProtocolPage';
import AnswerPage from '../pages/AnswerPage';
import { aboutPICCE, terms } from '../utils/constants';
import InstallPage from '../pages/InstallPage';
import { LayoutProvider } from '../contexts/LayoutContext';
import ProtocolsPage from '../pages/ProtocolsPage';
import InstitutionsPage from '../pages/InstitutionsPage';
import ProtocolPage from '../pages/ProtocolPage';
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
            { path: 'profile', element: <ProfilePage allowEdit={false} /> },
            {
                path: 'acceptTerms',
                element: <InfosPage content={terms} showNavTogglerDesktop={false} showNavTogglerMobile={false} showSidebar={false} />,
            },
            { path: 'applications', element: <ApplicationsPage /> },
            { path: 'applications/:id', element: <ApplicationPage /> },
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
            { path: 'profile', element: <ProfilePage allowEdit={false} /> },
            {
                path: 'acceptTerms',
                element: <InfosPage content={terms} showSidebar={false} showNavTogglerDesktop={false} showNavTogglerMobile={false} />,
            },
            { path: 'applications', element: <ApplicationsPage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'applications/:id', element: <ApplicationPage /> },
            { path: 'applications/:id/manage', element: <CreateApplicationPage /> },
            { path: 'protocols', element: <ProtocolsPage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'protocols/create', element: <CreateProtocolPage /> },
            { path: 'protocols/:id', element: <ProtocolPage /> },
            { path: 'protocols/:id/manage', element: <CreateProtocolPage edit={true} /> },
            { path: 'protocols/:id/apply', element: <CreateApplicationPage /> },
            { path: 'applications/:id/answers', element: <AnswerPage /> },
            { path: 'institutions', element: <InstitutionsPage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'institutions/create', element: <CreateInstitutionPage /> },
            { path: 'institutions/:id', element: <InstitutionPage /> },
            { path: 'institutions/:id/manage', element: <CreateInstitutionPage /> },
            { path: 'institutions/:id/users/create', element: <CreateUserPage /> },
            { path: 'institutions/:id/users/:id/manage', element: <CreateUserPage /> },
            { path: 'institutions/:id/classrooms/create', element: <CreateClassroomPage /> },
            { path: 'institutions/:id/classrooms/:id/manage', element: <CreateClassroomPage /> },
        ],
    },
];

export default appRoutes;
