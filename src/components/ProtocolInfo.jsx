import { React } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-gray {
        color: #787878;
    }   

    .bg-coral-red{
        background-color: #F59489;
    }
`;

function InfoGerais(props) {
    const { info } = props;

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden w-100 p-0">
            <div className="w-100 pb-3 bg-coral-red"></div>
            <div className="p-3 pt-2">
                <h1 className="color-dark-gray font-barlow text-break fw-bold fs-5 m-0 p-0 pb-2">Informações gerais:</h1>
                <p className="color-gray font-barlow text-break fw-medium fs-6 m-0 p-0">{info}</p>
            </div>

            <style>{styles}</style>
        </div>
    );
}

export default InfoGerais;
