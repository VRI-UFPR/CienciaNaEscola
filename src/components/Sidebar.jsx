import React from 'react';
import BuscarImg from '../assets/images/BuscarImg.svg';
import PerfilImg from '../assets/images/PerfilImg.png';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .sidebar-wrapper img {
        width: 110px;
        height: 110px;
        border: 8px solid #AAD390;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
    }

    .sidebar-wrapper h1{
        opacity: 0.8;
    }

    .sidebar-wrapper a:hover {
        background-color: #FFBCB5;
    }

`;

function Sidebar(props) {
    return (
        <div className="sidebar-wrapper d-flex flex-column">
            <div className="container d-flex flex-column align-items-center">
                <img className="rounded-circle my-4" src={PerfilImg} alt="Perfil" />
            </div>
            <div className="container d-flex flex-column font-barlow fw-medium p-0 pb-4">
                <h1 className="text-start text-white font-century-gothic fw-bold fs-2 mb-0 ps-4 pb-3">Menu</h1>
                <a className="text-white text-decoration-none ps-5 py-2" href="/home">
                    Protocolos
                </a>
                <a className="text-white text-decoration-none ps-5 py-2" href="/about">
                    Sobre o App
                </a>
                <a className="text-white text-decoration-none ps-5 py-2" href="/terms">
                    Termos de Uso
                </a>
            </div>
            <div className="container d-flex flex-column font-barlow fw-medium p-0 pb-4">
                <h1 className="text-start text-white font-century-gothic fw-bold fs-2 mb-0 ps-4 pb-3">Conta</h1>
                <a className="text-white text-decoration-none ps-5 py-2" href="/profile">
                    Perfil
                </a>
                <a className="text-white text-decoration-none ps-5 py-2" href="/">
                    Logout
                </a>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Sidebar;
