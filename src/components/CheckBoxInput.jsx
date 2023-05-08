import { React, useState } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .check-box-label{
        font-weight: 600;
        font-size: 90%;
        color: #535353;
    }

    .check-box-input{
        background-color: #D9D9D9
    }
`;

function CheckBoxInput(props) {
    const { onAnswerChange, input } = props;
    const [answers, setAnswers] = useState(new Array(input.sugestions.length).fill('false'));

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = `${value}`;
        setAnswers(updatedAnswers);
        onAnswerChange(input.id, updatedAnswers);
    };

    return (
        <div className="shadow rounded bg-white p-3">
            <div className="row justify-content-between m-0">
                <p className="form-label check-box-label font-barlow lh-sm px-0">{input.question}</p>
            </div>
            <div className="pt-2">
                {input.sugestions.map((option, index) => {
                    const optname = option.value.toLowerCase().replace(/\s/g, '');

                    return (
                        <div key={optname + 'input'} className="form-check ms-2 mb-2">
                            <input
                                className="form-check-input check-box-input"
                                type="checkbox"
                                name={'checkboxoptions' + input.id}
                                id={optname + 'input'}
                                onChange={(e) => handleAnswerChange(index, e.target.checked)}
                            ></input>
                            <label className="form-check-label check-box-label font-barlow" htmlFor={optname + 'input'}>
                                {option.value}
                            </label>
                        </div>
                    );
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default CheckBoxInput;
