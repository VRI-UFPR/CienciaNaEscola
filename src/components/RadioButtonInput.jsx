import React from 'react';

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

function RadioButtonInput(props) {
    return (
        <div className="p-3 shadow rounded bg-white pb-4">
            <div className="row m-0 justify-content-between mb-2">
                <p className="form-label font-barlow lh-sm px-0">{props.input.question}</p>
            </div>

            {props.input.sugestions.map((option) => {
                const optname = option.value.toLowerCase().replace(/\s/g, '');

                return (
                    <div key={optname + 'input'} className="form-check ms-2 mb-2">
                        <input className="form-check-input" type="radio" name="radiooptions" id={optname + 'input'}></input>
                        <label className="form-check-label font-barlow" htmlFor={optname + 'input'}>
                            {option.value}
                        </label>
                    </div>
                );
            })}
            <style>{styles}</style>
        </div>
    );
}

export default RadioButtonInput;
