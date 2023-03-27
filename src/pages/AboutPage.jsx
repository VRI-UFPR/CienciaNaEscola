import React from 'react';
import { Link } from 'react-router-dom';
import helpIcon from '../assets/images/helpIcon.svg';
import NavBar from '../components/Navbar';

const styles = `
    .bg-crimson {
        background-color: #EC6571;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    h1 {
        color: #535353;
        font-weight: bold;
        font-size: x-large;
    }

    h2 {
        color: #535353;
        font-weight: 600;
        font-size: medium;
        text-align: justify;
    }
`;

function AboutPage(props) {
    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 px-4">
                <div className="row d-flex py-4 px-1">
                    <h1 className="pb-2 font-century-gothic">Sobre o aplicativo</h1>
                    <h2>
                        Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua.
                        Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea
                        commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                        Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem
                        ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi
                        consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
                        sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum
                        dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrum exercitationem ullam corporis.
                    </h2>
                </div>
                <div className="row d-flex flex-grow-1 align-items-end pt-0 pb-4 mx-0 px-2">
                    <div className="row justify-content-end px-0 mx-0">
                        <div className="col-3 d-flex align-items-center justify-content-end px-0">
                            <Link
                                to="/about"
                                style={{
                                    maxWidth: '32px',
                                }}
                                className="btn rounded-circle bg-crimson h-auto w-100 p-1"
                            >
                                <img src={helpIcon} alt="Ícone" className="w-100"></img>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default AboutPage;
