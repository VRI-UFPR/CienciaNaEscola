import React from 'react';
import iconDate from '../assets/images/iconDate.svg';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-pastel-blue {
        background-color: #91CAD6;
    }

    .color-dark-gray {
        color: #535353;
    }

    .color-sonic-silver {
        color: #787878;
    }

    .fs-7 {
        font-size: 1.1rem !important;
    }

    .date-icon {
        max-width: 50px;
    }
`;

function DateInput(props) {
    const currentDate = () => {
        const date = new Date();
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear());
        return year + '-' + month + '-' + day;
    };

    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div className="date-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconDate} alt="Ícone de calendário" />
                    </div>
                </div>
                <div className="col p-3">
                    <div className="row m-0 pb-1">
                        <label htmlFor="dateinput" className="form-label color-dark-gray font-century-gothic fw-bold fs-7 m-0 p-0">
                            Data da coleta
                        </label>
                    </div>
                    <div className="row m-0">
                        <input
                            type="date"
                            className="form-control border-0 color-sonic-silver fw-medium fs-7 w-auto m-0 p-0"
                            id="dateinput"
                            defaultValue={currentDate()}
                        ></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default DateInput;
