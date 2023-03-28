import React from 'react';
import iconDate from '../assets/images/iconDate.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    label{
        font-weight: 500;
        font-size: 90%;
        color: #535353;
    }

	.bg-coral{
		background-color: #FF9551;
	}

    .form-control{
        font-weight: 500;
        color: #787878;
        font-size: 90%;
        border-radius: 0;
        border: 0px;
        border-bottom: 1px solid #C1C1C1;
    }

	.date-icon{
        padding: 12%;
        min-height: 0px;
        line-height: 0px;
    }

	.date-control{
		border-bottom: 0;
	}

	.icon-col{
		max-width: 40px;
	}
`;

function DateInput(props) {
    return (
        <div className="rounded shadow p-3 bg-white">
            <div className="row justify-content-between mb-1 m-0">
                <div className="col-1 icon-col d-flex justify-content-end p-0 pt-1">
                    <div className="col d-flex align-items-start p-0">
                        <div className="date-icon bg-coral rounded-circle w-100">
                            <img src={iconDate} alt="Ícone de data" className="w-100"></img>
                        </div>
                    </div>
                </div>
                <div className="col lh-sm p-0 ps-2">
                    <label labelfor="dateinput" className="form-label font-barlow lh-sm m-0">
                        Data da coleta
                    </label>
                    <input
                        type="text"
                        className="form-control font-barlow lh-sm p-0"
                        id="descriptioninput"
                        placeholder="Adicionar descrição"
                    ></input>
                </div>
            </div>
            <div className="row d-flex justify-content-end pt-2 m-0">
                <div className="col-1 icon-col"></div>
                <div className="col ps-2">
                    <input
                        type="date"
                        className="form-control date-control font-barlow d-inline-block w-auto lh-sm p-0"
                        id="dateinput"
                    ></input>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default DateInput;
