/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

// react
import { useContext, useState, useEffect } from 'react';
// third-party
import axios from 'axios';
import { hashSync } from 'bcryptjs';
import { serialize } from 'object-to-formdata';
import { useNavigate } from 'react-router-dom';
// contexts
import { AuthContext } from '../contexts/AuthContext';
import { AlertContext } from '../contexts/AlertContext';
import { LayoutContext } from '../contexts/LayoutContext';
// assets
import logoPicceCircular from '../assets/images/logoPicceCircular.svg';
import Background from '../assets/images/loginPageBackground.png';
import BackgroundWeb from '../assets/images/loginPageBackgroundWeb.png';
import TextButton from '../components/TextButton';
// logos
import logoNAPI from '../assets/images/logoNAPI.png';
import logoFA from '../assets/images/logoFA1.png';
import logoGovernoParana from '../assets/images/logoPR.png';
import logoGovernoFederal from '../assets/images/logoGF.png';
import RoundedButton from '../components/RoundedButton';
// components
import InfiniteLooper from '../components/InfiniteLooper';

const styles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .login-input,
    .login-input:active,
    .login-input:focus,
    .login-input input:focus-visible {
        background-color: #4E9BB9 !important;
        box-shadow: none;
        outline: none;
    }

    .login-input:focus-within,
    .login-input:active,
    .login-input:focus {
        box-shadow: inset 0px 4px 4px 0px #00000040 !important;
    }

    input:-webkit-autofill {
        background-color: #4E9BB9 !important;
        box-shadow: none;
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

    .bg-pastel-blue {
        background-color: #91CAD6;
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

    .mw-80 {
        max-width: 80px;
    }

    .mw-90 {
        max-width: 90px;
    }

    .mw-240 {
        max-width: 240px;
    }

    .mh-4 {
        height: auto;
        max-height: 4rem;
    }

    .logos-container {
        border: 2px solid #91CAD6;
    }
`;

/**
 * Página de login do sistema.
 * @param {Object} props - Propriedades do componente.
 */
function SignInPage(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { showAlert } = useContext(AlertContext);
    const { login, user } = useContext(AuthContext);
    const { isDashboard } = useContext(LayoutContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.status === 'authenticated') navigate(isDashboard ? '/dash/applications' : '/applications');
    }, [navigate, isDashboard, user]);

    /**
     * Trata o evento de submissão do formulário de login
     * @param {Event} event - Evento de submissão do formulário
     */
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

    /**
     * Trata o evento de submissão do formulário de login sem registro
     */
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
            <div className="container d-flex flex-column align-items-center h-100 g-0">
                <div className="row justify-content-center align-items-center flex-grow-1 w-100 g-0 py-5">
                    <div className="col-9 col-lg-8">
                        <div className="d-flex flex-column text-center align-items-center">
                            <img src={logoPicceCircular} alt="PICCE" className="mw-240 mb-4 mt-5 mb-sm-3" />
                            <span className="fw-medium lh-sm fs-5 mb-4 mb-sm-5">Bem-vindo(a) ao PICCE!</span>
                            <form onSubmit={loginHandler}>
                                <div className="row login-input align-items-center rounded-pill gx-1 px-3 py-2 mb-2">
                                    <div className="col">
                                        <input
                                            type="text"
                                            value={username}
                                            required
                                            minLength="3"
                                            maxLength="20"
                                            placeholder="Nome de usuário (username)"
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="bg-transparent border-0 rounded-1 text-start text-white fs-5 w-100"
                                        />
                                    </div>
                                </div>
                                <div className="row login-input align-items-center rounded-pill gx-1 px-3 py-2">
                                    <div className="col">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            required
                                            value={password}
                                            placeholder="Senha"
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="bg-transparent border-0 rounded-1 text-start text-white fs-5 w-100"
                                        />
                                    </div>
                                    <div className="col-auto">
                                        <RoundedButton
                                            hsl={[197, 43, 40]}
                                            icon={showPassword ? 'visibility_off' : 'visibility'}
                                            onClick={() => setShowPassword(!showPassword)}
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
                                        <TextButton type="submit" hsl={[97, 43, 70]} text="Entrar" className="rounded-pill" />
                                    </div>
                                </div>
                                {!isDashboard && (
                                    <div className="row justify-content-center g-0">
                                        <div className="col-12 col-lg-8">
                                            <TextButton
                                                type="button"
                                                hsl={[190, 46, 70]}
                                                text="Entrar sem registro"
                                                onClick={passwordlessLoginHandler}
                                                className="rounded-pill"
                                            />
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center align-items-center logos-container rounded bg-white w-75 mb-3 py-2 g-0">
                    <InfiniteLooper>
                        <div className="col-auto d-flex align-items-center justify-content-center mx-3">
                            <img className="mh-4 py-2" src={logoNAPI} alt="Logomarca NAPI Paraná faz Ciência" />
                        </div>
                        <div className="col-auto d-flex align-items-center justify-content-center mx-3">
                            <img className="mh-4" src={logoFA} alt="Logomarca da Fundação Araucária" />
                        </div>
                        <div className="col-auto d-flex align-items-center justify-content-center mx-3">
                            <img className="mh-4" src={logoGovernoParana} alt="Logomarca do Governo do Estado do Paraná" />
                        </div>
                        <div className="col-auto d-flex align-items-center justify-content-center mx-3">
                            <img className="mh-4" src={logoGovernoFederal} alt="Logomarca do Governo Federal" />
                        </div>
                    </InfiniteLooper>
                </div>
            </div>
            <style> {styles}</style>
        </div>
    );
}

export default SignInPage;
