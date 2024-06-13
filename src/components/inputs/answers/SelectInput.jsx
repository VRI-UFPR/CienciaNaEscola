import { React, useCallback, useState } from 'react';
import TextButton from '../../TextButton';

const styles = `
    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .form-select:focus {
        cursor: pointer;
        box-shadow: none !important;
    }
`;

function SelectInput(props) {
    const { onAnswerChange, item, answer, galleryRef, disabled } = props;
    const [ImageVisibility, setImageVisibility] = useState(false);

    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    const handleOptionsUpdate = (optionId) => {
        const newOptions = {};
        if (optionId !== -1) {
            newOptions[optionId] = '';
        }
        updateAnswer({ ...newOptions, group: answer.group });
    };

    return (
        <div className="rounded-4 shadow bg-white font-barlow p-3">
            <div className="row align-items-center justify-content-between pb-2 m-0">
                <p className="text-break text-start color-dark-gray font-barlow fw-medium fs-6 lh-sm px-0 m-0">{item.text}</p>
            </div>

            {item.files.length > 0 && galleryRef && (
                <div className="row justify-content-center m-0 ">
                    {item.files.slice(0, ImageVisibility ? item.files.length : 3).map((image, index) => {
                        return (
                            <div
                                key={'image-' + image.id}
                                className={`col-${item.files.length > 3 ? 4 : 12 / item.files.length} m-0 px-1 px-lg-2 ${
                                    index > 2 && 'mt-2'
                                }`}
                            >
                                <div
                                    className={`${
                                        item.files.length > 1 && 'ratio ratio-1x1'
                                    } border border-light-subtle rounded-4 overflow-hidden`}
                                    onClick={() => galleryRef.current.showModal({ images: item.files, currentImage: index })}
                                >
                                    <img src={image.path} className="img-fluid object-fit-contain" alt="Responsive" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {item.files.length > 3 && (
                <div className="row justify-content-center m-0 pt-3">
                    <TextButton
                        className="fs-6 w-auto p-2 py-0"
                        hsl={[190, 46, 70]}
                        text={`Ver ${ImageVisibility ? 'menos' : 'mais'}`}
                        onClick={toggleImageVisibility}
                    />
                </div>
            )}

            <div className="row px-0 py-2 m-0">
                <select
                    className="form-select border border-dark-subtle px-2 py-0"
                    onChange={(e) => handleOptionsUpdate(e.target.value)}
                    value={Object.keys(answer)[0] || -1}
                >
                    <option value="-1" label="Selecione uma opção:"></option>
                    {item.itemOptions.map((option) => {
                        const optname = option.text.toLowerCase().replace(/\s/g, '');
                        return (
                            <option key={optname + 'input' + item.id} value={option.id} label={option.text} disabled={disabled}></option>
                        );
                    })}
                </select>
            </div>

            <style>{styles}</style>
        </div>
    );
}

export default SelectInput;
