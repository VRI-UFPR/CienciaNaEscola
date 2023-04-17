import React from 'react';
import iconTime from '../assets/images/iconTime.svg';

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

    .time-label{
        font-size: 1.1rem;
        font-weight: 700;
        color: #535353;
    }

    .time-input{
        font-size: 1.1rem;
        font-weight: 500;
        color: #787878;
        border: 0;
    }

    .time-icon{
        max-width: 50px;
    }
`;

function TimeInput(props) {
    return (
        <div className="rounded-4 shadow bg-white overflow-hidden font-barlow p-0">
            <div className="row overflow-hidden m-0">
                <div className="col-2 d-flex bg-pastel-blue p-0">
                    <div class="time-icon ratio ratio-1x1 align-self-center w-50 mx-auto">
                        <img src={iconTime} alt="" />
                    </div>
                </div>
                <div className="col py-3">
                    <div className="row m-0">
                        <label labelfor="timeinput" className="form-label time-label font-century-gothic m-0 ps-2 p-0">
                            Horário da coleta
                        </label>
                    </div>
                    <div className="row m-0">
                        <input type="time" className="form-control time-input w-auto ps-2 pt-1 p-0" id="timeinput"></input>
                    </div>
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default TimeInput;
