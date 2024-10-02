import React, { useState, useRef, useCallback } from 'react';

import RoundedButton from '../../RoundedButton';

import iconFile from '../../../assets/images/iconFile.svg';
import iconGallery from '../../../assets/images/iconGallery.svg';
import iconCamera from '../../../assets/images/iconCamera.svg';
import eyeIcon from '../../../assets/images/eyeIcon.svg';
import iconTrash from '../../../assets/images/iconTrash.svg';
import MarkdownText from '../../MarkdownText';
import imageCompression from 'browser-image-compression';

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

    .spinner-splash{
        width: 45px;
        height: 45px;
    }
        
    .bg-pastel-blue {
        background-color: #91CAD6;
    }
`;

function ImageInput(props) {
    const { onAnswerChange, item, answer, disabled } = props;

    const [ImageVisibility, setImageVisibility] = useState(false);
    const [disableUpload, setDisableUpload] = useState(false);
    const galleryInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    const handleGalleryButtonClick = () => {
        galleryInputRef.current.click();
    };

    const handleCameraButtonClick = () => {
        cameraInputRef.current.click();
    };

    const insertImage = async (e) => {
        if (e.target?.files[0]) {
            setDisableUpload(true);
            const image = e.target.files[0];
            galleryInputRef.current.value = '';
            cameraInputRef.current.value = '';
            galleryInputRef.current.files = null;
            cameraInputRef.current.files = null;
            const options = {
                maxSizeMB: 2,
                useWebWorker: true,
            };
            const processedImage = await imageCompression(image, options);
            const newAnswer = { ...answer };
            newAnswer.files.push(processedImage);
            updateAnswer(newAnswer);
            setDisableUpload(false);
        }
    };

    const removeImage = (indexToRemove) => {
        const newAnswer = { ...answer };
        newAnswer.files = newAnswer.files.filter((_, index) => index !== indexToRemove);
        updateAnswer(newAnswer);
    };

    return (
        <div className="rounded-4 shadow bg-white w-100 p-3">
            <MarkdownText text={item.text} />
            <div className="row gx-3">
                <div className="col-auto align-self-center">
                    <div className="btn-group dropend">
                        <RoundedButton
                            hsl={[190, 46, 70]}
                            icon={iconFile}
                            size={41}
                            alt={'Selecionar imagem'}
                            data-bs-toggle="dropdown"
                            disabled={disabled || disableUpload}
                        />
                        <ul className="dropdown-menu image-input-dropdown rounded-4 overflow-hidden font-barlow fs-6 lh-sm shadow ms-1">
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
                </div>
                <div className="col pe-3 align-self-center">
                    <div className="row gx-4 gy-1">
                        {disableUpload && (
                            <div className="col-6 pt-3">
                                <div className="ratio ratio-1x1 w-100 bg-pastel-blue color-white rounded-4 p-3">
                                    <div className="d-flex flex-column justify-content-center align-items-center w-100 h-100">
                                        <div className="spinner-border text-white spinner-splash mb-2" role="status">
                                            <span className="sr-only"></span>
                                        </div>
                                        <p className="text-center text-white lh-1 fw-medium m-0">Processando imagem</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        {answer.files.length > 0 || disableUpload ? (
                            answer.files.slice(0, ImageVisibility ? answer.files.length : 2 - (disableUpload ? 1 : 0)).map((image, i) => {
                                return (
                                    <div key={i} className="col-6 pt-3 position-relative">
                                        <div className="ratio ratio-1x1 w-100 position-relative border border-light-subtle rounded-4 overflow-hidden">
                                            <img
                                                className="img-fluid object-fit-contain w-100"
                                                src={URL.createObjectURL(answer.files[i])}
                                                alt="Imagem selecionada"
                                            />
                                        </div>
                                        <RoundedButton
                                            className="position-absolute d-inline-block top-0 end-0"
                                            hsl={[190, 46, 70]}
                                            icon={iconTrash}
                                            onClick={() => removeImage(i)}
                                            disabled={disabled || disableUpload}
                                        />
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-12">
                                <p className="color-dark-gray font-barlow fw-medium fs-6 m-0">Anexe uma imagem</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className={`${answer.files.length < 3 ? 'd-none' : 'd-flex'} justify-content-end align-items-end w-100 m-0 mt-3 p-0`}>
                <RoundedButton hsl={[190, 46, 70]} icon={eyeIcon} onClick={toggleImageVisibility} />
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
            <style>{styles}</style>
        </div>
    );
}

export default ImageInput;
