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
import picceTitle from '../assets/images/picceTitle.svg';
import axios from 'axios';
import Background from '../assets/images/loginPageBackground.png';
import BackgroundWeb from '../assets/images/loginPageBackgroundWeb.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import TextButton from '../components/TextButton';
import logoFA from '../assets/images/logoFA.png';
import logoUFPR from '../assets/images/logoUFPR.svg';
import { serialize } from 'object-to-formdata';
import { LayoutContext } from '../contexts/LayoutContext';
import { AlertContext } from '../contexts/AlertContext';

const styles = `

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .login-input,
    .login-input:focus,
    .login-input:active {
        color: #FFFFFF !important;
        background-color: #4E9BB9 !important;
        border: 1px solid #4E9BB9 !important;
    }

    .login-input:focus,
    .login-input:active {
        box-shadow: inset 0px 4px 4px 0px #00000040 !important;
    }

    ::placeholder {
        color: #FFFFFF;
        font-weight: 400;
        font-size: 90%;
        opacity: 1;
    }

    .login-links {
        color: #91CAD6;
    }

    .login-links:hover {
        cursor: pointer;
    }

    .button-position {
        z-index: 1;
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

    .mw-200{
        max-width: 200px;
    }

    .mw-115{
        max-width: 115px;
    }

    .mw-150{
        max-width: 150px;
    }

    .mw-270{
        max-width: 270px;
    }
`;

function SignInPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const { showAlert } = useContext(AlertContext);
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (user.status === 'authenticated') {
            navigate(isDashboard ? '/dash/applications' : '/applications');
        }
    }, [navigate, isDashboard, user]);

    const loginHandler = (event) => {
        event.preventDefault();
        const formData = serialize({
            username,
            hash: password,
        });
        axios
            .post(baseUrl + 'api/auth/signIn', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                if (response.data.data.token) {
                    login(
                        response.data.data.id,
                        username,
                        response.data.data.role,
                        response.data.data.token,
                        new Date(new Date().getTime() + response.data.data.expiresIn),
                        response.data.data.acceptedTerms,
                        response.data.data.institutionId,
                        response.data.data.profileImage?.path
                    );
                    navigate(isDashboard ? '/dash/acceptTerms' : '/acceptTerms');
                } else {
                    throw new Error('Authentication failed!');
                }
            })
            .catch((error) => {
                showAlert({ title: 'Falha de autenticação. Certifique-se que login e senha estão corretos.', dismissible: true });
            });
    };

    const passwordlessLoginHandler = () => {
        axios
            .get(baseUrl + 'api/auth/passwordlessSignIn', {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => {
                if (response.data.data.token) {
                    login(
                        response.data.data.id,
                        'Visitante',
                        response.data.data.role,
                        response.data.data.token,
                        new Date(new Date().getTime() + response.data.data.expiresIn),
                        false,
                        response.data.data.institutionId
                    );
                    navigate(isDashboard ? '/dash/acceptTerms' : '/acceptTerms');
                } else {
                    throw new Error('Authentication failed!');
                }
            })
            .catch((error) => {
                showAlert({ title: 'Falha de autenticação. Certifique-se que login e senha estão corretos.', dismissible: true });
            });
    };

    return (
        <div className="background-style d-flex flex-column align-items-center font-century-gothic vh-100 w-100">
            <div className="d-flex flex-column align-items-center justify-content-end h-75 w-100">
                <div className="d-flex flex-column align-items-center justify-content-end h-50">
                    <img src={picceTitle} alt="PICCE" className="mw-270 pb-4" />
                    <span className="login-title text-center fw-medium lh-sm fs-5 w-75 w-sm-50">
                        Bem-vindo(a) ao Ciência Cidadã na Escola!
                    </span>
                </div>

                <form className="row justify-content-center g-0 h-50 w-75 pt-5" onSubmit={loginHandler}>
                    <div className="col-12 col-lg-8 d-flex flex-column align-items-center">
                        <input
                            className="login-input color-white rounded-pill text-start fs-5 px-3 py-2 mb-4 w-100"
                            placeholder="Username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input
                            className="login-input color-white rounded-pill text-start fs-5 px-3 py-2 mb-3 w-100"
                            placeholder="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <p
                            className="login-links text-decoration-underline fs-6 cursor-pointer"
                            onClick={() => showAlert({ title: 'Fale com seu coordenador para recuperar sua senha.' })}
                        >
                            Esqueci minha senha
                        </p>
                    </div>
                    <div className="button-position row flex-column justify-content-end align-items-center g-0 pt-5">
                        <div className="col-12 col-lg-6 mb-3">
                            <TextButton hsl={[97, 43, 70]} text="Entrar" className="rounded-pill" type="submit" />
                        </div>
                        {!isDashboard && (
                            <div className="col-12 col-lg-6">
                                <TextButton
                                    hsl={[190, 46, 70]}
                                    text="Entrar sem registro"
                                    className="rounded-pill"
                                    type="button"
                                    onClick={passwordlessLoginHandler}
                                />
                            </div>
                        )}
                    </div>
                </form>
            </div>
            <div className="d-flex flex-column justify-content-end h-25 w-100">
                <div className="row align-items-center justify-content-between g-0 w-100 pb-3 px-3">
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

export default SignInPage;
