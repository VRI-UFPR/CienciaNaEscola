import React from 'react';
import ProtocolOptions from '../components/ProtocolOptions';
import NavBar from '../components/Navbar';

const styles = `
    .row {
        width: 100%;
    }

    .protocol-wrapper {
        background-color: rgba(234, 234, 234, 1);
        height: 100vh;
    }

    .protocol-number {
        background-color: rgba(245, 148, 137, 1);
        max-width: 85px;
    }

    .input-name {
        border: 0px;
        width: 100%;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function ProtocolPage(props) {
    return (
        <div>
            <NavBar />
            <div className="protocol-wrapper d-flex flex-column px-4 py-4">
                <div className="row align-items-start m-0">
                    <div className="col-3 p-0">
                        <p className="protocol-number rounded shadow font-barlow m-0 p-2">N° prot.</p>
                    </div>
                    <div className="col-6 d-flex justify-content-center px-2">
                        <input className="input-name shadow rounded font-barlow p-2" type="text" placeholder="Insira seu nome" />
                    </div>
                    <div className="col-3 d-flex justify-content-end p-0">
                        <ProtocolOptions />
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default ProtocolPage;
