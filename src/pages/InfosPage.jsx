import React, { useRef } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import MarkdownText from '../components/MarkdownText';

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
`;

function InfosPage(props) {
    const { content, showSidebar, showAccept, showNavTogglerMobile, showNavTogglerDesktop } = props;
    const navigate = useNavigate();
    const modalRef = useRef(null);

    return (
        <div className={`d-flex flex-column font-barlow vh-100`}>
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
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavTogglerMobile={showNavTogglerMobile} showNavTogglerDesktop={showNavTogglerDesktop} />
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="d-flex flex-column flex-grow-1">
                            <MarkdownText text={content} />
                        </div>
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
