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

    .form-check-input {
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }

    .form-check-input:focus {
        border: 0;
        box-shadow: 0px 4px 4px 0px #00000040 inset;
    }

    .form-check input:checked {
        border: 0;
        background-color: #91CAD6;
    }
`;

function CheckBoxInput(props) {
    const { onAnswerChange, item, answer, galleryModalRef, disabled } = props;

    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'OPTION', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    const handleOptionsUpdate = (optionId, updatedOption) => {
        const newOptions = { ...answer };
        if (updatedOption) {
            newOptions[optionId] = '';
        } else {
            delete newOptions[optionId];
        }
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
                        <div key={optname + 'input' + item.id + 'option' + option.id} className="form-check m-0 mb-3 pe-0">
                            <input
                                className={`form-check-input bg-grey`}
                                type="checkbox"
                                name={'checkboxoptions' + item.id}
                                checked={answer[option.id] !== undefined}
                                id={optname + 'input' + item.id}
                                onChange={(e) => handleOptionsUpdate(option.id, e.target.checked)}
                                disabled={disabled}
                            ></input>
                            <label className={`form-check-label font-barlow fw-medium fs-6`} htmlFor={optname + 'input' + item.id}>
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

export default CheckBoxInput;
