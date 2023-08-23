import { React, useContext, useState, useRef } from 'react';
import LoginTitle from '../assets/images/loginTitle.svg';
import axios from 'axios';
import Background from '../assets/images/backgroundLogin.png';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import TextButton from '../components/TextButton';
import Alert from '../components/Alert';
import logoFA from '../assets/images/logoFA.svg';
import logoUFPR from '../assets/images/logoUFPR.svg';

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

    .login-forgot-pw{
        color: #91CAD6;
    }

    .login-forgot-pw:hover{
        cursor: pointer;
    }
`;

function LoginPage(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const modalRef = useRef(null);

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
                    login(response.data.id, email, response.data.token);
                    navigate('/home');
                } else {
                    throw new Error('Something went wrong!');
                }
            })
            .catch((error) => {
                modalRef.current.showModal({ title: 'Falha de autenticação. Certifique-se que email e senha estão corretos.' });
            });
    };

    return (
        <div
            className="d-flex flex-column align-items-center font-century-gothic vh-100 w-100"
            style={{ backgroundSize: 'cover', backgroundImage: `url(${Background})` }}
        >
            <div className="d-flex flex-column align-items-center justify-content-end h-75 w-100">
                <div className="d-flex flex-column align-items-center justify-content-end h-50">
                    <img src={LoginTitle} alt="PICCE" className="pb-4" style={{ maxWidth: '270px' }} />
                    <span className="login-title text-center fw-medium lh-sm fs-5 w-75 w-sm-50">Bem-vindo(a) ao Ciência Cidadã na Escola!</span>
                </div>

                <form className="row justify-content-center pt-5 h-50 w-75" onSubmit={loginHandler}>
                    <div className="col-12 col-lg-8 d-flex flex-column align-items-center">
                        <input
                            className="login-input align-items-center rounded-pill text-center fs-5 px-3 py-2 mb-4 w-100"
                            placeholder="Login"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            className="login-input rounded-pill text-center fs-5 px-3 py-2 mb-3 w-100"
                            placeholder="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {/* <Link to={'/acceptterms'} className="login-forgot-pw pb-2 fs-6">
                        Criar nova conta
                    </Link> */}
                        <p
                            className="login-forgot-pw text-decoration-underline fs-6 cursor-pointer"
                            onClick={() => modalRef.current.showModal({ title: 'Acesse o e-mail cadastrado para recuperar sua senha.' })}
                        >
                            Esqueci minha senha
                        </p>
                    </div>
                    <div className="row flex-column justify-content-end align-items-center pt-lg-5">
                        <div className="col-12 col-lg-6">
                            <TextButton hsl={[97, 43, 70]} text="Entrar" className="rounded-pill" type="submit" />
                        </div>
                    </div>
                </form>
            </div>
            <div className="row align-items-end justify-content-between pb-4 ps-2 h-25 w-100 ">
                <div className='col-4 justify-content-start d-flex align-items-center'>
                    <img className="d-h-auto w-100" src={logoUFPR} style={{ maxWidth: '150px' }} />
                </div>
                <div className='col-6 justify-content-end d-flex align-items-center'>
                    <img className="h-auto w-100" src={logoFA} style={{ maxWidth: '200px' }} />
                </div>
            </div>

            <Alert id="LoginModal" ref={modalRef} />
            <style> {styles}</style>
        </div >
    );
}

export default LoginPage;
