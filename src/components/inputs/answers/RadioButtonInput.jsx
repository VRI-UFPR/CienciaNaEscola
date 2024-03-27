import { React, useEffect, useState } from 'react';
import MarkdownText from '../../MarkdownText';
import Gallery from '../../Gallery';

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
    const { onAnswerChange, item, group, galleryModalRef } = props;
    const [options, setOptions] = useState({});

    useEffect(() => {
        onAnswerChange(group, item.id, 'OPTION', options);
    }, [options, item.id, onAnswerChange, group]);

    const handleOptionsUpdate = (optionId) => {
        setOptions(() => {
            const newOptions = {};
            newOptions[optionId] = '';
            return newOptions;
        });
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0">
                <MarkdownText text={item.text} />
            </div>

            <Gallery item={item} galleryModalRef={galleryModalRef} />

            <div className="row m-0 px-2">
                {item.itemOptions.map((option) => {
                    const optname = option.text.toLowerCase().replace(/\s/g, '');
                    return (
                        <div key={optname + 'input' + item.id} className="form-check m-0 pb-2 pe-2">
                            <input
                                // className={`form-check-input bg-grey ${answer && answer[option.id].value === 'true' ? 'opacity-100' : ''}`}
                                className={`form-check-input bg-grey`}
                                type="radio"
                                name={'radiooptions' + item.id}
                                id={optname + 'input' + item.id}
                                onChange={() => handleOptionsUpdate(option.id)}
                                //checked={answer ? answer[index].value === 'true' : options[index] === 'true'}
                                //disabled={answer !== undefined}
                            ></input>
                            <label
                                // className={`form-check-label color-dark-gray font-barlow fw-medium fs-6 ${
                                //     answer && answer[index].value === 'true' ? 'opacity-100' : ''
                                // }`}
                                className={`form-check-label color-dark-gray font-barlow fw-medium fs-6`}
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

export default RadioButtonInput;
