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
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import TextButton from '../components/TextButton';
import { LayoutContext } from '../contexts/LayoutContext';
import ProtocolList from '../components/ProtocolList';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';
import { StorageContext } from '../contexts/StorageContext';

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
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    const { clearLocalApplications } = useContext(StorageContext);
    const [visibleProtocols, setVisibleProtocols] = useState([]);

    const navigate = useNavigate();
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (user.role === 'USER') {
                setError({
                    text: 'Operação não permitida',
                    description: 'Você não tem permissão para visualizar protocolos',
                });
                return;
            }
            axios
                .get(baseUrl + `api/protocol/getVisibleProtocols`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleProtocols(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError({ text: 'Erro ao carregar protocolos', description: error.response?.data.message || '' });
                });
        }
    }, [user.token, logout, navigate, isDashboard, user.status, isLoading, user.role, user.id]);

    const deleteProtocol = (protocolId) => {
        axios
            .delete(`${baseUrl}api/protocol/deleteProtocol/${protocolId}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                clearLocalApplications();
                showAlert({ headerText: 'Protocolo excluído com sucesso.' });
                const newVisibleProtocols = [...visibleProtocols];
                setVisibleProtocols(newVisibleProtocols.filter((a) => a.id !== protocolId));
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir protocolo.', bodyText: error.response?.data.message }));
    };

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando protocolos..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100 p-0 pb-4">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow m-0">
                        <div className="col-12 col-lg-10 p-4">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">Protocolos</h1>
                        </div>
                    </div>
                    <div className="row justify-content-center font-barlow flex-grow-1 m-0 overflow-y-scroll scrollbar-none pb-4">
                        {user.role !== 'USER' && user.role !== 'APPLIER' && (
                            <div className="col-12 col-lg-10 col-xl-5 d-flex flex-column mh-100 h-lg-100 p-4 py-0">
                                <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">Meus protocolos</h1>
                                <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                    <ProtocolList
                                        listItems={visibleProtocols
                                            .filter((p) => p.creator.id === user.id)
                                            .map((p) => ({ id: p.id, title: p.title }))}
                                        hsl={[36, 98, 83]}
                                        allowEdit={true}
                                        allowDelete={true}
                                        viewFunction={(id) => navigate(`${id}`)}
                                        editFunction={(id) => navigate(`${id}/manage`)}
                                        deleteFunction={(id) => deleteProtocol(id)}
                                    />
                                </div>
                            </div>
                        )}
                        <div
                            className={`col-12 col-lg-10 col-xl-5 d-flex flex-column mh-100 h-lg-100 p-4 pb-0 pt-lg-0 ${
                                user.role !== 'USER' && user.role !== 'APPLIER' ? 'col-lg-5' : ''
                            }`}
                        >
                            <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">Protocolos disponíveis</h1>
                            <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                <ProtocolList
                                    listItems={visibleProtocols.map((p) => ({ id: p.id, title: p.title }))}
                                    hsl={[16, 100, 88]}
                                    viewFunction={(id) => navigate(`${id}`)}
                                />
                            </div>
                        </div>
                    </div>
                    {(user.role === 'PUBLISHER' || user.role === 'COORDINATOR' || user.role === 'ADMIN') && (
                        <div className="row d-flex justify-content-center pt-4 m-0">
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
                    )}
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default ProtocolsPage;
