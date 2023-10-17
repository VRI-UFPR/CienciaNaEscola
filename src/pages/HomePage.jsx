import { React, useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

import NavBar from '../components/Navbar';
import SplashPage from './SplashPage';
import ProtocolCarousel from '../components/ProtocolCarousel';

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
`;

function HomePage(props) {
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useContext(AuthContext);

    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        if (user.id !== null && user.token !== null) {
            // .get(`http://localhost:3333/user/list/${user.id}`)
            axios
                .get(`https://genforms.c3sl.ufpr.br/api/user/list/${user.id}`)
                .then((response) => {
                    setFilteredData(response.data);
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
        <div className="container-fluid d-flex flex-column flex-grow-1 p-0 m-0">
            <NavBar />
            <div className="row d-flex flex-column flex-grow-1 align-items-center font-barlow bg-white p-0 m-0">
                <div className="col col-lg-9 d-flex flex-column flex-grow-1 p-4 p-lg-5">
                    <h1 className="color-grey font-century-gothic fw-bold fs-1 pb-4 m-0">Protocolos</h1>
                    <div className="d-flex justify-content-center flex-grow-1 pb-5 pb-lg-0 m-0">
                        <ProtocolCarousel users={filteredData} />
                    </div>
                </div>
            </div>

            <style>{style}</style>
        </div>
    );
}

export default HomePage;
