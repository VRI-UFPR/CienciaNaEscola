import { React, useCallback } from 'react';
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
    const { onAnswerChange, item, answer, galleryModalRef, disabled } = props;

    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'OPTION', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    const handleOptionsUpdate = (optionId) => {
        const newOptions = {};
        newOptions[optionId] = '';
        updateAnswer({ ...newOptions, group: answer.group });
    };

    return (
        <div className="rounded-4 shadow bg-white p-3">
            <div className="row m-0">
                <MarkdownText text={item.text} />
            </div>

            <Gallery className="mb-3" item={item} galleryModalRef={galleryModalRef} />

            <div className="row m-0 px-2">
                {item.itemOptions.map((option) => {
                    const optname = option.text.toLowerCase().replace(/\s/g, '');
                    return (
                        <div key={optname + 'input' + item.id} className="form-check m-0 mb-3 pe-0">
                            <input
                                className={`form-check-input bg-grey`}
                                type="radio"
                                name={'radiooptions' + item.id}
                                id={optname + 'input' + item.id}
                                checked={answer[option.id] !== undefined}
                                onChange={() => handleOptionsUpdate(option.id)}
                                disabled={disabled}
                            ></input>
                            <label
                                className={`form-check-label color-dark-gray font-barlow fw-medium fs-6`}
                                htmlFor={optname + 'input' + item.id}
                            >
                                {option.text}
                            </label>
                            <Gallery className="mt-1" item={option} galleryModalRef={galleryModalRef} />
                        </div>
                    );
                })}
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default RadioButtonInput;
