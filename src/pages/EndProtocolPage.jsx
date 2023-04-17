import React from 'react';
import RoundedButton from '../components/RoundedButton';
import NavBar from '../components/Navbar';

const styles = `
    .bg-crimson {
        background-color: #EC6571;
    }

    .bg-lime-green {
        background-color: #AAD390;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
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
        min-height: 0px;
        line-height: 0px;
    }
`;

function EndProtocolPage(props) {
    return (
        <div className="d-flex flex-column font-barlow vh-100">
            <NavBar />
            <div className="container-fluid d-flex flex-column flex-grow-1 px-4">
                <div className="row d-flex flex-grow-1 align-items-center justify-content-center py-4 px-0">
                    <div className="row shadow popup-warn w-75 mx-0 px-0 py-4">
                        <div className="row p-4 py-2 mx-0">
                            <h1 className="font-century-gothic">Deseja finalizar o protocolo?</h1>
                        </div>
                        <div className="row p-4 py-2 mx-0">
                            <div className="col d-flex px-1">
                                <button
                                    type="submit"
                                    className="btn options-button bg-crimson shadow font-century-gothic h-auto w-100 p-2 py-3"
                                >
                                    Não
                                </button>
                            </div>
                            <div className="col d-flex px-1">
                                <button
                                    type="submit"
                                    className="btn options-button bg-lime-green shadow font-century-gothic h-auto w-100 p-2 py-3"
                                >
                                    Sim
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row d-flex align-items-end pt-0 pb-4 mx-0 px-2">
                    <div className="row justify-content-end px-0 mx-0">
                        <div className="col-3 d-flex align-items-center justify-content-end px-0">
                            <RoundedButton />
                        </div>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default EndProtocolPage;
