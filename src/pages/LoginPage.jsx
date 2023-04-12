import { React, useState } from 'react';
import LoginTitle from '../assets/images/loginTitle.svg';
import axios from 'axios';
import Background from '../assets/images/loginPageBackground.png';
import { useNavigate } from 'react-router-dom';

const styles = `

    .login-title{
        text-align: center;
        margin-bottom: 40px;
    }

    .login-input{
        width: 70%;
        height: 30px;
        background-color: #4E9BB9;
        color: #FFFFFF;
        font-size: 90%;
        border-radius: 50px;
        border: 0px;
    }

    ::placeholder {
        color: #FFFFFF;
    }

    .login-button {
        text-decoration: none;
        text-align: center;
        width: 70%;
        height: 30px;
        background-color: #AAD390;
        color: #FFFFFF;
        border-radius: 50px;
        border: 0px;
        margin-top: 40px;

    }

    .login-logo {
        margin-top: 80px;
        margin-bottom: 25px ;
    }

    a{
        color: #91CAD6;
    }
`;

function LoginPage(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const loginHandler = (event) => {
        event.preventDefault();
        axios
            .post('https://genforms.c3sl.ufpr.br/api/user/signIn', {
                email,
                hash: password,
            })
            .then((response) => {
                if (response.data.token) {
                    navigate('/home');
                }
            })
            .catch((error) => {
                console.error(error.message);
            });
    };

    return (
        <div>
            <div className="d-flex flex-column vh-100 w-100" style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}>
                <div className="login-logo d-flex justify-content-center">
                    <img src={LoginTitle} alt="" style={{ width: '250px' }} />
                </div>
                <div className="d-flex justify-content-center mb-4 mt-4">
                    <span className="login-title">
                        Bem-vindo(a) ao <br /> Ciência Cidadã na <br />
                        Escola!
                    </span>
                </div>
                <form onSubmit={loginHandler}>
                    <div className=" d-flex flex-column align-items-center">
                        <input
                            className="login-input px-3 mb-3"
                            placeholder="Login"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="login-input px-3 mb-1"
                            placeholder="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <a href="/">Esqueci minha senha</a>
                    </div>

                    <div className="d-flex justify-content-center mt-5">
                        <button className="login-button pt-1" type="submit">
                            Entrar
                        </button>
                    </div>
                </form>
            </div>
            <style> {styles}</style>
        </div>
    );
}

export default LoginPage;
