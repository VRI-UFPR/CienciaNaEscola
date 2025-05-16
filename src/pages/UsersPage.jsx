/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext, useEffect, useState } from 'react';
import SplashPage from './SplashPage';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import ErrorPage from './ErrorPage';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
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

    .color-grey:focus {
        color: #535353;
    }

    .bg-light-grey,
    .bg-light-grey:focus,
    .bg-light-grey:active {
        background-color: #D9D9D9;
        border-color: #D9D9D9;
    }

    .bg-light-grey:focus,
    .bg-light-grey:active {
        box-shadow: inset 0px 4px 4px 0px #00000040;
    }

    .bg-light-grey:disabled{
        background-color: hsl(0,0%,85%) !important;
        border-color: hsl(0,0%,60%);
        box-shadow: none;
    }

    .color-steel-blue {
        color: #4E9BB9;
    }
`;

function UsersPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);
    const [managedUsers, setManagedUsers] = useState([]);
    const [managedClassrooms, setManagedClassrooms] = useState([]);
    const [MCSearchInput, setMCSearchInput] = useState('');
    const [MUSearchInput, setMUSearchInput] = useState('');

    useEffect(() => {
        if (user.status !== 'loading') {
            if (user.role !== 'ADMIN' && (user.role === 'USER' || user.role === 'GUEST')) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para visualizar esta página' });
                return;
            }
            const promises = [];
            promises.push(
                axios
                    .get(`${process.env.REACT_APP_API_URL}api/classroom/getManagedClassrooms`, {
                        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                    })
                    .then((response) => setManagedClassrooms(response.data.data))
                    .catch((error) => setError({ text: 'Erro ao obter informações de grupos gerenciados', description: error.message }))
            );
            promises.push(
                axios
                    .get(`${process.env.REACT_APP_API_URL}api/user/getManagedUsers`, {
                        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                    })
                    .then((response) => setManagedUsers(response.data.data))
                    .catch((error) => setError({ text: 'Erro ao obter informações de usuários gerenciados', description: error.message }))
            );

            // Finish loading
            Promise.all(promises).then(() => setIsLoading(false));
        }
    }, [user.token, user.status, user.role, user.institutionId]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando usuários e grupos..." />;
    }

    return (
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row align-items-stretch h-100 g-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky top-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <CustomContainer className="font-barlow flex-grow-1 overflow-y-scroll p-4" df="12" md="10">
                        <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">Usuários e grupos</h1>
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="mb-3">
                                <div className="row gx-2 gy-0 mb-2 align-items-center">
                                    <div className="col-12 col-sm-auto">
                                        <p className="form-label color-steel-blue fs-5 fw-medium mb-0">Usuários gerenciados:</p>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            name="users-search"
                                            value={MUSearchInput || ''}
                                            id="users-search"
                                            placeholder="Buscar por nome de usuário"
                                            className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                            onChange={(e) => setMUSearchInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-auto">
                                        <Link to={'/dash/users/create'} className="text-decoration-none">
                                            <RoundedButton hsl={[197, 43, 52]} icon="person_add" />
                                        </Link>
                                    </div>
                                </div>
                                {managedUsers.length > 0 && (
                                    <div className="row user-list gy-2">
                                        {managedUsers
                                            .filter((u) => u.username.startsWith(MUSearchInput))
                                            .sort((a, b) => a.username.localeCompare(b.username))
                                            .map((u) => (
                                                <div key={'viewer-user-' + u.id} className="col-6 col-md-4 col-xl-3">
                                                    {u.actions.toUpdate ? (
                                                        <Link
                                                            to={`/dash/users/${u.id}/manage`}
                                                            className="font-barlow color-grey text-break fw-medium fs-6 mb-0"
                                                        >
                                                            {u.username}
                                                        </Link>
                                                    ) : (
                                                        <p className="font-barlow color-grey text-break fw-medium fs-6 mb-0">
                                                            {u.username}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <div className="row gx-2 gy-0 mb-2 align-items-center">
                                    <div className="col-12 col-sm-auto">
                                        <p className="form-label color-steel-blue fs-5 fw-medium mb-0">Grupos gerenciados:</p>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            name="classrooms-search"
                                            value={MCSearchInput || ''}
                                            id="classrooms-search"
                                            placeholder="Buscar por nome do grupo"
                                            className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                            onChange={(e) => setMCSearchInput(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-auto">
                                        <Link to={'/dash/classrooms/create'} className="text-decoration-none">
                                            <RoundedButton hsl={[197, 43, 52]} icon="group_add" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="row user-list gy-2">
                                    {managedClassrooms
                                        .filter((c) => c.name.startsWith(MCSearchInput))
                                        .sort((a, b) => a.name.localeCompare(b.name))
                                        .map((c) => (
                                            <div key={'viewer-classroom-' + c.id} className="col-6 col-md-4 col-xl-3">
                                                {c.actions.toUpdate ? (
                                                    <Link
                                                        to={`/dash/classrooms/${c.id}/manage`}
                                                        className="font-barlow color-grey text-break fw-medium fs-6 mb-0"
                                                    >
                                                        {c.name}
                                                    </Link>
                                                ) : (
                                                    <p className="font-barlow color-grey text-break fw-medium fs-6 mb-0">{c.name}</p>
                                                )}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </CustomContainer>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default UsersPage;
