import { React, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import ProtocolCarousel from '../components/ProtocolCarousel';
import Alert from '../components/Alert';
import { LayoutContext } from '../contexts/LayoutContext';
import TextButton from '../components/TextButton';

const style = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .color-grey {
        color: #535353;
    }

    @media (min-width: 992px) {
      .position-lg-sticky {
        position: sticky !important;
        top: 0;
      }
    }
`;

function InstitutionsPage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const { user, logout } = useContext(AuthContext);

    const [visibleInstitutions, setVisibleInstitutions] = useState([]);

    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            axios
                .get(baseUrl + `api/institution/getAllInstitutions`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleInstitutions(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    if (error.response.status === 401) {
                        logout();
                        navigate(isDashboard ? '/dash/signin' : '/signin');
                    }
                });
        }
    }, [user, logout, navigate, isDashboard]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="container-fluid d-flex flex-column flex-grow-1 p-0 m-0">
            <div className="row flex-grow-1 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky vh-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red w-auto d-flex" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column flex-grow-1 bg-white p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row d-flex align-items-center justify-content-center font-barlow bg-white h-100 p-0 m-0">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4 px-lg-5 pb-lg-4">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 pb-4 m-0">Instituições</h1>
                            <div className="d-flex justify-content-center flex-grow-1 pb-0 pb-lg-0 m-0">
                                <ProtocolCarousel listItems={visibleInstitutions.map((i) => ({ id: i.id, title: i.name }))} />
                            </div>
                        </div>
                    </div>
                    {user.role === 'ADMIN' && (
                        <div className="row d-flex justify-content-center pb-4 p-0 m-0">
                            <div className="col col-9 col-sm-6 col-md-5 col-lg-4 d-flex flex-column m-0">
                                <TextButton
                                    text={'Criar nova instituição'}
                                    hsl={[97, 43, 70]}
                                    onClick={() => {
                                        navigate('create');
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Alert id="InstitutionsPageAlert" ref={modalRef} />
            <style>{style}</style>
        </div>
    );
}

export default InstitutionsPage;
