import { React, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import Alert from '../components/Alert';
import TextButton from '../components/TextButton';
import { LayoutContext } from '../contexts/LayoutContext';
import ProtocolList from '../components/ProtocolList';

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

    .scrollbar-none::-webkit-scrollbar {
        width: 0px;
        height: 0px;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }

      .h-lg-100 {
        height: 100% !important;
      }
    }
`;

function ProtocolsPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);

    const [visibleProtocols, setVisibleProtocols] = useState([]);

    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            axios
                .get(baseUrl + `api/protocol/getAllProtocols`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleProtocols(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        logout();
                        navigate(isDashboard ? '/dash/signin' : '/signin');
                    }
                });
        }
    }, [user, logout, navigate, isDashboard]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100 p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow m-0">
                        <div className="col-12 col-md-10 p-4">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">Protocolos</h1>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center font-barlow flex-grow-1 m-0 overflow-y-scroll scrollbar-none">
                        <div className="col-12 col-md-10 col-lg-5 d-flex flex-column mh-100 h-lg-100 p-4 py-0">
                            <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">Meus protocolos</h1>
                            <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                <ProtocolList
                                    listItems={visibleProtocols
                                        .filter((p) => p.creatorId === user.id)
                                        .map((p) => ({ id: p.id, title: p.title }))}
                                    hsl={[36, 98, 83]}
                                />
                            </div>
                        </div>
                        <div className="col-12 col-md-10 col-lg-5 d-flex flex-column mh-100 h-lg-100 p-4 pb-0 pt-lg-0">
                            <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">Protocolos disponíveis</h1>
                            <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                <ProtocolList listItems={visibleProtocols.map((p) => ({ id: p.id, title: p.title }))} hsl={[6, 84, 83]} />
                            </div>
                        </div>
                    </div>
                    <div className="row d-flex justify-content-center py-4 m-0">
                        <div className="col-9 col-sm-6 col-md-5 col-lg-4 d-flex flex-column p-0 m-0">
                            <TextButton
                                text={'Criar novo protocolo'}
                                hsl={[97, 43, 70]}
                                onClick={() => {
                                    navigate('create');
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="ProtocolsPageAlert" ref={modalRef} />
            <style>{style}</style>
        </div>
    );
}

export default ProtocolsPage;
