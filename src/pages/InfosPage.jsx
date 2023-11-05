import React, { useRef, useEffect, useContext } from 'react';
import Background from '../assets/images/backgroundTerms.png';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import Alert from '../components/Alert';
import { useNavigate, useLocation } from 'react-router-dom';
import { teamMembers } from '../utils/constants';
import { AuthContext } from '../contexts/AuthContext';

const infosPageStyles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-white {
        background-color: #FFFFFF;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-dark-gray {
        color: #535353;
    }

    .text-justify {
        text-align: justify;
    }

    .background-style{
        background-size: cover;
        background-image: url(${Background});

    }
`;

function InfosPage(props) {
    const { title, content, showSidebar, showAccept, showNavTogglerMobile, showNavTogglerDesktop } = props;
    const navigate = useNavigate();
    const modalRef = useRef(null);
    const location = useLocation();
    const { user, acceptTerms } = useContext(AuthContext);

    useEffect(() => {
        if (acceptTerms.value === true) {
            if (user.id !== null && location.pathname === '/') {
                navigate('/home');
            } else if (user.id !== null && location.pathname === '/dash') {
                navigate('/dash/home');
            } else {
                navigate('/login');
            }
        }
    }, [navigate, user, acceptTerms, location.pathname]);

    return (
        <div className={`${location.pathname === '/dash' ? 'background-style' : ''} d-flex flex-column font-barlow vh-100`}>
            <div className="row m-0 flex-grow-1">
                <div className={`col-auto bg-coral-red p-0 ${showSidebar ? 'd-flex' : 'd-lg-none'}`}>
                    <div
                        className={`${showNavTogglerDesktop ? 'offcanvas' : 'offcanvas-lg'} offcanvas-start bg-coral-red w-auto d-flex`}
                        tabIndex="-1"
                        id="sidebar"
                    >
                        <Sidebar modalRef={modalRef} />
                    </div>
                </div>
                {location.pathname !== '/dash' && (
                    <div className="col d-flex flex-column bg-white p-0">
                        <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                        <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                            <div className="d-flex flex-column flex-grow-1">
                                <h1 className="font-century-gothic color-dark-gray fw-bold fs-4 pb-3 m-0">{title}</h1>
                                <h2 className="color-dark-gray fw-medium fs-6 pb-4 m-0">{content}</h2>
                            </div>
                            {location.pathname === '/about' && (
                                <div className="d-flex flex-column">
                                    <h1 className="font-century-gothic color-dark-gray fw-bold fs-4 pb-3 m-0">Equipe</h1>
                                    <h2 className="color-dark-gray text-justify fw-medium fs-6 pb-4 m-0">{teamMembers}</h2>
                                </div>
                            )}
                            <div className="row justify-content-center pb-4 m-0">
                                <div className="col-8 col-lg-4 p-0">
                                    <div className="row m-0">
                                        <div className="col-6 p-0 pe-2">
                                            <TextButton
                                                role="link"
                                                onClick={() => navigate('/')}
                                                className={showAccept ? '' : 'd-none'}
                                                hsl={[37, 98, 76]}
                                                text="Voltar"
                                            />
                                        </div>
                                        <div className="col-6 p-0">
                                            <TextButton
                                                role="link"
                                                onClick={() => navigate('/login')}
                                                className={showAccept ? '' : 'd-none'}
                                                hsl={[97, 43, 70]}
                                                text="Aceitar"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {location.pathname === '/dash' && (
                    <div className="container-fluid d-flex vh-100 m-0 p-0">
                        <div className="row d-flex justify-content-center align-items-center h-100 m-0 p-0">
                            <div className="col col-10 col-md-8 col-lg-6 rounded-5 d-flex flex-column justify-content-center bg-white h-75 m-0 p-5">
                                <h3 className="font-century-gothic color-dark-gray fw-bold pb-3 m-0">{title}</h3>
                                <h5 className="color-dark-gray overflow-auto fw-medium fs-6 pb-4 pe-4 m-0">{content}</h5>
                                <div className="row justify-content-center pb-4 pt-4 m-0">
                                    <div className="col-11 col-md-8 col-lg-6 p-0">
                                        <div className="row m-0">
                                            <div className="col-6 p-0 pe-2">
                                                <TextButton
                                                    role="link"
                                                    onClick={() => navigate('/')}
                                                    className={showAccept ? '' : 'd-none'}
                                                    hsl={[37, 98, 76]}
                                                    text="Voltar"
                                                />
                                            </div>
                                            <div className="col-6 p-0">
                                                <TextButton
                                                    role="link"
                                                    onClick={() => navigate('/login')}
                                                    className={showAccept ? '' : 'd-none'}
                                                    hsl={[97, 43, 70]}
                                                    text="Aceitar"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Alert id="InfosPageAlert" ref={modalRef} />
            <style>{infosPageStyles}</style>
        </div>
    );
}

InfosPage.defaultProps = {
    showSidebar: true,
    showAccept: true,
    showNavTogglerMobile: true,
    showNavTogglerDesktop: true,
};

export default InfosPage;
