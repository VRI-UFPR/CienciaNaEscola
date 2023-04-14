import React from 'react';
import BuscarImg from '../assets/images/BuscarImg.svg';
import PerfilImg from '../assets/images/PerfilImg.png';

const styles = `
    .perfil-img {
        background-color: #FFFFFF;
        border-radius: 50%;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
    }
    .btn {
        width: 80%;
        height: 45px;
        border-radius: 8px;
        border: none;
        box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.5);
        transition-duration: 0.3s;
    }
    .fst-btn {
        background-color: #AAD390;
        color: #FFFFFF;
        font-size: 24px;
        font-weight: 700;
    }
    .snd-btn {
        background-color: #FFFFFF;
        color: #000000;
        font-size: 20px;
        font-weight: 500;
    }
    .sidebar-titles {
        align-items: start;
        margin-top: 15px;
        margin-left: 20px;
        color: #FFFFFF;
        opacity: 0.8;
        font-family: 'Century Gothic', sans-serif;
        font-size: 22px;
        font-weight: 700;
    }
    .sidebar-list-items {
        text-decoration: none;
        margin-left: 40px;
        color: #FFFFFF;
        font-family: 'Barlow', sans-serif;
        font-weight: 500;
    }
    .left-arrow {
        width: 32px;
        height: 32px;
        bottom: 10px;
        left: 40%;
        position: fixed;
    }
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }
`;

function Sidebar(props) {
    return (
        <div className="sidebar-wrapper d-flex flex-column">
            <div className="d-flex flex-column align-items-center">
                <img
                    className="perfil-img my-4"
                    src={PerfilImg}
                    alt="Perfil"
                    style={{
                        width: '100px',
                        height: '100px',
                    }}
                />
                <button className="btn fst-btn font-century-gothic my-1" type="button">
                    Novo
                </button>
                <button className="btn snd-btn d-flex flex-row my-2">
                    <img
                        src={BuscarImg}
                        alt="Search Icon"
                        style={{
                            width: '35px',
                            paddingRight: '7px',
                            paddingTop: '3px',
                        }}
                    />
                    <p className="font-barlow">Buscar</p>
                </button>
            </div>
            <div className="sidebar-menu-wrapper d-flex flex-column">
                <h1 className="sidebar-titles">Menu</h1>
                <a className="sidebar-list-items" href="/home">
                    Protocolos
                </a>
                <a className="sidebar-list-items" href="/endprotocol">
                    EndProtocol
                </a>
                <a className="sidebar-list-items" href="/terms">
                    Termos
                </a>
                <a className="sidebar-list-items" href="/about">
                    Sobre o App
                </a>
                <a className="sidebar-list-items" href="/help">
                    Ajuda
                </a>
            </div>
            <div className="sidebar-conta-wrapper d-flex flex-column">
                <h1 className="sidebar-titles">Conta</h1>
                <a className="sidebar-list-items" href="/profile">
                    Perfil
                </a>
                <a className="sidebar-list-items" href="/login">
                    Login
                </a>
                <a className="sidebar-list-items" href="/">
                    Logout
                </a>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Sidebar;
