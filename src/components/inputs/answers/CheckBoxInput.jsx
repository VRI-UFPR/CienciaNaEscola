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

function CheckBoxInput(props) {
    const { onAnswerChange, item, group, galleryModalRef, disabled } = props;
    const [options, setOptions] = useState({});

    useEffect(() => {
        onAnswerChange(group, item.id, 'OPTION', options);
    }, [options, item.id, onAnswerChange, group]);

    const handleOptionsUpdate = (optionId, updatedOption) => {
        setOptions((prevOptions) => {
            const newOptions = { ...prevOptions };
            if (updatedOption) {
                newOptions[optionId] = '';
            } else {
                delete newOptions[optionId];
            }
            return newOptions;
        });
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
                                type="checkbox"
                                name={'checkboxoptions' + item.id}
                                id={optname + 'input' + item.id}
                                onChange={(e) => handleOptionsUpdate(option.id, e.target.checked)}
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

export default CheckBoxInput;
