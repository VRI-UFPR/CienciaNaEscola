import React, { useEffect, useState, useRef } from 'react';

import RoundedButton from '../../RoundedButton';

import iconFile from '../../../assets/images/iconFile.svg';
import eyeIcon from '../../../assets/images/eyeIcon.svg';
import iconTrash from '../../../assets/images/iconTrash.svg';
import MarkdownText from '../../MarkdownText';

const styles = `
    .color-dark-gray {
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }
`;

function ImageInput(props) {
    const { onAnswerChange, item, group, disabled } = props;

    const [answer, setAnswers] = useState({ text: '...', files: [] });
    const [ImageVisibility, setImageVisibility] = useState(false);
    const fileInputRef = useRef(null);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    useEffect(() => {
        onAnswerChange(group, item.id, 'ITEM', answer);
    }, [answer, item.id, onAnswerChange, group]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const insertImage = (e) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            newAnswers.files.push(e.target.files[0]);
            return newAnswers;
        });
    };

    const removeImage = (indexToRemove) => {
        setAnswers((prevAnswers) => {
            const newAnswers = { ...prevAnswers };
            newAnswers.files = newAnswers.files.filter((_, index) => index !== indexToRemove);
            return newAnswers;
        });
    };

    return (
        <div className="rounded-4 shadow bg-white w-100 p-3">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row rounded p-0 pb-3 m-0">
                    <MarkdownText text={item.text} />
                    <div className="d-flex align-items-center p-0">
                        <RoundedButton
                            hsl={[190, 46, 70]}
                            icon={iconFile}
                            size={41}
                            alt={'Selecionar Arquivo'}
                            onClick={handleButtonClick}
                            disabled={disabled}
                        />
                        <div className="row row-cols-2 flex-row position-relative color-dark-gray font-barlow fw-medium fs-6 w-100 p-0 ms-2">
                            {answer.files.length > 0 ? (
                                answer.files.slice(0, ImageVisibility ? answer.files.length : 2).map((image, i) => {
                                    return (
                                        <div
                                            key={i}
                                            className={`col-6 d-flex justify-content-center align-items-center g-0 pe-3 ${
                                                i < 2 ? 'pt-0' : 'pt-3'
                                            }`}
                                        >
                                            <div className="d-flex justify-content-center align-items-center position-relative border border-black border-opacity-50 rounded-4">
                                                <img
                                                    className="img-fluid rounded-4 object-fit-contain"
                                                    src={URL.createObjectURL(answer.files[i])}
                                                    alt="Imagem selecionada"
                                                />
                                                <RoundedButton
                                                    className="position-absolute top-0 start-100 translate-middle mb-2 me-2"
                                                    hsl={[190, 46, 70]}
                                                    icon={iconTrash}
                                                    onClick={() => removeImage(i)}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="col-12">
                                    <span>Anexe uma fotografia</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        name="imageinput"
                        id="imageinput"
                        style={{ display: 'none' }}
                        onChange={insertImage}
                        ref={fileInputRef}
                        disabled={disabled}
                    />
                </div>
                <div
                    className={`${answer.files.length < 3 ? 'd-none' : 'd-flex'} justify-content-end align-items-end w-100 m-0 p-1 p-lg-2`}
                >
                    <RoundedButton className="mb-2 me-2" hsl={[190, 46, 70]} icon={eyeIcon} onClick={toggleImageVisibility} />
                </div>
            </form>
            <style>{styles}</style>
        </div>
    );
}

export default ImageInput;
