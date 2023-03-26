import React from 'react';
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
        <div className="d-flex flex-column vh-100 font-barlow">
            <NavBar />
            <div className="container-fluid px-4 d-flex flex-column flex-grow-1">
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
                <div className="row pt-0 pb-4 mx-0 px-2 d-flex flex-grow-1 align-items-end">
                    <div className="row px-0 mx-0 justify-content-end">
                        <div className="col-3 d-flex align-items-center justify-content-end px-0">
                            <button
                                type="button"
                                style={{
                                    maxWidth: '32px',
                                }}
                                className="btn h-auto p-0 rounded-circle bg-crimson p-1 w-100"
                            >
                                <img src={helpIcon} alt="Ícone" className="w-100"></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style
                dangerouslySetInnerHTML={{
                    __html: styles,
                }}
            />
        </div>
    );
}

export default AboutPage;
