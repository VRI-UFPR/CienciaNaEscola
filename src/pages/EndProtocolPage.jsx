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

    .popup-warn {
        background-color: #D9D9D9;
        border-radius: 30px;
    }

    h1 {
        text-align: center;
        font-weight: 700;
        color: #535353;
        font-size: x-large;
    }

    .options-button {
        border-radius: 20px;
        color: #FFF;
        font-weight: 700;
        font-size: 140%;
    }

    .help-button {
        padding-bottom: 2.5px;
    }
`;

function EndProtocolPage(props) {
    return (
        <div className="d-flex flex-column vh-100 font-barlow">
            <NavBar />
            <div className="container-fluid px-4 d-flex flex-column flex-grow-1">
                <div className="row d-flex py-4 px-0 flex-grow-1 align-items-center justify-content-center">
                    <div className="row px-0 py-4 w-75 shadow popup-warn">
                        <div className="row p-4 pb-2 pt-2 mx-0">
                            <h1 className="font-century-gothic">Deseja finalizar o protocolo?</h1>
                        </div>
                        <div className="row p-4 pt-2 pb-2 mx-0">
                            <div className="col px-1">
                                <button
                                    type=" submit"
                                    className="btn p-2 py-3 options-button bg-crimson font-century-gothic shadow w-100"
                                >
                                    Não
                                </button>
                            </div>
                            <div className="col px-1">
                                <button
                                    type=" submit"
                                    className="btn p-2 py-3 shadow w-100 bg-lime-green font-century-gothic options-button"
                                >
                                    Sim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row pt-0 pb-4 mx-0 px-2 d-flex align-items-end">
                    <div className="row px-0 mx-0 justify-content-end">
                        <div className="col-3 d-flex align-items-center justify-content-end px-0 help-button">
                            <button
                                className="btn p-0 pt-1"
                                type="button"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasExample"
                                aria-controls="offcanvasExample"
                                style={{
                                    maxWidth: "40px",
                                    width: "50%",
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

export default EndProtocolPage;
