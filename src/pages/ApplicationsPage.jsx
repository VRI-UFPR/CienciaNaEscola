/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
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
import { AlertContext } from '../contexts/AlertContext';
import CustomContainer from '../components/CustomContainer';

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
        
    .m-vh-80 {
        max-height: 80vh;
    }

    .min-vh-70 {
        min-height: 80vh;
    }

    @media (min-width: 992px) {
        .position-lg-sticky {
            position: sticky !important;
            top: 0;
        }

        .h-lg-100 {
            height: 100% !important;
        }

        .overflow-lg-y-hidden {
            overflow-y: hidden !important;
        }
    }
`;

function ApplicationsPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);

    const [visibleApplications, setVisibleApplications] = useState([]);
    const { localApplications, connected, clearLocalApplications } = useContext(StorageContext);

    const navigate = useNavigate();
    const { isDashboard } = useContext(LayoutContext);
    const { showAlert } = useContext(AlertContext);

    useEffect(() => {
        if (!connected) {
            if (localApplications !== undefined) {
                setVisibleApplications(localApplications);
                setIsLoading(false);
            }
        } else if (isLoading && user.status !== 'loading') {
            axios
                .get(process.env.REACT_APP_API_URL + `api/application/getVisibleApplications`, {
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
            .delete(`${process.env.REACT_APP_API_URL}api/application/deleteApplication/${applicationId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                clearLocalApplications();
                showAlert({ headerText: 'Aplicação excluída com sucesso.' });
                const newVisibleApplications = [...visibleApplications];
                setVisibleApplications(newVisibleApplications.filter((a) => a.id !== applicationId));
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir aplicação.', bodyText: error.response?.data.message }));
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando aplicações..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row align-items-stretch h-100 g-0">
                <div className="col-auto d-flex bg-coral-red position-lg-sticky top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="d-flex flex-column flex-grow-1 overflow-y-auto p-4">
                        <CustomContainer
                            className="font-barlow flex-grow-1 overflow-lg-y-hidden"
                            childrenClassName="mh-100"
                            df="12"
                            md="10"
                        >
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">Aplicações</h1>
                            {isDashboard ? (
                                <div className="row flex-grow-1 overflow-lg-y-hidden pb-lg-4 g-4">
                                    {user.role !== 'USER' && user.role !== 'APPLIER' && (
                                        <div className="col-12 col-lg-6 d-flex flex-column m-vh-80 h-lg-100">
                                            <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 mb-4">
                                                Minhas aplicações
                                            </h1>
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
                                    )}
                                    <div className="col-12 col-lg-6 d-flex flex-column m-vh-80 h-lg-100">
                                        <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 mb-4">
                                            Aplicações disponíveis
                                        </h1>
                                        <ProtocolList
                                            listItems={visibleApplications.map((a) => ({
                                                id: a.id,
                                                title: a.protocol.title,
                                                allowEdit: a.actions.toUpdate,
                                                allowDelete: a.actions.toDelete,
                                            }))}
                                            hsl={[16, 100, 88]}
                                            viewFunction={(id) => navigate(`${id}`)}
                                            editFunction={(id) => navigate(`${id}/manage`)}
                                            deleteFunction={(id) => deleteApplication(id)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="row flex-grow-1 overflow-y-hidden pb-lg-4 g-4">
                                    <div className="col-12 d-flex flex-column min-vh-80 h-lg-100">
                                        <ProtocolCarousel
                                            listItems={visibleApplications.map((a) => ({ id: a.id, title: a.protocol.title }))}
                                        />
                                    </div>
                                </div>
                            )}
                        </CustomContainer>
                    </div>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default ApplicationsPage;
