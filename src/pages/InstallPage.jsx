/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useEffect } from 'react';
import picceTitle from '../assets/images/picceTitle.svg';
import Background from '../assets/images/loginPageBackground.png';
import BackgroundWeb from '../assets/images/loginPageBackgroundWeb.png';
import { useNavigate } from 'react-router-dom';
import TextButton from '../components/TextButton';
import logoFA from '../assets/images/logoFA.png';
import logoUFPR from '../assets/images/logoUFPR.svg';
import HomeQRCode from '../assets/images/HomeQRCode.png';
import SafariShareIcon from '../assets/images/SafariShareIcon.png';
import SafariPlusIcon from '../assets/images/SafariPlusIcon.png';
import SafariAddToHome from '../assets/images/SafariAddToHome.png';

const styles = `

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    ::placeholder {
        color: #FFFFFF;
        font-weight: 400;
        font-size: 90%;
        opacity: 1;
    }

    .background-style {
        background-size: cover;
        background-image: url(${Background});
    }

    @media (min-width: 768px) {
        .background-style{
            background-image: url(${BackgroundWeb});
        }
    }

    .spinner-splash{
        width: 45px;
        height: 45px;
    }

    .mw-150{
        max-width: 150px;
    }

    .mw-115{
        max-width: 115px;
    }

    .mw-270{
        max-width: 270px;
    }

    .mw-400{
        max-width: 400px;
    }
`;

function InstallPage(props) {
    const navigate = useNavigate();
    const isAndroid = /android/i.test(navigator.userAgent || navigator.vendor || window.opera);
    const isIos = /iphone|ipod|ipad/i.test(navigator.userAgent || navigator.vendor || window.opera);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    const [isIOSInstructions, setIsIOSInstructions] = useState(false);

    const [installPrompt, setInstallPrompt] = useState(null);

    useEffect(() => {
        if ((isAndroid || isIos) && isStandalone) {
            navigate('/signin');
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPrompt(e);
        });

        // Remove the event listener when the component is unmounted
        return () => {
            window.removeEventListener('beforeinstallprompt', (e) => {
                e.preventDefault();
                setInstallPrompt(e);
            });
        };
    }, [navigate, isAndroid, isIos, isStandalone]);

    const installApp = () => {
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult) => {
            setInstallPrompt(null);
        });
    };

    return (
        <div className="background-style font-century-gothic overflow-y-scroll vh-100">
            <div className="container d-flex flex-column h-100">
                <div className="row justify-content-center align-items-center flex-grow-1 w-100 g-0 py-5">
                    <div className="col-9 col-lg-8">
                        <div className="d-flex flex-column text-center align-items-center">
                            <img src={picceTitle} alt="PICCE" className="mw-270 mb-2 mb-sm-3" />
                            <span className="text-center fw-medium lh-sm fs-5 mb-4 mb-sm-5">Bem-vindo(a) ao Ciência Cidadã na Escola!</span>
                            {isAndroid && installPrompt && !isIOSInstructions && (
                                <div className="d-flex flex-column align-items-center w-100">
                                    <p className="text-center fw-medium lh-sm fs-6 mb-4 mb-sm-5">
                                        As funcionalidades do app só estão disponíveis após a instalação. Clique no botão abaixo para
                                        instalar ou siga para dashboard.
                                    </p>
                                    <div className="row justify-content-center g-0 w-100 mb-2 mb-sm-3">
                                        <div className="col-12 col-lg-8">
                                            <TextButton
                                                hsl={[97, 43, 70]}
                                                text="Instalar app"
                                                className="rounded-pill"
                                                type="button"
                                                onClick={installApp}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {isAndroid && !installPrompt && !isIOSInstructions && (
                                <div className="d-flex flex-column align-items-center w-100">
                                    <p className="text-center fw-medium lh-sm fs-6 mb-4">
                                        As funcionalidades do app só estão disponíveis após a instalação. Aguarde para instalar ou siga para
                                        dashboard.
                                    </p>
                                    <div className="spinner-border text-secondary spinner-splash mb-4 mb-sm-5" role="status">
                                        <span className="sr-only"></span>
                                    </div>
                                    <div className="row justify-content-center g-0 w-100 mb-2 mb-sm-3">
                                        <div className="col-12 col-lg-8">
                                            <TextButton
                                                hsl={[97, 43, 70]}
                                                text="Instruções para IOS"
                                                className="rounded-pill"
                                                type="button"
                                                onClick={() => {
                                                    setIsIOSInstructions(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {(isIos || isIOSInstructions) && (
                                <div className="d-flex flex-column align-items-center w-100">
                                    <p className="text-center fw-medium lh-sm fs-6">
                                        As funcionalidades do app só estão disponíveis após a instalação. Instale conforme as instruções
                                        abaixo ou siga para a dashboard.
                                    </p>
                                    <p className="text-center lh-sm fs-6">
                                        Enquanto visualiza o site, toque em
                                        <img className="mx-2" src={SafariShareIcon} alt="botão Compartilhar" style={{ width: '1em' }} />
                                        na barra de menus.
                                    </p>
                                    <p className="text-center lh-sm fs-6">
                                        Role para baixo a lista de opções e toque em “Adicionar à Tela de Início”.
                                    </p>
                                    <img className="mw-400 w-100 mb-3" src={SafariAddToHome} alt="Adicionar à Tela de Início" />
                                    <p className="text-center lh-sm fs-6 mb-4 mb-sm-5">
                                        Caso não veja a opção, role até a parte inferior da lista, toque em "Editar Ações" e toque em
                                        <img className="mx-2" src={SafariPlusIcon} alt="" style={{ height: '1em' }} />
                                        “Adicionar à Tela de Início”.
                                    </p>
                                </div>
                            )}
                            {!isAndroid && !isIos && (
                                <div className="d-flex flex-column align-items-center w-100">
                                    <p className="text-center fw-medium lh-sm fs-6 mb-4">
                                        As funcionalidades do app só estão disponíveis após a instalação em um dispositivo móvel. Escaneie o
                                        QR Code abaixo para acessar o app em seu celular ou siga para a dashboard.
                                    </p>
                                    <img src={HomeQRCode} alt="QR Code para download do aplicativo" className="mb-4 mb-sm-5 mw-150" />
                                </div>
                            )}
                            <div className="row justify-content-center g-0 w-100">
                                <div className="col-12 col-lg-8">
                                    <TextButton
                                        hsl={[97, 43, 70]}
                                        text="Ir para a dashboard"
                                        className="rounded-pill"
                                        type="button"
                                        onClick={() => {
                                            navigate('/dash');
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-between g-0 w-100 pb-3 px-3">
                    <div className="col-3 justify-content-start d-flex align-items-center">
                        <img className="h-auto mw-115 w-100" src={logoUFPR} alt="Logomarca da Universidade Federal do Paraná" />
                    </div>
                    <div className="col-4 justify-content-end d-flex align-items-center">
                        <img className="h-auto mw-150 w-100" src={logoFA} alt="Logomarca da Fundação Araucária" />
                    </div>
                </div>
            </div>
            <style> {styles}</style>
        </div>
    );
}

export default InstallPage;
