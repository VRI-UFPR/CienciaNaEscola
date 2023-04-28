import { React, useState } from 'react';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import TextButton from '../components/TextButton';

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
`;

function SignUpPage(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConf, setPasswordConf] = useState('');
    return (
        <div className="d-flex flex-column font-barlow min-vh-100">
            <NavBar showNavToggler={false} />
            <div className="d-flex flex-column flex-grow-1 p-4 p-lg-5">
                <div className="row flex-column align-items-center flex-grow-1 w-100">
                    <div className="col-12 col-lg-8">
                        <div className="text-center w-100 mb-4 mb-lg-5">
                            <h1 className="color-dark-gray font-century-gothic fs-3 pb-2 m-0 fw-bold">Cadastro de usuário</h1>
                            <h2 className="color-dark-gray fs-5 m-0 fw-medium">Insira suas informações abaixo</h2>
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="name-input" className="form-label fs-5">
                                Nome completo:
                            </label>
                            <input
                                id="name-input"
                                className="ce-input bg-glacier-blue text-white rounded-pill text-center fs-5 border-0 p-2 w-100"
                                placeholder="Nome completo"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="email-input" className="form-label fs-5">
                                E-mail:
                            </label>
                            <input
                                id="email-input"
                                className="ce-input bg-glacier-blue text-white rounded-pill text-center fs-5 border-0 p-2 w-100"
                                placeholder="Email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100 mb-3">
                            <label htmlFor="password-input" className="form-label fs-5">
                                Senha:
                            </label>
                            <input
                                id="password-input"
                                className="ce-input bg-glacier-blue text-white rounded-pill text-center fs-5 border-0 p-2 w-100"
                                placeholder="Senha"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="text-center w-100">
                            <label htmlFor="password-conf-input" className="form-label fs-5">
                                Confirme a senha:
                            </label>
                            <input
                                id="password-conf-input"
                                className="ce-input bg-glacier-blue text-white rounded-pill text-center fs-5 border-0 p-2 w-100"
                                placeholder="Confirme a senha"
                                type="password"
                                value={passwordConf}
                                onChange={(e) => setPasswordConf(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="row justify-content-between w-100 mx-0">
                    <div className="col-2"></div>
                    <div className="col-auto align-items-center p-0">
                        <TextButton className="px-5" hsl={[97, 43, 70]} text="Cadastre-se" />
                    </div>
                    <div className="col-2 d-flex align-items-end justify-content-end p-0">
                        <RoundedButton />
                    </div>
                </div>
            </div>

            <style>{signUpPageStyles}</style>
        </div>
    );
}

SignUpPage.defaultProps = {};

export default SignUpPage;
