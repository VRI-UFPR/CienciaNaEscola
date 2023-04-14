import React from 'react';
import iconTime from '../assets/images/iconTime.svg';

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

	.time-icon{
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

function TimeInput(props) {
    return (
        <div className="shadow rounded bg-white p-3">
            <div className="row justify-content-between mb-1 m-0">
                <div className="col-1 icon-col d-flex justify-content-end p-0 pt-1">
                    <div className="col d-flex align-items-start p-0">
                        <div type="button" className="time-icon rounded-circle bg-coral w-100">
                            <img src={iconTime} alt="Ícone" className="w-100"></img>
                        </div>
                    </div>
                </div>
                <div className="col lh-sm p-0 ps-2">
                    <label labelfor="timeinput" className="form-label font-barlow lh-sm m-0">
                        Horário da coleta
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
                        type="time"
                        className="form-control date-control d-inline-block font-barlow w-auto lh-sm p-0"
                        id="timeinput"
                    ></input>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default TimeInput;
