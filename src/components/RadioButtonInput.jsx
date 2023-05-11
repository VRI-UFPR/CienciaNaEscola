import { React } from 'react';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .radio-button-label{
        font-weight: 600;
        font-size: 90%;
        color: #535353;
    }

    .radio-button-input{
        background-color: #D9D9D9
    }
`;

function RadioButtonInput(props) {
    const { onAnswerChange, input } = props;

    const handleAnswerChange = (index) => {
        const array = new Array(input.sugestions.length).fill('false');
        array[index] = 'true';
        onAnswerChange(input.id, array);
    };

    return (
        <div className="shadow rounded bg-white p-3">
            <div className="row justify-content-between m-0">
                <p className="form-label radio-button-label font-barlow lh-sm px-0">{input.question}</p>
            </div>
            <div className="pt-2">
                {input.sugestions.map((option, index) => {
                    const optname = option.value.toLowerCase().replace(/\s/g, '');

                    return (
                        <div key={optname + 'input'} className="form-check ms-2 mb-2">
                            <input
                                className="form-check-input radio-button-input"
                                type="radio"
                                name={'radiooptions' + input.id}
                                id={optname + 'input'}
                                onChange={() => handleAnswerChange(index)}
                            ></input>
                            <label className="form-check-label radio-button-label font-barlow" htmlFor={optname + 'input'}>
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
