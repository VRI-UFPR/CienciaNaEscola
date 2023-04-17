import React from 'react';
import TextButton from './TextButton';

const endProtocolAlertStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9;
    }

    .end-protocol-h1 {
        font-weight: 700;
        color: #535353;
        font-size: x-large;
    }
`;

function EndProtocolAlert(props) {
    return (
        <div className="d-flex flex-column shadow bg-grey rounded-4 w-100 mx-0 px-0 py-4">
            <div className="row p-4 py-2 mx-0">
                <h1 className="end-protocol-h1 font-century-gothic text-center">Deseja finalizar o protocolo?</h1>
            </div>
            <div className="row p-4 py-2 mx-0">
                <div className="col d-flex px-1">
                    <TextButton hsl={[355, 78, 66]} text="Não" />
                </div>
                <div className="col d-flex px-1">
                    <TextButton hsl={[97, 43, 70]} text="Sim" />
                </div>
            </div>
            <style>{endProtocolAlertStyles}</style>
        </div>
    );
}

export default EndProtocolAlert;
