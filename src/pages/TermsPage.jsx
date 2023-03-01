import React from "react";
import helpButton from "../assets/images/helpButton.svg";
import NavBar from "../components/Navbar";

const styles = `
    .bg-coral-red {
        background-color: #F59489;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .bg-yellow-orange {
        background-color: #FECF86;
    }

    .bg-steel-blue {
        background-color: #4E9BB9;
    }

    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-lime-green {
        background-color: #AAD390;
    }

    .border-cell {
        height: 10px;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .navbar {
        background-color: #4E9BB9;
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
        <div className="d-flex flex-column vh-100 font-barlow">
            <NavBar />
            <div className="container-fluid px-4 d-flex flex-column flex-grow-1">
                <div className="row d-flex py-4 px-1">
                    <h1 className="pb-2 font-century-gothic">Termos de uso</h1>
                    <h2>
                        Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam,
                        nisi ut aliquid ex ea commodi consequatur. Quis aute iure reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
                        tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrum exercitationem
                        ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur. Quis aute iure
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat
                        cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor
                        sit amet, consectetur adipisci elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim
                        ad minim veniam, quis nostrum exercitationem ullam corporis.
                    </h2>
                </div>
                <div className="row pt-0 pb-4 mx-0 px-2 d-flex flex-grow-1 align-items-end">
                    <div className="row px-0 mx-0 justify-content-between">
                        <div className="col-3"></div>
                        <div className="col-4 p-0 align-items-center">
                            <button type="submit" className="btn p-2 shadow w-100 green-button font-century-gothic">
                                Aceitar
                            </button>
                        </div>
                        <div className="col-3 d-flex align-items-center justify-content-end px-0">
                            <button
                                className="btn p-0 pt-1"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExample"
                                aria-controls="offcanvasExample"
                                style={{
                                    width: "50%",
                                    maxWidth: "40px",
                                }}
                            >
                                <img src={helpButton} width="100%" alt=""></img>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default TermsPage;
