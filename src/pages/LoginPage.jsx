import React from "react";
import LoginTitle from "../assets/images/loginTitle.svg";
import Background from "../assets/images/paginaInicialLogin.svg";

const styles = `
    .login-wrapper {
    background-size: 100%;
    background-repeat: repeat-y;
    }

    .login-title{
        text-align: center;
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
        width: 70%;
        height: 30px;
        background-color: #AAD390;
        color: #FFFFFF;
        border-radius: 50px;
        border: 0px;

    }
`;

function LoginPage(props) {
    return (
        <div>
            <div className="login-wrapper d-flex flex-column">
                <div className="d-flex justify-content-center">
                    <img src={LoginTitle} alt="" style={{ width: "250px", height: "250px" }} />
                </div>
                <div className="d-flex justify-content-center">
                    <span className="login-title">
                        Bem-vindo(a) ao <br /> Ciência Cidadã na <br />
                        Escola!
                    </span>
                </div>
                <div className=" d-flex flex-column align-items-center">
                    <input className="login-input px-3" type="text" placeholder="Login" />
                    <input className="login-input px-3" type="text" placeholder="Senha" />
                </div>

                <div className="d-flex justify-content-center">
                    <button className="login-button "> Entrar </button>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default LoginPage;
