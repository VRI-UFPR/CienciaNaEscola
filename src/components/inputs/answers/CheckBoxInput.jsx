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

function CheckBoxInput(props) {
    const { onAnswerChange, item, answer } = props;
    const [options, setOptions] = useState(new Array(item.itemOptions.length).fill('false'));

    useEffect(() => {
        onAnswerChange(item.id, options);
    }, [options, item.id, onAnswerChange]);

    const handleOptionsUpdate = (indexToUpdate, updatedOption) => {
        setOptions((prevOptions) => {
            const newOptions = [...prevOptions];
            newOptions[indexToUpdate] = `${updatedOption}`;
            return newOptions;
        });
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0 pb-3">
                <p className="form-label color-dark-gray font-barlow fw-medium fs-6 lh-sm m-0 p-0">{item.text}</p>
            </div>
            <div className="row m-0 px-2">
                {item.itemOptions.map((option, index) => {
                    const optname = option.text.toLowerCase().replace(/\s/g, '');

                    return (
                        <div key={optname + 'input' + item.id} className="form-check m-0 pb-2 pe-2">
                            <input
                                className={`form-check-input bg-grey ${answer && answer[index].value === 'true' ? 'opacity-100' : ''}`}
                                type="checkbox"
                                name={'checkboxoptions' + item.id}
                                id={optname + 'input' + item.id}
                                onChange={(e) => handleOptionsUpdate(index, e.target.checked)}
                                checked={answer ? answer[index].value === 'true' : options[index] === 'true'}
                                disabled={answer !== undefined}
                            ></input>
                            <label
                                className={`form-check-label color-dark-gray font-barlow fw-medium fs-6 ${
                                    answer && answer[index].value === 'true' ? 'opacity-100' : ''
                                }`}
                                htmlFor={optname + 'input' + item.id}
                            >
                                {option.text}
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
