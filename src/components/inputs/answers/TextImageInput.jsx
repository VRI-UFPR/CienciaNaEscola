import React from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .squareParent{
        position:relative;
        overflow:hidden;
        padding-bottom:100%;
        background-color: #D9D9D9;
    }
    .squareParent .square{
        position: absolute;
        max-width: 100%;
        max-height: 100%;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
    }
`;

function TextImageInput({ options = [], image }) {
    return (
        <div className="row justify-content-center bg-white shadow rounded-4 m-0 p-3 pb-2">
            <div className="row justify-content-between mb-3 m-0">
                <div className="col-9 p-0">
                    <p className="form-label font-barlow lh-sm m-0">
                        Qual destas informações abaixo descrevem melhor a área ou ambiente de coleta? Destaque apenas um.
                    </p>
                </div>
            </div>
            <div className="row position-relative m-0 p-0 pb-2" style={{ maxWidth: '600px' }}>
                <div className="squareParent rounded-4 shadow w-100">
                    <img src="https://picsum.photos/1000?random=1" className="square w-100" alt="Imagem submetida" />
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default TextImageInput;
