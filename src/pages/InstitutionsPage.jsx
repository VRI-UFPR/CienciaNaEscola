import { React, useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import baseUrl from '../contexts/RouteContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import SplashPage from './SplashPage';
import Alert from '../components/Alert';
import { LayoutContext } from '../contexts/LayoutContext';
import TextButton from '../components/TextButton';
import ProtocolList from '../components/ProtocolList';
import ErrorPage from './ErrorPage';

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
    const [error, setError] = useState(null);
    const { user, logout } = useContext(AuthContext);

    const [visibleInstitutions, setVisibleInstitutions] = useState([]);

    const navigate = useNavigate();
    const modalRef = useRef(null);
    const { isDashboard } = useContext(LayoutContext);

    useEffect(() => {
        if (isLoading && user.status !== 'loading') {
            if (user.role === 'USER') {
                setError({ text: 'Operação não permitida', description: 'Você não tem permissão para visualizar instituições' });
                return;
            }
            axios
                .get(baseUrl + `api/institution/getVisibleInstitutions`, {
                    headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${user.token}` },
                })
                .then((response) => {
                    setVisibleInstitutions(response.data.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    setError({ text: 'Erro ao carregar as instituições', description: error.response?.data.message || '' });
                });
        }
    }, [user.token, logout, navigate, isDashboard, user.status, isLoading, user.role]);

    if (error) {
        return <ErrorPage text={error.text} description={error.description} />;
    }

    if (isLoading) {
        return <SplashPage text="Carregando instituições..." />;
    }

    return (
        <div className="d-flex flex-column vh-100">
            <div className="row h-100 m-0">
                <div className="col-auto bg-coral-red d-flex position-lg-sticky h-100 top-0 p-0">
                    <div className="offcanvas-lg offcanvas-start bg-coral-red d-flex w-auto" tabIndex="-1" id="sidebar">
                        <Sidebar modalRef={modalRef} showExitButton={false} />
                    </div>
                </div>
                <div className="col d-flex flex-column h-100 p-0">
                    <NavBar showNavTogglerMobile={true} showNavTogglerDesktop={false} />
                    <div className="row align-items-center justify-content-center font-barlow m-0">
                        <div className="col-12 col-md-10 p-4 pb-0">
                            <h1 className="color-grey font-century-gothic fw-bold fs-2 m-0">Instituições</h1>
                        </div>
                    </div>
                    <div className="row align-items-center justify-content-center font-barlow flex-grow-1 m-0 overflow-hidden">
                        <div className="col col-md-10 d-flex flex-column h-100 p-4">
                            <h1 className="color-grey font-century-gothic text-nowrap fw-bold fs-3 pb-4 m-0">Minhas instituições</h1>
                            <div className="d-flex justify-content-center flex-grow-1 overflow-hidden">
                                <ProtocolList
                                    listItems={visibleInstitutions.map((i) => ({ id: i.id, title: i.name }))}
                                    hsl={[36, 98, 83]}
                                />
                            </div>
                        </div>
                    </div>
                    {user.role === 'ADMIN' && (
                        <div className="row d-flex justify-content-center pb-4 m-0">
                            <div className="col-9 col-sm-6 col-md-5 col-lg-4 d-flex flex-column p-0 m-0">
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
