import React from 'react';
import FormInputButtons from './FormInputButtons';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .form-label, .form-check-label{
        font-weight: 500;
        font-size: 90%;
        color: #535353;
    }

    .form-check-input{
        background-color: #D9D9D9
    }
`;

function RadioButtonInput({ options = [] }) {
    return (
        <div className="p-3 shadow rounded bg-white pb-4">
            <div className="row m-0 justify-content-between mb-2">
                <div className="col-9 p-0">
                    <p className="form-label font-barlow lh-sm">
                        Qual destas informações abaixo descrevem melhor a área ou ambiente de coleta? Dastaque apenas um.
                    </p>
                </div>
                <div className="col-3 d-flex justify-content-end ps-3 pt-2 p-0">
                    <FormInputButtons />
                </div>
            </div>

            {options.map((option) => {
                const optname = option.toLowerCase().replace(/\s/g, '');

                return (
                    <div className="form-check ms-2 mb-2">
                        <input className="form-check-input" type="radio" name="radiooptions" id={optname + 'input'}></input>
                        <label className="form-check-label font-barlow" for={optname + 'input'}>
                            {option}
                        </label>
                    </div>
                );
            })}
            <style>{styles}</style>
        </div>
    );
}

export default RadioButtonInput;
