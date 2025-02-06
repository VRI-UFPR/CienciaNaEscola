/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext, useState, useEffect } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import SplashPage from './SplashPage';
import { AuthContext } from '../contexts/AuthContext';
import BlankProfilePic from '../assets/images/blankProfile.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ErrorPage from './ErrorPage';

const profilePageStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }
    
    .color-dark-gray {
        color: #535353;
    }

    .profile-figure {
        max-width: 170px;
        border: 8px solid #4E9BB9;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

function ProfilePage(props) {
    const { user } = useContext(AuthContext);
    const { userId } = useParams();
    const [curUser, setCurUser] = useState();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { showSidebar = true } = props;

    const localizeUserRole = (role) => {
        switch (role) {
            case 'ADMIN':
                return 'Administrador';
            case 'USER':
                return 'Usuário';
            case 'PUBLISHER':
                return 'Publicador';
            case 'APPLIER':
                return 'Aplicador';
            case 'COORDINATOR':
                return 'Coordenador';
            default:
                return role;
        }
    };

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            const promises = [];
            promises.push(
                axios
                    .get(`${process.env.REACT_APP_API_URL}api/user/getUser/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${user.token}`,
                        },
                    })
                    .then((response) => {
                        const d = response.data.data;
                        setCurUser({
                            name: d.name,
                            username: d.username,
                            role: d.role,
                            classrooms: d.classrooms.map((c) => c.id),
                            institution: d.institution,
                            profileImage: d.profileImage,
                        });
                    })
                    .catch((error) => {
                        setError({ text: 'Erro ao carregar criação de usuário', description: error.response?.data.message || '' });
                    })
            );
            Promise.all(promises).then(() => {
                setIsLoading(false);
            });
        }
    }, [isLoading, user, userId]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando perfil..." />;
    }

    return (
        <>
            <div className="row flex-grow-1 font-barlow min-vh-100 m-0">
                <div className={`col-auto bg-coral-red ${showSidebar ? 'd-flex position-lg-sticky vh-100 top-0' : 'd-lg-none'} p-0`}>
                    <div className={`offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={!showSidebar} />
                    <div className="d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="color-dark-gray pb-4">
                            <h1 className="font-century-gothic fw-bold fs-3 pb-1 m-0">Seu perfil</h1>
                            <h5 className="fw-medium m-0">Edite e adicione informações sobre você</h5>
                        </div>
                        <div className="row bg-pastel-blue align-items-center rounded-4 p-4 p-lg-5 m-0">
                            <div className="col-12 col-lg-3 d-flex flex-column align-items-center p-0">
                                <div className="profile-figure ratio ratio-1x1 rounded-circle shadow-sm w-75">
                                    <img
                                        src={
                                            curUser.profileImage
                                                ? process.env.REACT_APP_API_URL + curUser.profileImage.path
                                                : BlankProfilePic
                                        }
                                        className="rounded-circle h-100 w-100"
                                        alt="Foto de perfil"
                                    />
                                </div>
                            </div>
                            <div className="col-12 col-lg-9 d-flex flex-column justify-content-center">
                                <div className="row align-items-center g-0 m-0 p-0 mb-2">
                                    <div className="col-12 col-lg-3">
                                        <label htmlFor="name-input" className="form-label fw-medium fs-5">
                                            Nome:
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            value={curUser.name || ''}
                                            disabled
                                            className="form-control rounded-4 shadow-sm fs-5"
                                            id="name-input"
                                        ></input>
                                    </div>
                                </div>
                                <div className="row align-items-center g-0 m-0 p-0 mb-2">
                                    <div className="col-12 col-lg-3">
                                        <label htmlFor="username-input" className="form-label fw-medium fs-5">
                                            Nome de usuário:
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            value={curUser.username || ''}
                                            disabled
                                            className="col form-control rounded-4 shadow-sm fs-5"
                                            id="username-input"
                                        ></input>
                                    </div>
                                </div>
                                <div className="row align-items-center g-0 m-0 p-0 mb-2">
                                    <div className="col-12 col-lg-3">
                                        <label htmlFor="institution-input" className="form-label fw-medium fs-5">
                                            Instituição:
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            value={curUser.institution?.name || 'Sem instituição'}
                                            disabled
                                            className="col form-control rounded-4 shadow-sm fs-5"
                                            id="institution-input"
                                        ></input>
                                    </div>
                                </div>
                                <div className="row align-items-center g-0 m-0 p-0 mb-2">
                                    <div className="col-12 col-lg-3">
                                        <label htmlFor="role-input" className="form-label fw-medium fs-5">
                                            Papel:
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            value={localizeUserRole(curUser.role) || ''}
                                            disabled
                                            className="col form-control rounded-4 shadow-sm fs-5"
                                            id="role-input"
                                        ></input>
                                    </div>
                                </div>
                                <div className="row align-items-center g-0 m-0 p-0">
                                    <div className="col-12 col-lg-3">
                                        <label htmlFor="role-input" className="form-label fw-medium fs-5">
                                            Grupos:
                                        </label>
                                    </div>
                                    <div className="col">
                                        <input
                                            type="text"
                                            value={curUser.classrooms.join(', ') || 'Sem grupos'}
                                            disabled
                                            className="col form-control rounded-4 shadow-sm fs-5"
                                            id="classrooms-input"
                                        ></input>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row flex-grow-1 justify-center justify-content-center mx-0">
                            <div className="col-6 col-lg-4 pt-4">
                                <TextButton className="px-5" hsl={[97, 43, 70]} text="Editar" onClick={() => navigate(`manage`)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{profilePageStyles}</style>
        </>
    );
}

export default ProfilePage;
