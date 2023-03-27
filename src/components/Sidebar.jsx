import React from 'react';
import { Link } from 'react-router-dom';
import BuscarImg from '../assets/images/BuscarImg.svg';
import PerfilImg from '../assets/images/PerfilImg.png';
import Arrow from '../assets/images/SidebarArrow.svg';

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
                        alt="logo"
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
                <Link to="/home" className="sidebar-list-items">
                    Protocolos
                </Link>
                <a className="sidebar-list-items" href="/">
                    Usuários
                </a>
                <a className="sidebar-list-items" href="/">
                    Denúncias
                </a>
            </div>
            <div className="sidebar-conta-wrapper d-flex flex-column">
                <h1 className="sidebar-titles">Conta</h1>

                <Link to="/profile" className="sidebar-list-items">
                    Perfil
                </Link>
                <a className="sidebar-list-items" href="/">
                    Logout
                </a>
            </div>
            <button
                type="button"
                className="p-0 b-0"
                data-bs-dismiss="offcanvas"
                style={{
                    width: '0px',
                    height: '0px',
                }}
            >
                <img src={Arrow} alt="" className="left-arrow" />
            </button>
            <style>{styles}</style>
        </div>
    );
}

export default Sidebar;
