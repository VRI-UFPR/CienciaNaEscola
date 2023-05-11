import { React, useEffect, useState } from 'react';

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
    const { onAnswerChange, input, answer } = props;
    const [options, setOptions] = useState(new Array(input.sugestions.length).fill('false'));

    useEffect(() => {
        onAnswerChange(input.id, options);
    }, [options, input.id, onAnswerChange]);

    const handleOptionsUpdate = (indexToUpdate, updatedOption) => {
        setOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[indexToUpdate] = `${updatedOption}`;
            return newOptions;
        });
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
                                onChange={(e) => handleOptionsUpdate(index, e.target.checked)}
                                checked={answer ? answer[index].value === 'true' : options[index] === 'true'}
                                disabled={answer !== undefined}
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
