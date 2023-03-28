import React from "react";
import LoginTitle from "../assets/images/loginTitle.svg";
import Background from "../assets/images/loginPageBackground.png";
import { Link } from "react-router-dom";

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
    return (
        <div>
            <div className="d-flex flex-column vh-100 w-100" style={{ backgroundSize: "cover", backgroundImage: `url(${Background})` }}>
                <div className="login-logo d-flex justify-content-center">
                    <img src={LoginTitle} alt="" style={{ width: "250px" }} />
                </div>
                <div className="d-flex justify-content-center mb-4 mt-4">
                    <span className="login-title">
                        Bem-vindo(a) ao <br /> Ciência Cidadã na <br />
                        Escola!
                    </span>
                </div>
                <div className=" d-flex flex-column align-items-center">
                    <input className="login-input px-3 mb-3" type="text" placeholder="Login" />
                    <input className="login-input px-3 mb-1" type="text" placeholder="Senha" />
                    <a href="/">Esqueci minha senha</a>
                </div>

                <div className="d-flex justify-content-center mt-5">
                    <Link className="login-button pt-1" to="/home"> Entrar </Link>
                </div>
            </div>
            <style> {styles}</style>
        </div>
    );
}

export default LoginPage;
