import React from 'react';

const styles = `
    .BlocoInfoGerais{
        border-top: 12px solid #F59489;
        border-radius: 9px;
        width: 624px;
        height: 150px;
        border-left: 1px solid grey;
        border-right: 1px solid grey;
        border-bottom: 1px solid grey;
    }

    #form-label{
        font-weight: 700;
        font-size: 27px;
        color: #535353;
        line-height: 38px;
    }

    #infogerais{
        background: transparent;
        border: none;
        border-bottom: 1px solid #000000;
        -webkit-box-shadow: none;
        box-shadow: none;
        border-radius: 0;
    }


`;

function InfoGerais(props) {
    return (
        <div className="BlocoInfoGerais shadow">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row pb-4">
                    <div className="rounded p-4">
                        <div className="mb-1">
                            <label for="infogerais" className="control-label" id="form-label">
                                Informações gerais:
                            </label>
                            <input
                                type="text"
                                name="infogerais"
                                className="form-control"
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
