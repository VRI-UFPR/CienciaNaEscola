import { React, useContext, useState } from 'react';
import LoginTitle from '../assets/images/loginTitle.svg';
import axios from 'axios';
import Background from '../assets/images/backgroundLogin.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import TextButton from '../components/TextButton';

const styles = `

    .login-title{
        color: #3C3A3A;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .login-input{
        background-color: #4E9BB9;
        color: #FFFFFF;
        font-size: 90%;
        border: 0px;
    }

    ::placeholder {
        color: #FFFFFF;
    }

    .login-button {
        text-decoration: none;
        text-align: center;
        background-color: #AAD390;
        color: #FFFFFF;
        border: 0px;

    }

    a{
        color: #91CAD6;
    }
`;

function LoginPage(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const loginHandler = (event) => {
        event.preventDefault();
        // .post('http://localhost:3333/user/signIn', {
        axios
            .post('https://genforms.c3sl.ufpr.br/api/user/signIn', {
                email,
                hash: password,
            })
            .then((response) => {
                if (response.data.token) {
                    login(response.data.id, response.data.token);
                    navigate('/home');
                }
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    return (
        <div
            className="d-flex flex-column vh-100 w-100 font-century-gothic align-items-center"
            style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}
        >
            <div className="h-50 d-flex flex-column align-items-center justify-content-end">
                <img src={LoginTitle} alt="PICCE" className="pb-4" style={{ maxWidth: '300px' }} />
                <span className="login-title text-center pb-5 fs-5 w-50 fw-medium lh-sm">Bem-vindo(a) ao Ciência Cidadã na Escola!</span>
            </div>

            <form className="h-50 row w-75 justify-content-center" onSubmit={loginHandler}>
                <div className="h-50 col-12 col-lg-8 d-flex flex-column align-items-center">
                    <input
                        className="login-input px-3 py-2 mb-4 fs-5 text-center w-100 rounded-pill align-items-center"
                        placeholder="Login"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        className="login-input px-3 py-2 mb-3 w-100 fs-5 text-center rounded-pill"
                        placeholder="Senha"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <a href="/" className="fs-6">
                        Esqueci minha senha
                    </a>
                </div>
                <div className="row h-50 flex-column justify-content-start pt-lg-5 align-items-center">
                    <div className="col-12 col-lg-6">
                        <TextButton hsl={[97, 43, 70]} text="Entrar" className="rounded-pill" type="submit" />
                    </div>
                </div>
            </form>
            <style> {styles}</style>
        </div>
    );
}

export default LoginPage;
