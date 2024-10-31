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
import baseUrl from '../contexts/RouteContext';
import { AuthContext } from '../contexts/AuthContext';
import ErrorPage from './ErrorPage';
import TextButton from '../components/TextButton';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';

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

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .bg-light-grey:focus{
        background-color: #D9D9D9;
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
                    .get(`${baseUrl}api/institution/getInstitution/${institutionId || user.institutionId}`, {
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
                        <div className="col-12 col-md-10 p-4">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">Instituição</h1>
                        </div>
                    </div>
                    <div className="row justify-content-center font-barlow flex-grow-1 m-0 overflow-y-scroll scrollbar-none pb-4">
                        {institution && (
                            <div className="col col-md-10 d-flex flex-column h-100 px-4">
                                <p className="color-steel-blue fs-5 fw-medium mb-0">Nome: {institution.name}</p>
                                <p className="color-steel-blue fs-5 fw-medium mb-0">Tipo: {institution.type}</p>
                                <p className="color-steel-blue fs-5 fw-medium mb-3">
                                    Localização: {institution.address.city}, {institution.address.state}, {institution.address.country}
                                </p>
                                <div className="mb-3">
                                    <div className="row gx-2 gy-0 mb-2">
                                        <div className="col-12 col-md-auto">
                                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">Usuários na instituição:</p>
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
                                            <Link to={'users/create'}>
                                                <RoundedButton hsl={[197, 43, 52]} icon="add" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row gy-2 mb-3">
                                        {searchedUsers
                                            .filter((u) => u.username.startsWith(VUSearchInput))
                                            .map((u) => (
                                                <div key={'viewer-user-' + u.id} className="col-6 col-md-4 col-lg-3">
                                                    {user.role === 'ADMIN' ? (
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
                                </div>
                                <div className="mb-3">
                                    <div className="row gx-2 gy-0 mb-2">
                                        <div className="col-12 col-md-auto">
                                            <p className="form-label color-steel-blue fs-5 fw-medium mb-2">Grupos na instituição:</p>
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
                                            <Link to={'classrooms/create'}>
                                                <RoundedButton hsl={[197, 43, 52]} icon="add" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div className="row gy-2 mb-3">
                                        {searchedClassrooms
                                            .filter((c) => c.name.startsWith(VCSearchInput))
                                            .map((c) => (
                                                <div key={'viewer-classroom-' + c.id} className="col-6 col-md-4 col-lg-3">
                                                    {user.role !== 'USER' && user.role !== 'APPLIER' ? (
                                                        <Link
                                                            to={`classrooms/${c.id}/manage`}
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
                        )}
                        {!institution && (
                            <div className="col col-md-10 d-flex flex-column h-100 px-4">
                                <p className="color-steel-blue fs-5 fw-medium mb-3">Você não está vinculado a nenhuma instituição</p>
                                <div className="row d-flex justify-content-center justify-content-md-start gy-3">
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
                                            onClick={() => {
                                                navigate('classrooms/create');
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="row justify-content-center font-barlow gx-0">
                        <div className="col col-md-10 d-flex flex-column h-100 px-4">
                            <div className="row d-flex justify-content-center justify-content-md-start">
                                {institution && (user.role === 'ADMIN' || user.role === 'COORDINATOR') && (
                                    <div className="col-5 col-sm-3 col-xl-2">
                                        <TextButton
                                            text={'Gerenciar'}
                                            hsl={[97, 43, 70]}
                                            onClick={() => {
                                                navigate('manage');
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default InstitutionPage;
