import React from 'react';
import ExitIcon from '../assets/images/ExitSidebarIcon.svg';
import PerfilImg from '../assets/images/PerfilImg.png';
import { Link, useNavigate } from 'react-router-dom';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-coral-red {
        background-color: #F59489;
    }

    .exit-image {
        max-width: 12px;
        max-height: 12px;
    }

    .profile-image {
        width: 110px;
        height: 110px;
        border: 8px solid #AAD390;
        box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.4);
    }

    .sidebar-wrapper h1{
        opacity: 0.8;
    }

    .sidebar-wrapper .btn:active {
        background-color: #F59489;
    }

    .sidebar-wrapper .btn:hover, 
    .sidebar-wrapper a:hover, 
    .sidebar-wrapper .btn:active, 
    .sidebar-wrapper a:active {
        background-color: #FFBCB5;
    }
`;

function Sidebar(props) {
    const { modalRef } = props;
    const navigate = useNavigate();

    return (
        <div className="d-flex flex-column flex-grow-1">
            <div className="sidebar-wrapper d-flex flex-column flex-grow-1 bg-coral-red">
                <div className="container d-flex d-lg-none justify-content-end p-0">
                    <button type="button" className="btn btn-transparent rounded-circle border-0" data-bs-dismiss="offcanvas">
                        <img className="exit-image" src={ExitIcon} alt="Exit Sidebar Icon" />
                    </button>
                </div>
                <div className="container d-flex flex-column align-items-center pt-3 pb-4">
                    <img className="profile-image rounded-circle" src={PerfilImg} alt="Perfil" />
                </div>
                <div className="container d-flex flex-column font-barlow fw-medium p-0 pb-4">
                    <h1 className="text-start text-white font-century-gothic fw-bold fs-2 mb-0 ps-4 pb-3">Menu</h1>
                    <Link className="text-white text-decoration-none ps-5 py-2" to="/home">
                        Protocolos
                    </Link>
                    <Link className="text-white text-decoration-none ps-5 py-2" to="/about">
                        Sobre o App
                    </Link>
                    <Link className="text-white text-decoration-none ps-5 py-2" to="/terms">
                        Termos de Uso
                    </Link>
                </div>
                <div className="container d-flex flex-column font-barlow fw-medium p-0 pb-4">
                    <h1 className="text-start text-white font-century-gothic fw-bold fs-2 mb-0 ps-4 pb-3">Conta</h1>
                    <Link className="text-white text-decoration-none ps-5 py-2" to="/profile">
                        Perfil
                    </Link>
                    <button
                        className="btn text-start text-white text-decoration-none rounded-0 fw-medium ps-5 py-2"
                        onClick={() => {
                            console.log('Deu');
                            modalRef.current.showModal({
                                title: 'Tem certeza que deseja fazer logout?',
                                dismissHsl: [355, 78, 66],
                                dismissText: 'Não',
                                actionHsl: [97, 43, 70],
                                actionText: 'Sim',
                                actionOnClick: () => navigate('/login'),
                            });
                        }}
                    >
                        Logout
                    </button>
                </div>
                <div className="container d-flex flex-column flex-grow-1 justify-content-end font-barlow text-white p-0 pb-4">
                    <h3 className="fw-bold fs-6 ps-4 ps-md-5">Denúncias</h3>
                    <span className="fw-medium ps-4 ps-md-5">Acesse o site</span>
                    <Link
                        href="/"
                        className="text-white text-decoration-underline fw-medium pb-2 ps-4 ps-md-5"
                        to="https://www.denuncias.com"
                    >
                        www.denuncias.com
                    </Link>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Sidebar;
