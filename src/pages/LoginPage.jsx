import React from "react";
import LoginTitle from "../assets/images/loginTitle.svg";
import Background from "../assets/images/paginaInicialLogin.svg";

const styles = `.login-wrapper {
    background-size: 100%;
    background-repeat: repeat-y;
}`;

function LoginPage(props) {
    return (
        <div style={{ backgroundImage: `url(${Background})`, width: "718px", height: "1349px" }}>
            <div className="login-wrapper d-flex flex-column">
                <div className="d-flex align-items-center">
                    <img src={LoginTitle} alt="" style={{ width: "100px", height: "100px" }} />
                </div>
                <span>Bem-Vindo ao Ciência Cidadã na Escola!</span>
                <input type="text" placeholder="Login" />
                <input type="text" placeholder="Senha" />
                <button> Entrar </button>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default LoginPage;
