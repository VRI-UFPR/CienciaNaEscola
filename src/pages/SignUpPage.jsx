/*
Copyright (C) 2024 Laboratório Visão Robótica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { React, useState, useRef } from 'react';
import NavBar from '../components/Navbar';
import TextButton from '../components/TextButton';
import axios from 'axios';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

const signUpPageStyles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-dark-gray{
        color: #535353;
    }

    .bg-glacier-blue{
        background-color: #98c4d4;
    }

    .ce-input::placeholder{
        color: #FFF;
    }

    .ce-input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #AAD390 inset !important;
        -webkit-text-fill-color: #535353 !important;
    }


    .margin-item{
        margin-bottom: 1vh;
    }

    .margin-title{
        margin-bottom: 5vh;
    }

    .padding-item{
        padding: 1vh;
    }

`;

function SignUpPage(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    /*  const [username, setUsername] = useState('');
    const [institution, setInstitution] = useState('');
    const [role, setRole] = useState(''); */
    const modalRef = useRef(null);
    const navigate = useNavigate();

    const validateEmptyFields = () => name.trim() !== '' && email.trim() !== '' && password.trim() !== '';

    const validatePasswordMatch = () => password === passwordConf;

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[!@#$%^&*()-_+=\\|[\]{};:'",<.>/?]).*(?=.*[A-Z]).*(?=.*[a-z]).{8,}$/;

        return password.match(passwordRegex);
    };

    const validateEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return email.trim() === '' || emailRegex.test(email);
    };

    const validateName = () => {
        const nameRegex = /^[A-Za-z\s]+$/;
        return name.trim() === '' || nameRegex.test(name);
    };

    /*     const validateUsername = () => {
        const usernameRegex = /^[A-Za-z0-9_]+$/;
        return username.trim() === '' || usernameRegex.test(username);
    };

    const validateInstitution = () => {
        const institutionRegex = /^[A-Za-z\s]+$/;
        return institution.trim() === '' || institutionRegex.test(institution);
    };

    const validateRole = () => {
        const roleRegex = /(USER|APLICATOR|PUBLISHER|COORDINATOR|ADMIN)/;
        return role.trim() === '' || roleRegex.test(role);
    }; */

    const signUpHandler = (event) => {
        event.preventDefault();
        if (!validateEmptyFields()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: preencha todos os campos' });
        } else if (!validateEmail()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: email inválido' });
        } else if (!validateName()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: nome inválido' });
        } else if (!validatePassword()) {
            modalRef.current.showModal({
                title: 'Falha no cadastro: a senha deve ter ao menos oito dígitos, caractere especial, letra maiúscula e letra minúscula',
            });
        } else if (!validatePasswordMatch()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: as senhas não coincidem' });
            /*  } else if (!validateUsername()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: nome de usuário inválido' });
        } else if (!validateInstitution()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: insituição inválida' });
        } else if (!validateRole()) {
            modalRef.current.showModal({ title: 'Falha no cadastro: função inválida' }); */
        } else {
            axios
                .post('https://genforms.c3sl.ufpr.br/api/user/signUp', {
                    email,
                    hash: password,
                    name,
                })
                .then((response) => {
                    if (response.data.message === 'User registered with sucess.') {
                        modalRef.current.showModal({ title: 'Cadastrado com sucesso', onHide: () => navigate('/login') });
                    } else {
                        modalRef.current.showModal({ title: 'Falha no cadastro: erro no servidor' });
                    }
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
        //.post('http://localhost:3333/user/signUp', {
    };

    return (
        <div className="d-flex flex-column font-barlow min-vh-100">
            <NavBar showNavTogglerMobile={false} showNavTogglerDesktop={false} />
            <div className="d-flex flex-column align-items-center flex-grow-1 p-4">
                <div className="row flex-column align-items-center flex-grow-1 w-100">
                    <div className="col-12 col-lg-8">
                        <div className="margin-title text-center w-100">
                            <h1 className="color-dark-gray font-century-gothic fs-3 fw-bold pb-2 m-0">Cadastro de usuário</h1>
                            <h2 className="color-dark-gray fs-5 fw-medium m-0">Insira suas informações abaixo</h2>
                        </div>
                        <div className="margin-item text-center w-100">
                            <label htmlFor="name-input" className="form-label fs-5">
                                Nome completo:
                            </label>
                            <input
                                id="name-input"
                                className={`ce-input padding-item shadow border-0 rounded-4 text-center fs-5 bg-glacier-blue w-100 ${
                                    validateName() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder=""
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="margin-item text-center w-100">
                            <label htmlFor="email-input" className="form-label fs-5">
                                E-mail:
                            </label>
                            <input
                                id="email-input"
                                className={`ce-input padding-item shadow border-0 rounded-4 text-center fs-5 bg-glacier-blue w-100 ${
                                    validateEmail() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder=""
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="margin-item text-center w-100">
                            <label htmlFor="password-input" className="form-label fs-5">
                                Senha:
                            </label>
                            <input
                                id="password-input"
                                className={`ce-input padding-item shadow border-0 rounded-4 text-center fs-5 bg-glacier-blue w-100 ${
                                    validatePassword() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder=""
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="margin-title text-center w-100">
                            <label htmlFor="password-conf-input" className="form-label fs-5">
                                Confirme a senha:
                            </label>
                            <input
                                id="password-conf-input"
                                className={`ce-input padding-item shadow border-0 rounded-4 text-center fs-5 bg-glacier-blue w-100 ${
                                    validatePasswordMatch() && validatePassword() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder=""
                                type="password"
                                value={passwordConf}
                                onChange={(e) => setPasswordConf(e.target.value)}
                            />
                        </div>
                        {/* <div className="text-center margin-item w-100">
                            <label htmlFor="username-input" className="form-label fs-5">
                                Nome de usuário:
                            </label>
                            <input
                                id="username-input"
                                className={`shadow ce-input bg-glacier-blue padding-item rounded-4 text-center fs-5 border-0 p-2 w-100 ${
                                    validateUsername() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder="Nome de usuário"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="text-center margin-item w-100">
                            <label htmlFor="institution-input" className="form-label fs-5">
                                Instituição:
                            </label>
                            <input
                                id="v-input"
                                className={`shadow ce-input bg-glacier-blue padding-item rounded-4 text-center fs-5 border-0 w-100 ${
                                    validateInstitution() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder="Instituição"
                                type="text"
                                value={institution}
                                onChange={(e) => setInstitution(e.target.value)}
                            />
                        </div>
                        <div className="text-center margin-titles w-100">
                            <label htmlFor="role-input" className="form-label fs-5">
                                Papel:
                            </label>
                            <input
                                id="role-input"
                                className={`shadow ce-input bg-glacier-blue padding-item rounded-4s text-center fs-5 border-0 w-100 ${
                                    validateRole() ? 'text-white' : 'text-danger'
                                }`}
                                placeholder="Papel"
                                type="text"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                            />
                        </div> */}
                    </div>
                    <div className="row flex-column align-items-center g-0">
                        <div className="col-auto">
                            <TextButton hsl={[97, 43, 70]} text="Cadastre-se" className="fs-4 px-2 py-2" onClick={signUpHandler} />
                        </div>
                    </div>
                </div>
            </div>

            <Alert id="SignUpModal" ref={modalRef} />
            <style>{signUpPageStyles}</style>
        </div>
    );
}

SignUpPage.defaultProps = {};

export default SignUpPage;
