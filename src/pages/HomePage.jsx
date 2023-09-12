import { useNavigate } from 'react-router-dom';
import { React, useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import SplashPage from './SplashPage';
import { AuthContext } from '../contexts/AuthContext';
import TextButton from '../components/TextButton';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';

const styles = `
    .protocolInfo {
        font-size: 75%;
        width: 90%;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .generalContainer {
        position: absolute;
    }

    .button-container{
        padding: 24px 36px;
    }
    .home-button-link {
        text-decoration: none;
        color: #262626;
    }

    .list-home-btn { 
        display: flex;
        justify-content: center;
        margin-bottom: 13px;
    }

    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .infos-h1 {
        color: #535353;
        font-weight: bold;
        font-size: x-large;
    }
`;

function HomePage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [userProtocols, setUserForms] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    useEffect(() => {
        const url = () => {
            switch (user.id) {
                case 73:
                    return 'bf2163d2-f1b8-4251-803d-f8aaeea6996a';
                case 89:
                    return '9ab01800-6703-440b-b7f0-fba0da6b928c';
                case 92:
                    return '35ca541c-d007-4f63-a180-0dfdab4bb807';
                case 94:
                    return 'b9d8af3a-8b0c-4d91-949a-f5514949e8c0';
                case 96:
                    return '73e8f90e-48a2-4dda-be96-133f83b8f577';
                case 98:
                    return '36dd9235-396a-4513-8965-67fa9bfecf2d';
                default:
                    return 'bfd805e5-08ba-4c6f-a7e7-281071b2d833';
            }
        };

        if (user.id !== null && user.token !== null) {
            // .get(`http://localhost:3333/user/list/${user.id}`)
            // .get(`https://genforms.c3sl.ufpr.br/api/user/list/83`)
            axios
                .get(`https://run.mocky.io/v3/${url()}`)
                .then((response) => {
                    setUserForms(response.data);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.error(error.message);
                });
        }
    }, [user]);

    if (isLoading) {
        return <SplashPage />;
    }

    return (
        <div className="generalContainer container-fluid d-flex flex-column font-barlow h-100 w-100 p-0">
            <NavBar />
            <div className="d-flex flex-column p-0 flex-grow-1">
                <div className="protocolInfo container-fluid d-flex justify-content-between mt-4 px-4 pb-4 m-0">
                    <h1 className="infos-h1 font-century-gothic m-0 fw-bold">Protocolos recentes</h1>
                </div>

                <div className="d-flex container-fluid flex-grow-1 px-4">
                    <ul className="container-fluid bg-yellow-orange list-unstyled d-flex flex-column flex-grow-1 p-0 m-0 py-4 rounded-4 px-4">
                        {userProtocols.map((userProtocol) => (
                            <li key={userProtocol.id} className="m-0 p-0 py-2">
                                <TextButton
                                    text={userProtocol.title}
                                    hsl={[0, 1, 100]}
                                    className="font-barlow d-flex rounded-3 shadow text-dark text-start fs-5 fw-medium px-4 py-3 w-100"
                                    overWriteStyles={true}
                                    onClick={() => navigate(`/protocol/${userProtocol.id}`)}
                                ></TextButton>
                                {/* <TextButton
                                    text={userProtocol.title}
                                    hsl={[0, 1, 100]}
                                    className="font-barlow d-none d-lg-flex rounded-3 shadow text-dark text-start fs-5 fw-medium px-4 py-3 w-100"
                                    overWriteStyles={true}
                                    onClick={() => navigate(`/editprotocol/${userProtocol.id}`)}
                                ></TextButton> */}
                            </li>
                        ))}
                    </ul>
                    <style>{styles}</style>
                </div>
            </div>
            <div className="row justify-content-between mx-0 p-4">
                <div className="col-2"></div>
                {/* <div className="col-8 col-lg-4 align-items-center p-0">
                    <TextButton
                        role="link"
                        className="d-none d-lg-flex"
                        onClick={() => navigate('/createprotocol')}
                        hsl={[97, 43, 70]}
                        text="Criar novo protocolo"
                    />
                </div> */}
                <div className="col-2 d-flex align-items-end justify-content-end p-0">
                    <RoundedButton role="link" onClick={() => navigate('/help')} />
                </div>
            </div>
            <Alert id="HomePageAlert" ref={modalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true} />
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default HomePage;
