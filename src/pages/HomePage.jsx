import { React, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import SplashPage from './SplashPage';
import { AuthContext } from '../contexts/AuthContext';
import TextButton from '../components/TextButton';

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

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            // .get(`http://localhost:3333/user/list/${user.id}`)
            // .get(`https://genforms.c3sl.ufpr.br/api/user/list/83`)
            axios
                .get('https://run.mocky.io/v3/7eff7e79-0807-4e23-9aaa-59d4b5b9e176')
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
                                    className="font-barlow d-flex d-lg-none rounded-3 shadow text-dark text-start fs-5 fw-medium px-4 py-3 w-100"
                                    overWriteStyles={true}
                                    onClick={() => navigate(`/protocol/${userProtocol.id}`)}
                                ></TextButton>
                                <TextButton
                                    text={userProtocol.title}
                                    hsl={[0, 1, 100]}
                                    className="font-barlow d-none d-lg-flex rounded-3 shadow text-dark text-start fs-5 fw-medium px-4 py-3 w-100"
                                    overWriteStyles={true}
                                    onClick={() => navigate(`/editprotocol/${userProtocol.id}`)}
                                ></TextButton>
                            </li>
                        ))}
                    </ul>
                    <style>{styles}</style>
                </div>
            </div>
            <div className="row justify-content-between mx-0 p-4">
                <div className="col-2"></div>
                <div className="col-8 col-lg-4 align-items-center p-0">
                    <TextButton
                        role="link"
                        className="d-none d-lg-flex"
                        onClick={() => navigate('/createprotocol')}
                        hsl={[97, 43, 70]}
                        text="Criar novo protocolo"
                    />
                </div>
                <div className="col-2 d-flex align-items-end justify-content-end p-0">
                    <RoundedButton role="link" onClick={() => navigate('/help')} />
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default HomePage;
