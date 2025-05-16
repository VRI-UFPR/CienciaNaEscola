/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useContext, useEffect } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import { useNavigate } from 'react-router-dom';
import MarkdownText from '../components/MarkdownText';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { LayoutContext } from '../contexts/LayoutContext';
import CustomContainer from '../components/CustomContainer';

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

/**
 * Página de informações e aceitação de termos.
 * @param {Object} props - Propriedades do componente.
 * @param {React.ReactNode} props.content - Conteúdo a ser exibido na página.
 * @param {boolean} props.showSidebar - Define se a sidebar deve ser exibida.
 * @param {boolean} props.showAccept - Define se o botão de aceite de termos deve ser exibido.
 * @param {boolean} props.showNavTogglerMobile - Define se o botão de navegação (mobile) deve ser exibido.
 * @param {boolean} props.showNavTogglerDesktop - Define se o botão de navegação (desktop) deve ser exibido.
 */
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

    /** Função chamada quando o usuário aceita os termos de uso. */
    const handleTermsAcceptance = () => {
        axios
            .get(process.env.REACT_APP_API_URL + 'api/auth/acceptTerms', {
                headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
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
        <div className="d-flex flex-column vh-100 overflow-hidden">
            <div className="row align-items-stretch h-100 g-0">
                <div className={`col-auto bg-coral-red ${showSidebar ? 'd-flex position-lg-sticky top-0' : 'd-lg-none'}`}>
                    <div
                        className={`${showNavTogglerDesktop ? 'offcanvas' : 'offcanvas-lg'} offcanvas-start bg-coral-red w-auto d-flex`}
                        tabIndex="-1"
                        id="sidebar"
                    >
                        <Sidebar showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100">
                    <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                    <CustomContainer className="font-barlow flex-grow-1 overflow-y-scroll p-4" df="12" md="10">
                        <div className="d-flex flex-column flex-grow-1">
                            <MarkdownText text={content} />
                        </div>
                        <div className={`row justify-content-center justify-content-lg-start gx-2 mt-4 ${showAccept ? '' : 'd-none'}`}>
                            <div className="col-5 col-sm-3 col-xl-2">
                                <TextButton
                                    role="link"
                                    onClick={() => {
                                        logout();
                                        navigate(isDashboard ? '/dash' : '/');
                                    }}
                                    hsl={[37, 98, 76]}
                                    text="Voltar"
                                />
                            </div>
                            <div className="col-5 col-sm-3 col-xl-2">
                                <TextButton role="link" onClick={handleTermsAcceptance} hsl={[97, 43, 70]} text="Aceitar" />
                            </div>
                        </div>
                    </CustomContainer>
                </div>
            </div>
            <style>{infosPageStyles}</style>
        </div>
    );
}

export default InfosPage;
