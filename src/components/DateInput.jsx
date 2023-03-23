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
        <div className="p-3 shadow rounded">
            <div className="row m-0 justify-content-between mb-1">
                <div className="col-1 d-flex justify-content-end p-0 pt-1 icon-col">
                    <div className="col d-flex p-0 align-items-start">
                        <div className="rounded-circle bg-coral date-icon w-100">
                            <img src={iconDate} alt="Ícone" className="w-100"></img>
                        </div>
                    </div>
                </div>
                <div className="col p-0 ps-2 lh-sm">
                    <label labelfor="dateinput" className="form-label font-barlow lh-sm m-0">
                        Data da coleta
                    </label>
                    <input
                        type="text"
                        className="form-control p-0 lh-sm font-barlow"
                        id="descriptioninput"
                        placeholder="Adicionar descrição"
                    ></input>
                </div>
            </div>
            <div className="row m-0 d-flex justify-content-end pt-2">
                <div className="col-1 icon-col"></div>
                <div className="col ps-2">
                    <input
                        type="date"
                        className="form-control date-control font-barlow p-0 lh-sm d-inline-block w-auto"
                        id="dateinput"
                    ></input>
                </div>
            </div>

            <style>{styles}</style>
        </div>
    );
}

export default DateInput;
