import React, { useContext, useEffect, useRef } from 'react';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import Alert from '../components/Alert';
import { useNavigate } from 'react-router-dom';
import MarkdownText from '../components/MarkdownText';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import axios from 'axios';

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
    const { user, logout, acceptTerms } = useContext(AuthContext);

    useEffect(() => {
        if (user.acceptedTerms === true && showAccept === true) {
            navigate('/applications');
        }
    }, [user.acceptedTerms, navigate, showAccept]);

    const handleTermsAcceptance = () => {
        axios
            .get(baseUrl + 'api/auth/acceptTerms', {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            })
            .then((response) => {
                acceptTerms();
                navigate('/applications');
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    logout();
                    navigate('/');
                } else {
                    acceptTerms();
                    navigate('/applications');
                }
            });
    };

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
                        <div className="row justify-content-center pt-4 m-0">
                            <div className="col-8 col-lg-4 p-0">
                                <div className="row m-0">
                                    <div className="col-6 p-0 pe-2">
                                        <TextButton
                                            role="link"
                                            onClick={() => {
                                                logout();
                                                navigate('/');
                                            }}
                                            className={showAccept ? '' : 'd-none'}
                                            hsl={[37, 98, 76]}
                                            text="Voltar"
                                        />
                                    </div>
                                    <div className="col-6 p-0">
                                        <TextButton
                                            role="link"
                                            onClick={handleTermsAcceptance}
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
