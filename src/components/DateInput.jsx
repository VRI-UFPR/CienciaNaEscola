import React from 'react';
import iconDate from '../assets/images/iconDate.png';

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

    .date-label{
        font-size: 1.1rem;
        font-weight: 700;
        color: #535353;
    }

    .date-input{
        font-size: 1.1rem;
        font-weight: 500;
        color: #787878;
        border: 0;
    }

    .date-icon{
        max-width: 50px;
    }
`;

function DateInput(props) {
    return (
        <div className="rounded shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div class="date-icon ratio ratio-1x1 w-50 align-self-center mx-auto">
                        <img src={iconDate} alt="" />
                    </div>
                </div>
                <div className="col py-3 px-3 pe-4">
                    <div className="row m-0">
                        <label labelfor="dateinput" className="form-label date-label font-century-gothic m-0 p-0">
                            Data da coleta
                        </label>
                    </div>
                    <div className="row m-0">
                        <input type="date" className="form-control date-input w-auto pt-1 p-0" id="dateinput"></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default DateInput;
