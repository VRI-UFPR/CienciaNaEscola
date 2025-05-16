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
import TextButton from '../components/TextButton';
import { LayoutContext } from '../contexts/LayoutContext';
import ProtocolList from '../components/ProtocolList';
import ErrorPage from './ErrorPage';
import { AlertContext } from '../contexts/AlertContext';
import { StorageContext } from '../contexts/StorageContext';
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

/**
 * Página de listagem de protocolos visíveis ao usuário atual.
 * @param {Object} props - Propriedades do componente.
*/
function ProtocolsPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);
    const { showAlert } = useContext(AlertContext);

    const { clearLocalApplications } = useContext(StorageContext);
    const [visibleProtocols, setVisibleProtocols] = useState([]);
    const [managedProtocols, setManagedProtocols] = useState([]);

    const navigate = useNavigate();
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (user.role === 'USER')
                return setError({ text: 'Operação não permitida', description: 'Você não tem permissão para visualizar protocolos' });
            axios
                .get(process.env.REACT_APP_API_URL + `api/protocol/getVisibleProtocols`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleProtocols(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) =>
                    setError({ text: 'Erro ao obter informações de protocolos', description: error.response?.data.message || '' })
                );
            axios
                .get(process.env.REACT_APP_API_URL + `api/protocol/getMyProtocols`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setManagedProtocols(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) =>
                    setError({ text: 'Erro ao obter informações de protocolos', description: error.response?.data.message || '' })
                );
        }
    }, [user.token, logout, navigate, isDashboard, user.status, isLoading, user.role, user.id]);

    /**
     * Exclui um protocolo específico pelo ID.
     * @param {number|string} protocolId - ID do protocolo a ser excluído.
    */
    const deleteProtocol = (protocolId) => {
        axios
            .delete(`${process.env.REACT_APP_API_URL}api/protocol/deleteProtocol/${protocolId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            })
            .then((response) => {
                clearLocalApplications();
                showAlert({ headerText: 'Protocolo excluído com sucesso' });
                const newVisibleProtocols = [...visibleProtocols];
                setVisibleProtocols(newVisibleProtocols.filter((a) => a.id !== protocolId));
            })
            .catch((error) => showAlert({ headerText: 'Erro ao excluir protocolo', bodyText: error.response?.data.message }));
    };

    if (error) return <ErrorPage text={error.text} description={error.description} />;

    if (isLoading) return <SplashPage text="Carregando protocolos..." />;

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
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">Protocolos</h1>
                            <div className="row flex-grow-1 overflow-lg-y-hidden pb-lg-4 g-4">
                                {(user.role === 'ADMIN' || user.role === 'COORDINATOR' || user.role === 'PUBLISHER') && (
                                    <div className="col-12 col-lg d-flex flex-column m-vh-80 h-lg-100">
                                        <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 mb-4">Meus protocolos</h1>
                                        <ProtocolList
                                            listItems={managedProtocols.map((p) => ({
                                                id: p.id,
                                                title: p.title,
                                                allowEdit: p.actions.toUpdate,
                                                allowDelete: p.actions.toDelete,
                                                primaryDescription: `${p.creator?.username}`,
                                                secondaryDescription: `#${p.id} - ${new Date(p.createdAt).toLocaleDateString('pt-BR')}`,
                                            }))}
                                            hsl={[36, 98, 83]}
                                            viewFunction={(id) => navigate(`${id}`)}
                                            editFunction={(id) => navigate(`${id}/manage`)}
                                            deleteFunction={(id) => deleteProtocol(id)}
                                        />
                                    </div>
                                )}
                                <div className="col-12 col-lg d-flex flex-column m-vh-80 h-lg-100">
                                    <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 mb-4">Protocolos disponíveis</h1>
                                    <ProtocolList
                                        listItems={visibleProtocols.map((p) => ({
                                            id: p.id,
                                            title: p.title,
                                            allowEdit: p.actions.toUpdate,
                                            allowDelete: p.actions.toDelete,
                                            primaryDescription: `${p.creator?.username}`,
                                            secondaryDescription: `#${p.id} - ${new Date(p.createdAt).toLocaleDateString('pt-BR')}`,
                                        }))}
                                        hsl={[16, 100, 88]}
                                        viewFunction={(id) => navigate(`${id}`)}
                                        editFunction={(id) => navigate(`${id}/manage`)}
                                        deleteFunction={(id) => deleteProtocol(id)}
                                    />
                                </div>
                            </div>
                            {(user.role === 'PUBLISHER' || user.role === 'COORDINATOR' || user.role === 'ADMIN') && (
                                <div className="row justify-content-center justify-content-lg-start gx-2">
                                    <div className="col-10 col-sm-6 col-md-5 col-xl-4 col-xxl-3">
                                        <TextButton
                                            text={'Criar novo protocolo'}
                                            hsl={[97, 43, 70]}
                                            className="mt-4"
                                            onClick={() => navigate('create')}
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

export default ProtocolsPage;
