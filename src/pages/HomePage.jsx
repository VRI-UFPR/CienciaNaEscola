/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import ProtocolCarousel from '../components/ProtocolCarousel';
import Alert from '../components/Alert';
import TextButton from '../components/TextButton';
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
`;

function HomePage(props) {
    const { showSidebar, showNavTogglerMobile, showNavTogglerDesktop } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [userApplications, setUserApplications] = useState([]);
    const { user, logout } = useContext(AuthContext);
    const { localApplications, connected } = useContext(StorageContext);
    const location = useLocation();
    const navigate = useNavigate();
    const modalRef = useRef(null);

    useEffect(() => {
        if (!connected) {
            if (localApplications !== undefined) {
                setUserApplications(localApplications);
                setIsLoading(false);
            }
        } else if (user.id !== null && user.token !== null && connected) {
            axios
                .get(baseUrl + `api/application/getVisibleApplications`, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${user.token}`,
                    },
                })
                .then((response) => {
                    setUserApplications(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                    if ((error.response?.status ?? 401) === 401) {
                        logout();
                        navigate('/login');
                    }
                });
        }
    }, [user, logout, navigate, connected, localApplications]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="container-fluid d-flex flex-column flex-grow-1 p-0 m-0">
            <div className="row m-0 flex-grow-1">
                <div className={`col-auto bg-coral-red p-0 ${showSidebar ? 'd-flex' : 'd-lg-none'}`}>
                    <div
                        className={`${showNavTogglerDesktop ? 'offcanvas' : 'offcanvas-lg'} offcanvas-start bg-coral-red w-auto d-flex`}
                        tabIndex="-1"
                        id="sidebar"
                    >
                        <Sidebar modalRef={modalRef} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-white p-0">
                    <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                    <div className="row d-flex align-items-center justify-content-center font-barlow bg-white h-100 p-0 m-0">
                        <div
                            className={`col col-md-10 ${
                                location.pathname === '/home' ? 'col-lg-9' : 'col-lg-12'
                            } d-flex flex-column h-100 p-4 p-lg-5 pb-lg-4`}
                        >
                            <h1 className="color-grey font-century-gothic fw-bold fs-1 pb-4 m-0">Protocolos</h1>
                            <div
                                className={`d-flex justify-content-center flex-grow-1 ${
                                    location.pathname === '/home' ? 'pb-3' : 'pb-2'
                                } pb-lg-0 m-0`}
                            >
                                <ProtocolCarousel applications={userApplications} />
                            </div>
                        </div>
                    </div>
                    {location.pathname === '/dash/home' && (
                        <div className="row d-flex justify-content-center pb-4 p-0 m-0">
                            <div className="col col-9 col-sm-6 col-md-5 col-lg-4 d-flex flex-column m-0">
                                <TextButton
                                    text={'Criar novo protocolo'}
                                    hsl={[97, 43, 70]}
                                    onClick={() => {
                                        navigate('/createprotocol');
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Alert id="InfosPageAlert" ref={modalRef} />
            <style>{style}</style>
        </div>
    );
}

HomePage.defaultProps = {
    showSidebar: true,
    showNavTogglerMobile: true,
    showNavTogglerDesktop: true,
};

export default HomePage;
