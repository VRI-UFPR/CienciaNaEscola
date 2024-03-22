import { React, useEffect, useState } from 'react';
import TextButton from '../../TextButton';
import MarkdownText from '../../MarkdownText';

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
    const { onAnswerChange, item, group, galleryRef } = props;
    const [options, setOptions] = useState({});
    const [ImageVisibility, setImageVisibility] = useState(false);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

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

            {item.files.length > 0 && galleryRef && (
                <div className="row justify-content-center m-0 mb-3">
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
                <div className="row justify-content-center m-0 mb-3">
                    <TextButton
                        className="fs-6 w-auto p-2 py-0"
                        hsl={[190, 46, 70]}
                        text={`Ver ${ImageVisibility ? 'menos' : 'mais'}`}
                        onClick={toggleImageVisibility}
                    />
                </div>
            )}

            <div className="row m-0 px-2">
                {item.itemOptions.map((option) => {
                    const optname = option.text.toLowerCase().replace(/\s/g, '');

                    return (
                        <div key={optname + 'input' + item.id} className="form-check m-0 pb-2 pe-2">
                            <input
                                // className={`form-check-input bg-grey ${answer && answer[index].value === 'true' ? 'opacity-100' : ''}`}
                                className={`form-check-input bg-grey`}
                                type="checkbox"
                                name={'checkboxoptions' + item.id}
                                id={optname + 'input' + item.id}
                                onChange={(e) => handleOptionsUpdate(option.id, e.target.checked)}
                                //checked={answer ? answer[index].value === 'true' : options[index] === 'true'}
                                //disabled={answer !== undefined}
                            ></input>
                            <label
                                // className={`form-check-label color-dark-gray font-barlow fw-medium fs-6 ${
                                //     answer && answer[index].value === 'true' ? 'opacity-100' : ''
                                // }`}
                                className={`form-check-label color-dark-gray font-barlow fw-medium fs-6 `}
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
