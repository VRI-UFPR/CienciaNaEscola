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
import TextButton from '../components/TextButton';
import logoFA from '../assets/images/logoFA.png';
import logoUFPR from '../assets/images/logoUFPR.svg';
import { serialize } from 'object-to-formdata';
import { LayoutContext } from '../contexts/LayoutContext';
import { AlertContext } from '../contexts/AlertContext';
import { hashSync } from 'bcryptjs';
import RoundedButton from '../components/RoundedButton';

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

    .color-pastel-blue {
        color: #91CAD6;
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
    const [show, setShow] = useState(false)


    useEffect(() => {
        if (user.status === 'authenticated') navigate(isDashboard ? '/dash/applications' : '/applications');
    }, [navigate, isDashboard, user]);

    const loginHandler = (event) => {
        event.preventDefault();
        const salt = process.env.REACT_APP_SALT;
        const formData = serialize({ username, hash: hashSync(password, salt) });
        axios
            .post(process.env.REACT_APP_API_URL + 'api/auth/signIn', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
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
                } else throw new Error('Authentication failed!');
            })
            .catch((error) => showAlert({ headerText: 'Falha de autenticação. Certifique-se que login e senha estão corretos.' }));
    };

    const passwordlessLoginHandler = () => {
        axios
            .get(process.env.REACT_APP_API_URL + 'api/auth/passwordlessSignIn', { headers: { 'Content-Type': 'multipart/form-data' } })
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
                } else throw new Error('Authentication failed!');
            })
            .catch((error) => showAlert({ headerText: 'Falha de autenticação. Certifique-se que login e senha estão corretos.' }));
    };

    return (
        <div className="background-style font-century-gothic overflow-y-scroll vh-100">
            <div className="container d-flex flex-column h-100">
                <div className="row justify-content-center align-items-center flex-grow-1 w-100 g-0 py-5">
                    <div className="col-9 col-lg-8">
                        <div className="d-flex flex-column text-center align-items-center">
                            <img src={picceTitle} alt="PICCE" className="mw-270 mb-2 mb-sm-3" />
                            <span className="text-center fw-medium lh-sm fs-5 mb-4 mb-sm-5">Bem-vindo(a) ao Ciência Cidadã na Escola!</span>
                            <form onSubmit={loginHandler}>
                                <input
                                    className="login-input color-white rounded-pill text-start fs-5 px-3 py-2 mb-4 w-100"
                                    placeholder="Nome de usuário (username)"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    minLength="3"
                                    maxLength="20"
                                    required
                                />
                                <div className="row align-items-center gx-1">
                                    <div className="col">
                                        <input
                                            className="login-input color-white rounded-pill text-start fs-5 px-3 py-2 w-100"
                                            placeholder="Senha"
                                            type={show ? 'text' : 'password'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="col-auto">
                                        <RoundedButton
                                            hsl={[197, 43, 52]}
                                            icon="visibility"
                                            onClick={() => setShow(!show)}
                                        />
                                    </div>
                                </div>
                                <button
                                    className="btn btn-link color-pastel-blue fs-6 p-0 mb-4 mb-sm-5"
                                    type="button"
                                    onClick={() =>
                                        showAlert({
                                            headerText:
                                                'Para recuperar sua senha, entre em contato com o coordenador de sua instituição ou com quem forneceu seus credenciais',
                                        })
                                    }
                                >
                                    Esqueci minha senha
                                </button>
                                <div className="row justify-content-center g-0 mb-2 mb-sm-3">
                                    <div className="col-12 col-lg-8">
                                        <TextButton hsl={[97, 43, 70]} text="Entrar" className="rounded-pill" type="submit" />
                                    </div>
                                </div>
                                {!isDashboard && (
                                    <div className="row justify-content-center g-0">
                                        <div className="col-12 col-lg-8">
                                            <TextButton
                                                hsl={[190, 46, 70]}
                                                text="Entrar sem registro"
                                                className="rounded-pill"
                                                type="button"
                                                onClick={passwordlessLoginHandler}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
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

export default SignInPage;
