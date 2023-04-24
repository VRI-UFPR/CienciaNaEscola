import React from 'react';

const styles = `
    .bloco-info-gerais{
        border-top: 12px solid #F59489;
        width: 100%;
    }

    #form-label{
        font-weight: 700;
        font-size: 20px;
        color: #535353;
        line-height: 38px;
    }

    #infogerais{
        background: transparent;
        border: none;
        border-bottom: 1px solid #787878;
        -webkit-box-shadow: none;
        box-shadow: none;
        border-radius: 0;
    }
`;

function InfoGerais(props) {
    return (
        <div className="bloco-info-gerais rounded shadow bg-white">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row m-0 pb-4">
                    <div className="rounded p-0">
                        <div className="mb-1">
                            <label for="infogerais" className="control-label" id="form-label">
                                Informações gerais:
                            </label>
                            <input
                                type="text"
                                name="infogerais"
                                className="form-control p-0"
                                id="infogerais"
                                placeholder="Adicionar descrição"
                            />
                        </div>
                    </div>
                </div>
            </form>
            <style>{styles}</style>
        </div>
    );
}

export default InfoGerais;
