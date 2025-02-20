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
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import ErrorPage from './ErrorPage';
import TextButton from '../components/TextButton';
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

function InstitutionPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [institution, setInstitution] = useState(null);
    const { institutionId } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [searchedClassrooms, setSearchedClassrooms] = useState([]);
    const [VCSearchInput, setVCSearchInput] = useState('');
    const [VUSearchInput, setVUSearchInput] = useState('');

    useEffect(() => {
        if (user.status !== 'loading') {
            if (user.role !== 'ADMIN' && (user.role === 'USER' || (institutionId && user.institutionId !== parseInt(institutionId)))) {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para visualizar esta instituição' });
                return;
            }
            if (institutionId || user.institutionId) {
                axios
                    .get(`${process.env.REACT_APP_API_URL}api/institution/getInstitution/${institutionId || user.institutionId}`, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        setInstitution(response.data.data);
                        setSearchedUsers(response.data.data.users);
                        setSearchedClassrooms(response.data.data.classrooms);
                        setIsLoading(false);
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar a instituição', description: error.response?.data.message || '' });
                    });
            } else {
                setIsLoading(false);
            }
        }
    }, [institutionId, user.token, user.status, user.role, user.institutionId]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando instituição..." />;
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
                        <h1 className="color-grey font-century-gothic fw-bold fs-2 mb-4">Instituição</h1>
                        <div className="d-flex flex-column flex-grow-1">
                            {institution && (
                                <div>
                                    <p className="color-steel-blue fs-5 fw-medium mb-0">Nome: {institution.name}</p>
                                    <p className="color-steel-blue fs-5 fw-medium mb-0">Tipo: {institution.type}</p>
                                    <p className="color-steel-blue fs-5 fw-medium mb-3">
                                        Localização: {institution.address.city}, {institution.address.state}, {institution.address.country}
                                    </p>
                                    <div className="mb-3">
                                        <div className="row gx-2 gy-0 mb-2 align-items-center">
                                            <div className="col-12 col-sm-auto">
                                                <p className="form-label color-steel-blue fs-5 fw-medium mb-0">Usuários na instituição:</p>
                                            </div>
                                            <div className="col">
                                                <input
                                                    type="text"
                                                    name="users-search"
                                                    value={VUSearchInput || ''}
                                                    id="users-search"
                                                    placeholder="Buscar por nome de usuário"
                                                    className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                    onChange={(e) => setVUSearchInput(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <Link to={'users/create'} className="text-decoration-none">
                                                    <RoundedButton hsl={[197, 43, 52]} className="text-white" icon="person_add" />
                                                </Link>
                                            </div>
                                        </div>
                                        {searchedUsers.length > 0 && (
                                            <div className="row gy-2">
                                                {searchedUsers
                                                    .filter((u) => u.username.startsWith(VUSearchInput))
                                                    .map((u) => (
                                                        <div key={'viewer-user-' + u.id} className="col-6 col-md-4 col-xl-3">
                                                            {user.role === 'ADMIN' ||
                                                            (user.role === 'COORDINATOR' &&
                                                                u.role !== 'ADMIN' &&
                                                                u.role !== 'COORDINATOR') ||
                                                            ((user.role === 'PUBLISHER' || user.role === 'APPLIER') &&
                                                                u.role === 'USER') ? (
                                                                <Link
                                                                    to={`users/${u.id}/manage`}
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
                                                <p className="form-label color-steel-blue fs-5 fw-medium mb-0">Grupos na instituição:</p>
                                            </div>
                                            <div className="col">
                                                <input
                                                    type="text"
                                                    name="classrooms-search"
                                                    value={VCSearchInput || ''}
                                                    id="classrooms-search"
                                                    placeholder="Buscar por nome do grupo"
                                                    className="form-control form-control-sm color-grey bg-light-grey fw-medium rounded-4 border-0"
                                                    onChange={(e) => setVCSearchInput(e.target.value)}
                                                />
                                            </div>
                                            <div className="col-auto">
                                                <Link to={'classrooms/create'} className="text-decoration-none">
                                                    <RoundedButton hsl={[197, 43, 52]} className="text-white" icon="group_add" />
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="row gy-2">
                                            {searchedClassrooms
                                                .filter((c) => c.name.startsWith(VCSearchInput))
                                                .map((c) => (
                                                    <div key={'viewer-classroom-' + c.id} className="col-6 col-md-4 col-xl-3">
                                                        {user.role !== 'USER' && user.role !== 'APPLIER' ? (
                                                            <Link
                                                                to={`classrooms/${c.id}/manage`}
                                                                className="font-barlow color-grey text-break fw-medium fs-6 mb-0"
                                                            >
                                                                {c.name}
                                                            </Link>
                                                        ) : (
                                                            <p className="font-barlow color-grey text-break fw-medium fs-6 mb-0">
                                                                {c.name}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                    <div className="row d-flex justify-content-center justify-content-lg-start">
                                        {institution.actions.toUpdate && (
                                            <div className="col-5 col-sm-3 col-xl-2">
                                                <TextButton text={'Gerenciar'} hsl={[97, 43, 70]} onClick={() => navigate('manage')} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                            {!institution && (
                                <div>
                                    <p className="color-steel-blue fs-5 fw-medium mb-3">Você não está vinculado a nenhuma instituição</p>
                                    <div className="row d-flex justify-content-center-lg-start gy-3">
                                        <div className="col-12 col-md-6 col-xl-5">
                                            <TextButton
                                                text={'Criar usuário sem vínculo'}
                                                hsl={[97, 43, 70]}
                                                onClick={() => {
                                                    navigate('users/create');
                                                }}
                                            />
                                        </div>
                                        <div className="col-12 col-md-6 col-xl-5">
                                            <TextButton
                                                text={'Criar grupo sem vínculo'}
                                                hsl={[97, 43, 70]}
                                                onClick={() => navigate('classrooms/create')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CustomContainer>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default InstitutionPage;
