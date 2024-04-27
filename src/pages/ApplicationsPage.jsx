import { React, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import ProtocolCarousel from '../components/ProtocolCarousel';
import Alert from '../components/Alert';
import { StorageContext } from '../contexts/StorageContext';
import { LayoutContext } from '../contexts/LayoutContext';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey {
        color: #535353;
    }
`;

function ApplicationsPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);

    const [visibleApplications, setVisibleApplications] = useState([]);
    const { localApplications, connected } = useContext(StorageContext);

    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (!connected) {
            if (localApplications !== undefined) {
                setVisibleApplications(localApplications);
                setIsLoading(false);
            }
        } else if (user.id !== null && user.token !== null && connected) {
            axios
                .get(baseUrl + `api/application/getVisibleApplications`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleApplications(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        logout();
                        navigate(isDashboard ? '/dash/signin' : '/signin');
                    }
                });
        }
    }, [user, logout, navigate, connected, localApplications, isDashboard]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="container-fluid d-flex flex-column flex-grow-1 p-0 m-0">
            <div className="row m-0 flex-grow-1">
                <div className="col-auto bg-coral-red p-0 d-flex">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row d-flex align-items-center justify-content-center font-barlow bg-white h-100 p-0 m-0">
                        <div className="col col-md-10 col-lg-10 d-flex flex-column h-100 p-4 px-lg-5 pb-lg-4">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 pb-4 m-0">Aplicações</h1>
                            <div className={`d-flex justify-content-center flex-grow-1 ${!isDashboard ? 'pb-3' : 'pb-2'} pb-lg-0 m-0`}>
                                <ProtocolCarousel listItems={visibleApplications.map((a) => ({ id: a.id, title: a.protocol.title }))} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="ApplicationsPageAlert" ref={modalRef} />
            <style>{style}</style>
        </div>
    );
}

export default ApplicationsPage;
