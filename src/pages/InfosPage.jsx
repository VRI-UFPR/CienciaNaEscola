import { React, useRef } from 'react';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';

const infosPageStyles = `
    .bg-coral-red {
        background-color: #F59489;
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
`;

function InfosPage(props) {
    const { title, content, showSidebar, showAccept, showNavTogglerMobile, showNavTogglerDesktop } = props;
    const navigate = useNavigate();
    const modalRef = useRef(null);
    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <div className="row m-0 flex-grow-1">
                <div className={`col-auto bg-coral-red d-none p-0 ${showSidebar ? 'd-lg-flex' : ''}`}>
                    <Sidebar modalRef={modalRef} />
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="d-flex flex-column flex-grow-1">
                            <h1 className="font-century-gothic color-dark-gray fw-bold fs-4 pb-3 m-0">{title}</h1>
                            <h2 className="color-dark-gray text-justify fw-medium fs-6 pb-4 m-0">{content}</h2>
                        </div>
                        <div className="row justify-content-between mx-0">
                            <div className="col-2"></div>
                            <div className="col-8 col-lg-4 align-items-center p-0">
                                <div className="row m-0">
                                    <div className="col-6 p-0 pe-1">
                                        <TextButton
                                            role="link"
                                            onClick={() => navigate('/signup')}
                                            className={showAccept ? '' : 'd-none'}
                                            hsl={[97, 43, 70]}
                                            text="Aceitar"
                                        />
                                    </div>
                                    <div className="col-6 p-0 ps-1">
                                        <TextButton
                                            role="link"
                                            onClick={() => navigate('/login')}
                                            className={showAccept ? '' : 'd-none'}
                                            hsl={[355, 78, 66]}
                                            text="Voltar"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-2 d-flex align-items-end justify-content-end p-0">
                                <RoundedButton role="link" onClick={() => navigate('/help')} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Alert id="InfosPageAlert" ref={modalRef} />
            <style>{infosPageStyles}</style>
        </div>
    );
}

InfosPage.defaultProps = {
    title: '',
    content:
        'Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis.',
    showSidebar: true,
    showAccept: true,
    showNavTogglerMobile: true,
    showNavTogglerDesktop: true,
};

export default InfosPage;
