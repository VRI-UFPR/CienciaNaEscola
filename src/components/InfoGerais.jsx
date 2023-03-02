import React from "react";


const styles= `
    .BlocoInfoGerais{
        border-radius: 50px;
        width: 400px;
        height: 150px;
        border: 1px solid white;
    }

    .bg-orange {
        background-color: #FF9551;
    }

    .border-cell{
        height: 12px;
    }

    .form-label{
        font-weight: 400;
        font-size: 27px;
        line-height: 38px;
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
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

function InfoGerais(props){
    return (
        <div className="BlocoInfoGerais">
            <div className="row w-100 p-0 m-0">
                <div className="col border-cell bg-orange"></div>
            </div>
            <form className="d-flex flex-column flex-grow-1">
                <div className="row pb-4">
                    <div className="rounded p-4">
                        <div className="mb-1">
                            <label for="infogerais" class="control-label" id="form-label mb-0">
                            Informações Gerais:
                            </label>
                            <input type="text" name="infogerais" class="form-control" id="infogerais" placeholder="Adicionar descrição"/>
                        </div>
                    </div>
                </div>
            </form>
            <style dangerouslySetInnerHTML={{ __html: styles }} />
        </div>
    );
}

export default InfoGerais;