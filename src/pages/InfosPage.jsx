/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import React, { useContext, useEffect } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import { useNavigate } from 'react-router-dom';
import MarkdownText from '../components/MarkdownText';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import axios from 'axios';
import { LayoutContext } from '../contexts/LayoutContext';

const infosPageStyles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-white {
        background-color: #FFFFFF;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

function InfosPage(props) {
    const { content, showSidebar = true, showAccept = true, showNavTogglerMobile = true, showNavTogglerDesktop = true } = props;
    const navigate = useNavigate();
    const { user, logout, acceptTerms } = useContext(AuthContext);
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (user.acceptedTerms === true && showAccept === true) {
            navigate(isDashboard ? '/dash/applications' : '/applications');
        }
    }, [user.acceptedTerms, navigate, showAccept, isDashboard]);

    const handleTermsAcceptance = () => {
        axios
            .get(baseUrl + 'api/auth/acceptTerms', {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                acceptTerms();
                navigate(isDashboard ? '/dash/applications' : '/applications');
            })
            .catch((error) => {
                if ((error.response?.status ?? 401) === 401) {
                    logout();
                    navigate(isDashboard ? '/dash' : '/');
                } else {
                    acceptTerms();
                    navigate(isDashboard ? '/dash/applications' : '/applications');
                }
            });
    };

    return (
        <div className={`d-flex flex-column font-barlow vh-100`}>
            <div className="row flex-grow-1 m-0">
                <div className={`col-auto bg-coral-red ${showSidebar ? 'd-flex position-lg-sticky vh-100 top-0' : 'd-lg-none'}  p-0`}>
                    <div
                        className={`${showNavTogglerDesktop ? 'offcanvas' : 'offcanvas-lg'} offcanvas-start bg-coral-red w-auto d-flex`}
                        tabIndex="-1"
                        id="sidebar"
                    >
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="d-flex flex-column flex-grow-1">
                            <MarkdownText text={content} />
                        </div>
                        <div className="row justify-content-center pt-4 m-0">
                            <div className="col-8 col-lg-4 p-0">
                                <div className="row m-0">
                                    <div className="col-6 p-0 pe-2">
                                        <TextButton
                                            role="link"
                                            onClick={() => {
                                                logout();
                                                navigate(isDashboard ? '/dash' : '/');
                                            }}
                                            className={showAccept ? '' : 'd-none'}
                                            hsl={[37, 98, 76]}
                                            text="Voltar"
                                        />
                                    </div>
                                    <div className="col-6 p-0">
                                        <TextButton
                                            role="link"
                                            onClick={handleTermsAcceptance}
                                            className={showAccept ? '' : 'd-none'}
                                            hsl={[97, 43, 70]}
                                            text="Aceitar"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{infosPageStyles}</style>
        </div>
    );
}

export default InfosPage;
