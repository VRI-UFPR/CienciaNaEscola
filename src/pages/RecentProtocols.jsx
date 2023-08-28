import { React, useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';

import NavBar from '../components/Navbar';
import RoundedButton from '../components/RoundedButton';
import Sidebar from '../components/Sidebar';
import TextButton from '../components/TextButton';
import ProtocolCarousel from '../components/ProtocolCarousel';

const style = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .infos-h1 {
        color: #535353;
        font-weight: bold;
        font-size: x-large;
    }

    .infos-h2 {
        color: #535353;
        font-size: medium;
        text-align: justify;
    }

    .search-bar {
        background-color: #D9D9D9;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    }
`;

function RecentProtocolsPage(props) {
    const { title, content, showSidebar, showCreateProtocol, showNavToggler } = props;

    const [isLoading, setIsLoading] = useState(true);
    const [userProtocols, setUserForms] = useState([]);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const modalRef = useRef(null);

    const [filteredData, setFilteredData] = useState([]);

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

    const handleFilter = (event) => {
        const searchWord = event.target.value;
        const newFilter = userProtocols.filter((value) => {
            return value.title.toLowerCase().includes(searchWord.toLowerCase());
        });
        console.log(newFilter);
        setFilteredData(newFilter);
    };

    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <div className="row m-0 flex-grow-1">
                <div className={`col-2 bg-coral-red d-none ${showSidebar ? 'd-lg-flex' : ''}`}>
                    <Sidebar />
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar showNavToggler={showNavToggler} />
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="d-flex flex-column flex-grow-1">
                            <div className="d-flex column">
                                <h1 className="infos-h1 font-century-gothic pb-3 m-0 fw-bold fs-2 col-6">Protocolos Recentes</h1>
                                <div className="search-wrapper col-6">
                                    <input className="search-bar rounded-4 border-0 w-100 p-1 px-3"
                                        type="text"
                                        name="search-bar"
                                        id="search-bar"
                                        placeholder="Pesquisar"
                                        onChange={handleFilter}
                                    />
                                </div>
                            </div>
                            <div className="d-flex justify-content-center align-itens-center flex-grow-1 mb-5">
                                <ProtocolCarousel users={
                                    filteredData.length > 0 ? filteredData : userProtocols
                                } />
                            </div>
                        </div>
                        <div className="row justify-content-between mx-0">
                            <div className="col-3"></div>
                            <div className="col-4 align-items-center p-0">
                                <TextButton className={showCreateProtocol ? '' : 'd-none'} hsl={[97, 43, 70]} text="Criar novo protocolo" />
                            </div>
                            <div className="col-3 d-flex align-items-end justify-content-end p-0">
                                <RoundedButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{style}</style>
        </div>
    );
}

RecentProtocolsPage.defaultProps = {
    title: '',
    content: '',
    showSidebar: true,
    showCreateProtocol: true,
    showNavToggler: true,
};

export default RecentProtocolsPage;