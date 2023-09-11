import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import HomeArrows from '../components/HomeArrows';
import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import HomeButton from '../components/HomeButton';
import SplashPage from './SplashPage';
import { AuthContext } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Alert from '../components/Alert';

const styles = `
    .protocol-info {
        font-size: 75%;
        width: 90%;
    }

    .general-container {
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
`;

function HomePage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const [userProtocols, setUserForms] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            // .get(`http://localhost:3333/user/list/${user.id}`)
            axios
                .get(`https://genforms.c3sl.ufpr.br/api/user/list/${user.id}`)
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
        <div className="general-container container-fluid d-flex flex-column font-barlow h-100 w-100 p-0">
            <NavBar />
            <div className="d-flex flex-column p-0">
                <div className="protocol-info container-fluid d-flex justify-content-between mt-4">
                    <div>Protocolos recentes</div>
                    <div>Ultima modificação</div>
                </div>

                <div className="d-flex container-fluid p-0">
                    <ul className="container-fluid list-unstyled d-flex flex-column flex-grow-1 p-0 m-0">
                        {userProtocols.map((userProtocol) => (
                            <li key={userProtocol.id}>
                                <Link className="list-home-btn" to={`/protocol/${userProtocol.id}`}>
                                    <HomeButton title={userProtocol.title} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <style>{styles}</style>
                </div>
                <div className="d-flex">
                    <HomeArrows />
                </div>
            </div>
            <div className="d-flex button-container flex-grow-1 align-items-end justify-content-end">
                <RoundedButton role="link" onClick={() => navigate('/help')} />
            </div>
            <Alert id="HomePageAlert" ref={modalRef} />
            <div className={`offcanvas offcanvas-start bg-coral-red w-auto d-flex`} tabIndex="-1" id="sidebar">
                <Sidebar modalRef={modalRef} showExitButton={true}/>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default HomePage;
