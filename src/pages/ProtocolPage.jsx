import React from "react";
import ProtocolOptions from "../components/ProtocolOptions";

const styles = `
    .row {
        width: 100%;
        height: 0vh;
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
        width: 150px;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function ProtocolPage(props) {
    return ( 
        <div>
            <div className="protocol-wrapper d-flex px-4 py-4">
                <div className="row align-items-center">
                    <div className="col-3">
                        <p className="protocol-number rounded shadow font-barlow m-0 p-2">N°</p>
                    </div>
                    <div className="col-6 d-flex justify-content-center ps-0">
                        <input className="input-name shadow rounded font-barlow p-2" type="text" placeholder="Insira seu nome"/>
                    </div>
                    <div className="col-3 p-2">
                        <ProtocolOptions />
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div> 
    );
}

export default ProtocolPage;