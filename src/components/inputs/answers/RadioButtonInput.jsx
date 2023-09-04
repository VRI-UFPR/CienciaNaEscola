import { React, useEffect, useState } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9
    }

    .color-dark-gray {
        color: #535353;
    }
`;

function RadioButtonInput(props) {
    const { onAnswerChange, input, answer } = props;
    const [options, setOptions] = useState(new Array(input.sugestions.length).fill('false'));

    useEffect(() => {
        onAnswerChange(input.id, options);
    }, [options, input.id, onAnswerChange]);

    const handleOptionsUpdate = (index) => {
        const array = new Array(input.sugestions.length).fill('false');
        array[index] = 'true';
        setOptions(array);
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0 pb-3">
                <p className="form-label color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0">{input.question}</p>
            </div>
            <div className="row m-0 px-2">
                {input.sugestions.map((option, index) => {
                    const optname = option.value.toLowerCase().replace(/\s/g, '');
                    return (
                        <div key={optname + 'input' + input.id} className="form-check m-0 pb-2 pe-2">
                            <input
                                className={`form-check-input bg-grey ${answer && answer[index].value === 'true' ? 'opacity-100' : ''}`}
                                type="radio"
                                name={'radiooptions' + input.id}
                                id={optname + 'input' + input.id}
                                onChange={() => handleOptionsUpdate(index)}
                                checked={answer ? answer[index].value === 'true' : options[index] === 'true'}
                                disabled={answer !== undefined}
                            ></input>
                            <label
                                className={`form-check-label color-dark-gray font-barlow fw-medium fs-6 ${
                                    answer && answer[index].value === 'true' ? 'opacity-100' : ''
                                }`}
                                htmlFor={optname + 'input' + input.id}
                            >
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

export default RadioButtonInput;
