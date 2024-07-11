/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React, useRef, useContext } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import RoundedButton from '../components/RoundedButton';
import TextButton from '../components/TextButton';
import Alert from '../components/Alert';
import SplashPage from './SplashPage';
import { AuthContext } from '../contexts/AuthContext';
import BlankProfilePic from '../assets/images/blankProfile.jpg';
import adicionarFicheiro from '../assets/images/adicionar-ficheiro.png';

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

    .profile-label {
        min-width: 5em;
    }
`;

function ProfilePage(props) {
    const { user } = useContext(AuthContext);
    const { showSidebar, allowEdit } = props;
    const modalRef = useRef(null);

    if (user === null) {
        return <SplashPage />;
    }

    return (
        <>
            <div className="row flex-grow-1 font-barlow min-vh-100 m-0">
                <div className={`col-auto bg-coral-red ${showSidebar ? 'd-flex' : 'd-lg-none'} p-0`}>
                    <div className={`offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} />
                    </div>
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={!showSidebar} />
                    <div className="d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="color-dark-gray pb-4">
                            <h1 className="font-century-gothic fw-bold fs-3 pb-1 m-0">Seu perfil</h1>
                            <h5 className="fw-medium m-0">Edite e adicione informações sobre você</h5>
                        </div>
                        <div className="row bg-pastel-blue align-items-center rounded p-4 p-lg-5 m-0">
                            <div className="col-12 col-lg-3 d-flex flex-column align-items-center p-0 pb-4 pb-lg-0">
                                <div className="profile-figure ratio ratio-1x1 rounded-circle position-relative shadow-sm w-75">
                                    <img src={BlankProfilePic} className="rounded-circle h-100 w-100" alt="Foto de perfil" />
                                    <div className="position-absolute d-flex justify-content-end align-items-end">
                                        <RoundedButton
                                            hsl={[184, 9, 62]}
                                            role="link"
                                            onClick={() => modalRef.current.showModal({ title: 'Esta função estará disponível em breve.' })}
                                            icon={adicionarFicheiro}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-lg-9 d-flex flex-column justify-content-center">
                                <div className="row align-items-center m-0 mb-2">
                                    <div className="row mb-1">
                                        <label htmlFor="name-input" className="col-12 form-label profile-label fs-5 pb-0 pe-lg-5 mb-0">
                                            Nome:
                                        </label>
                                    </div>
                                    <input
                                        type="name"
                                        disabled={!allowEdit}
                                        className="col form-control rounded-4 shadow-sm fs-5"
                                        id="name-input"
                                    ></input>
                                </div>
                                <div className="row align-items-center m-0 mb-2">
                                    <div className="row mb-1">
                                        <label htmlFor="username-input" className="col-12 form-label profile-label fs-5 pb-0 pe-lg-5 mb-0">
                                            Nome de usuário:
                                        </label>
                                    </div>
                                    <input
                                        type="username"
                                        disabled={!allowEdit}
                                        className="col form-control rounded-4 shadow-sm fs-5"
                                        id="username-input"
                                    ></input>
                                </div>
                                <div className="row align-items-center m-0 mb-2">
                                    <div className="row mb-1">
                                        <label
                                            htmlFor="institution-input"
                                            className="col-12 form-label profile-label fs-5 pb-0 pe-lg-5 mb-0"
                                        >
                                            Instituição:
                                        </label>
                                    </div>
                                    <input
                                        type="institution"
                                        disabled={!allowEdit}
                                        className="col form-control rounded-4 shadow-sm fs-5"
                                        id="institution-input"
                                    ></input>
                                </div>
                                <div className="row align-items-center m-0">
                                    <div className="row mb-1">
                                        <label htmlFor="role-input" className="col-12 form-label profile-label fs-5 pb-0 pe-lg-5 mb-0">
                                            Papel:
                                        </label>
                                    </div>
                                    <input
                                        type="role"
                                        disabled={!allowEdit}
                                        className="col form-control rounded-4 shadow-sm fs-5"
                                        id="role-input"
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="row flex-grow-1 justify-center justify-content-center mx-0">
                            <div className="col-6 col-lg-4 pt-4">
                                <TextButton className={`px-5 ${allowEdit}`} hsl={[97, 43, 70]} text="Salvar" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="InfosModal" ref={modalRef} />
            <style>{profilePageStyles}</style>
        </>
    );
}

ProfilePage.defaultProps = {
    showSidebar: true,
    allowEdit: true,
};

export default ProfilePage;
