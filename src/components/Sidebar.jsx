import React, { useEffect, useState, useContext } from 'react';
import ExitIcon from '../assets/images/ExitSidebarIcon.svg';
import PerfilImg from '../assets/images/blankProfile.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Offcanvas } from 'bootstrap';
import { AuthContext } from '../contexts/AuthContext';
import { version } from '../utils/constants';
import { LayoutContext } from '../contexts/LayoutContext';
import { AlertContext } from '../contexts/AlertContext';
import baseUrl from '../contexts/RouteContext';

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
        border: 8px solid #4E9BB9;
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
    const { showExitButton = true } = props;
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { isDashboard = false } = useContext(LayoutContext);
    const { showAlert } = useContext(AlertContext);

    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

    const closeSidebar = () => {
        const offcanvas = document.getElementById('sidebar');
        const bsOffcanvas = Offcanvas.getOrCreateInstance(offcanvas);
        bsOffcanvas.hide();
    };

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="d-flex flex-column flex-grow-1">
            <div className="sidebar-wrapper d-flex flex-column flex-grow-1 bg-coral-red">
                {(isMobile || showExitButton) && ( // Se é móvel ou showExitButton está definido como true
                    <div className="container d-flex justify-content-end p-0 erro">
                        <button
                            type="button"
                            className="btn btn-transparent rounded-circle border-0"
                            data-bs-dismiss="offcanvas"
                            data-bs-target="#sidebar"
                        >
                            <img className="exit-image" src={ExitIcon} alt="Exit Sidebar Icon" />
                        </button>
                    </div>
                )}
                <div className="container d-flex flex-column align-items-center pt-3 pb-4 px-5">
                    <div className="rounded-circle">
                        <img
                            className="profile-image rounded-circle"
                            src={user.profileImage ? baseUrl + user.profileImage : PerfilImg}
                            alt="Perfil"
                        />
                    </div>
                </div>
                <div className="container d-flex flex-column font-barlow fw-medium p-0 pb-4">
                    <h1 className="text-start text-white font-century-gothic fw-bold fs-2 mb-0 ps-4 pb-3">Menu</h1>
                    <Link
                        className="text-white text-decoration-none ps-5 py-2"
                        to={isDashboard ? '/dash/applications' : '/applications'}
                        onClick={() => closeSidebar()}
                    >
                        Aplicações
                    </Link>
                    {isDashboard && user.role !== 'USER' && (
                        <Link className="text-white text-decoration-none ps-5 py-2" to="/dash/protocols" onClick={() => closeSidebar()}>
                            Protocolos
                        </Link>
                    )}
                    {isDashboard && user.role === 'ADMIN' && (
                        <Link className="text-white text-decoration-none ps-5 py-2" to="/dash/institutions" onClick={() => closeSidebar()}>
                            Instituições
                        </Link>
                    )}
                    {isDashboard && user.role !== 'USER' && user.role !== 'ADMIN' && (
                        <Link
                            className="text-white text-decoration-none ps-5 py-2"
                            to={`/dash/institutions/my`}
                            onClick={() => closeSidebar()}
                        >
                            Minha Instituição
                        </Link>
                    )}
                    <Link
                        className="text-white text-decoration-none ps-5 py-2"
                        to={isDashboard ? '/dash/about' : '/about'}
                        onClick={() => closeSidebar()}
                    >
                        Sobre o App
                    </Link>
                    <Link
                        className="text-white text-decoration-none ps-5 py-2"
                        to={isDashboard ? '/dash/terms' : '/terms'}
                        onClick={() => closeSidebar()}
                    >
                        Termos de Uso
                    </Link>
                </div>
                <div className="container d-flex flex-column font-barlow fw-medium p-0 pb-4">
                    <h1 className="text-start text-white font-century-gothic fw-bold fs-2 mb-0 ps-4 pb-3">Conta</h1>
                    <Link
                        className="text-white text-decoration-none ps-5 py-2"
                        to={isDashboard ? '/dash/profile' : '/profile'}
                        onClick={() => closeSidebar()}
                    >
                        Perfil
                    </Link>
                    <button
                        className="btn text-start text-white text-decoration-none rounded-0 fw-medium ps-5 py-2"
                        type="button"
                        onClick={() => {
                            showAlert({
                                title: 'Tem certeza que deseja fazer logout?',
                                dismissHsl: [355, 78, 66],
                                dismissText: 'Não',
                                actionHsl: [97, 43, 70],
                                actionText: 'Sim',
                                dismissible: true,
                                actionOnClick: () => {
                                    closeSidebar();
                                    logout();
                                    navigate(isDashboard ? '/dash/signin' : '/signin');
                                },
                            });
                        }}
                    >
                        Logout
                    </button>
                </div>
            </div>
            <div>
                <p className="text-start text-white ps-4 fw-medium">{version}</p>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default Sidebar;
