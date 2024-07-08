import { React, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import ProtocolCarousel from '../components/ProtocolCarousel';
import { StorageContext } from '../contexts/StorageContext';
import { LayoutContext } from '../contexts/LayoutContext';
import ProtocolList from '../components/ProtocolList';
import ErrorPage from './ErrorPage';

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

function ApplicationsPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);

    const [visibleApplications, setVisibleApplications] = useState([]);
    const { localApplications, connected } = useContext(StorageContext);

    const navigate = useNavigate();
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (!connected) {
            if (localApplications !== undefined) {
                setVisibleApplications(localApplications);
                setIsLoading(false);
            }
        } else if (isLoading && user.status !== 'loading') {
            axios
                .get(baseUrl + `api/application/getVisibleApplications`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleApplications(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError({ text: 'Erro ao carregar aplicações', description: error.response?.data.message || '' });
                });
        }
    }, [user.token, logout, navigate, connected, localApplications, isDashboard, isLoading, user.status]);

    const deleteApplication = (applicationId) => {
        axios
            .delete(`${baseUrl}api/application/deleteApplication/${applicationId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                alert('Aplicação excluída com sucesso');
                const newVisibleApplications = [...visibleApplications];
                setVisibleApplications(newVisibleApplications.filter((a) => a.id !== applicationId));
            })
            .catch((error) => {
                alert('Erro ao excluir aplicação. ' + error.response?.data.message || '');
            });
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando aplicações..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100 p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow m-0">
                        <div className="col-12 col-md-10 p-4">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">Aplicações</h1>
                        </div>
                    </div>
                    <div className="row justify-content-center font-barlow flex-grow-1 m-0 overflow-scroll scrollbar-none">
                        {isDashboard ? (
                            <>
                                <div className="col-12 col-md-10 col-lg-5 d-flex flex-column mh-100 h-lg-100 p-4 py-0 pb-lg-4">
                                    <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">Minhas aplicações</h1>
                                    <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                        <ProtocolList
                                            listItems={visibleApplications
                                                .filter((a) => a.applier.id === user.id)
                                                .map((a) => ({ id: a.id, title: a.protocol.title }))}
                                            hsl={[36, 98, 83]}
                                            allowEdit={true}
                                            allowDelete={true}
                                            viewFunction={(id) => navigate(`${id}`)}
                                            editFunction={(id) => navigate(`${id}/manage`)}
                                            deleteFunction={(id) => deleteApplication(id)}
                                        />
                                    </div>
                                </div>
                                <div className="col-12 col-md-10 col-lg-5 d-flex flex-column mh-100 h-lg-100 p-4 pt-lg-0">
                                    <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">
                                        Aplicações disponíveis
                                    </h1>
                                    <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                        <ProtocolList
                                            listItems={visibleApplications.map((a) => ({ id: a.id, title: a.protocol.title }))}
                                            hsl={[16, 100, 88]}
                                            viewFunction={(id) => navigate(`${id}`)}
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="col col-md-10 d-flex flex-column mh-100 h-lg-100 p-4 pt-0">
                                <h1 className="color-grey font-century-gothic fw-bold fs-3 pb-4 m-0">Aplicações visíveis</h1>
                                <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                    <ProtocolCarousel listItems={visibleApplications.map((a) => ({ id: a.id, title: a.protocol.title }))} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default ApplicationsPage;
