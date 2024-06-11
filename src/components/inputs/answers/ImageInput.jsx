import React, { useEffect, useState, useRef } from 'react';

import RoundedButton from '../../RoundedButton';

import iconFile from '../../../assets/images/iconFile.svg';
import iconGallery from '../../../assets/images/iconGallery.svg';
import iconCamera from '../../../assets/images/iconCamera.svg';
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

    .image-input-dropdown {
        min-width: 240px !important;
    }
`;

function ImageInput(props) {
    const { onAnswerChange, item, group, disabled } = props;

    const [answer, setAnswers] = useState({ text: '...', files: [] });
    const [ImageVisibility, setImageVisibility] = useState(false);
    const galleryInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    useEffect(() => {
        onAnswerChange(group, item.id, 'ITEM', answer);
    }, [answer, item.id, onAnswerChange, group]);

    const handleGalleryButtonClick = () => {
        galleryInputRef.current.click();
    };

    const handleCameraButtonClick = () => {
        cameraInputRef.current.click();
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
                        <div class="btn-group dropend">
                            <RoundedButton
                                hsl={[190, 46, 70]}
                                icon={iconFile}
                                size={41}
                                alt={'Selecionar imagem'}
                                data-bs-toggle="dropdown"
                                disabled={disabled}
                            />
                            <ul class="dropdown-menu image-input-dropdown rounded-4 overflow-hidden font-barlow fs-6 lh-sm shadow ms-1">
                                <li className="dropdown-item">
                                    <div className="row m-0 align-items-center justify-content-between">
                                        <div className="col-auto p-0 pe-3">
                                            <span className="fw-medium color-dark-gray" onClick={handleGalleryButtonClick}>
                                                Selecionar da galeria
                                            </span>
                                        </div>
                                        <div className="col-2 p-0 ps-2">
                                            <img src={iconGallery} alt="Galeria" className="ratio ratio-1x1 w-100"></img>
                                        </div>
                                    </div>
                                </li>
                                <li className="dropdown-item">
                                    <div className="row m-0 align-items-center justify-content-between">
                                        <div className="col-auto p-0 pe-3">
                                            <span className="fw-medium color-dark-gray" onClick={handleCameraButtonClick}>
                                                Tirar foto
                                            </span>
                                        </div>
                                        <div className="col-2 p-0 ps-2">
                                            <img src={iconCamera} alt="Camera" className="ratio ratio-1x1 w-100"></img>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
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
                                    <span>Anexe uma imagem</span>
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
                        ref={galleryInputRef}
                        disabled={disabled}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        name="imageinputcamera"
                        id="imageinputcamera"
                        capture="camera"
                        style={{ display: 'none' }}
                        onChange={insertImage}
                        ref={cameraInputRef}
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
