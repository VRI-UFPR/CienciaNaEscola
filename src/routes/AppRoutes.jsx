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
import { LayoutProvider } from '../contexts/LayoutContext';

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
            { path: 'applications', element: <HomePage /> },
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
                element: <InfosPage content={terms} showNavTogglerDesktop={false} showNavTogglerMobile={false} />,
            },
            { path: 'applications', element: <HomePage showNavTogglerMobile={true} showNavTogglerDesktop={false} /> },
            { path: 'protocols/create', element: <CreateProtocolPage /> },
            { path: 'applications/:id', element: <ApplicationPage /> },
            { path: 'applications/:id/manage', element: <SplashPage /> },
            { path: 'protocols', element: <SplashPage /> },
            { path: 'protocols/create', element: <SplashPage /> },
            { path: 'protocols/:id', element: <SplashPage /> },
            { path: 'protocols/:id/manage', element: <CreateProtocolPage edit={true} /> },
            { path: 'applications/:id/answers', element: <AnswerPage /> },
            { path: 'institutions', element: <SplashPage /> },
            { path: 'institutions/create', element: <SplashPage /> },
            { path: 'institutions/:id', element: <SplashPage /> },
            { path: 'institutions/:id/manage', element: <SplashPage /> },
        ],
    },
];

export default appRoutes;
