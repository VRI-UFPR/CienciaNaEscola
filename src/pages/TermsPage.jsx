import React from 'react';
import NavBar from '../components/Navbar';
import HelpButton from '../components/HelpButton';
import Sidebar from '../components/Sidebar';

const styles = `
    .bg-coral-red {
        background-color: #F59489;
    }

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

    .green-button {
        border-radius: 10px;
        background-color: #AAD390;
        color: #FFF;
        font-weight: 700;
        font-size: 130%;
    }
`;

function TermsPage(props) {
    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <div className="row m-0 flex-grow-1">
                <div className="col-2 bg-coral-red d-none d-lg-flex">
                    <Sidebar />
                </div>
                <div className="col d-flex flex-column bg-white p-0">
                    <NavBar hideNav={true} />
                    <div className="container-fluid d-flex flex-column flex-grow-1 p-4 p-lg-5">
                        <div className="d-flex flex-column flex-grow-1">
                            <h1 className="font-century-gothic pb-3 m-0">Termos de uso</h1>
                            <h2 className="pb-4 m-0">
                                Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna
                                aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut
                                aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu
                                fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt
                                mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor
                                incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam
                                corporis.
                            </h2>
                        </div>
                        <div className="row justify-content-between mx-0">
                            <div className="col-3"></div>
                            <div className="col-4 align-items-center p-0">
                                <button type="submit" className="btn shadow green-button font-century-gothic w-100 p-2 d-lg-none">
                                    Aceitar
                                </button>
                            </div>
                            <div className="col-3 d-flex align-items-end justify-content-end px-0">
                                <HelpButton />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
}

export default TermsPage;
