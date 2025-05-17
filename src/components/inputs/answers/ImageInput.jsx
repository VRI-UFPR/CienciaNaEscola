/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useRef, useCallback, useContext } from 'react';
import RoundedButton from '../../RoundedButton';
import MarkdownText from '../../MarkdownText';
import MaterialSymbol from '../../MaterialSymbol';
import imageCompression from 'browser-image-compression';
import Gallery from '../../Gallery';
import { AlertContext } from '../../../contexts/AlertContext';

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

/**
 * Componente para upload de imagens.
 * @param {Object} props - Propriedades do componente.
 * @param {Function} props.onAnswerChange - Função chamada quando a resposta é alterada.
 * @param {Object} props.item - Objeto representando o item.
 * @param {Object} props.answer - Objeto contendo as imagens selecionadas.
 * @param {boolean} props.disabled - Define se o upload de imagem está desabilitado.
 */
function ImageInput(props) {
    const { onAnswerChange, item, answer, galleryModalRef, disabled } = props;

    const [ImageVisibility, setImageVisibility] = useState(false);
    const [disableUpload, setDisableUpload] = useState(false);
    const { showAlert } = useContext(AlertContext);
    const galleryInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    /**
     * Aualiza a resposta com a nova imagem adicionada.
     * @param {Object} newAnswer - Novo objeto de resposta contendo as imagens atualizadas.
     */
    const updateAnswer = useCallback(
        (newAnswer) => {
            onAnswerChange(answer.group, item.id, 'ITEM', newAnswer);
        },
        [onAnswerChange, answer.group, item]
    );

    /** Alterna a visibilidade da imagem. */
    const toggleImageVisibility = () => {
        setImageVisibility(!ImageVisibility);
    };

    /** Simula um clique no input de galeria para selecionar uma imagem do dispositivo. */
    const handleGalleryButtonClick = () => {
        galleryInputRef.current.click();
    };

    /** Simula um clique no input da câmera para capturar uma imagem. */
    const handleCameraButtonClick = () => {
        cameraInputRef.current.click();
    };

    /**
     * Insere uma imagem selecionada.
     * @param {Event} e - Evento do input de arquivo.
     */
    const insertImage = async (e) => {
        if (e.target?.files[0]) {
            setDisableUpload(true);
            const image = e.target.files[0];

            // Verifica se o arquivo tem um nome válido e obtém a extensão
            const fileNameParts = image.name.split('.');
            const extension = fileNameParts.length > 1 ? fileNameParts.pop() : 'jpg'; // Default para jpg se não houver extensão
            galleryInputRef.current.value = '';
            cameraInputRef.current.value = '';
            galleryInputRef.current.files = null;
            cameraInputRef.current.files = null;
            const options = {
                maxSizeMB: 2,
                useWebWorker: true,
            };
            await imageCompression(image, options)
                .then((processedImage) => {
                    const processedFile = new File([processedImage], `compressed.${extension}`, {
                        type: processedImage.type,
                    });

                    const newAnswer = { ...answer };
                    newAnswer.files.push(processedFile);
                    updateAnswer(newAnswer);
                    setDisableUpload(false);
                })
                .catch((error) =>
                    showAlert({
                        headerText: 'Erro ao submeter imagem',
                        bodyText: error.message,
                        onPrimaryBtnClick: () => setDisableUpload(false),
                    })
                );
        }
    };

    /**
     * Remove uma imagem com base no índice.
     * @param {number} indexToRemove - Índice da imagem a ser removida.
     */
    const removeImage = (indexToRemove) => {
        const newAnswer = { ...answer };
        newAnswer.files = newAnswer.files.filter((_, index) => index !== indexToRemove);
        updateAnswer(newAnswer.files.length === 0 ? {} : newAnswer);
    };

    return (
        <div className="rounded-4 shadow bg-white w-100 p-3">
            <MarkdownText text={item.text} />
            <Gallery className="mb-3" item={item} galleryModalRef={galleryModalRef} />
            <div className="row gx-3">
                <div className="col-auto align-self-center">
                    <div className="btn-group dropend">
                        <RoundedButton
                            hsl={[190, 46, 70]}
                            className="text-white"
                            icon="upload_file"
                            size={41}
                            alt={'Selecionar imagem'}
                            dataBsToggle="dropdown"
                            disabled={disabled || disableUpload}
                        />
                        <ul className="dropdown-menu image-input-dropdown rounded-4 overflow-hidden font-barlow fs-6 lh-sm shadow ms-1">
                            <li className="dropdown-item" onClick={handleGalleryButtonClick}>
                                <div className="row m-0 align-items-center justify-content-between">
                                    <div className="col-auto p-0 pe-3">
                                        <span className="fw-medium color-dark-gray">Selecionar da galeria</span>
                                    </div>
                                    <div className="col-2 p-0 ps-2">
                                        <MaterialSymbol icon="photo_library" size={32} fill color="#535353" />
                                    </div>
                                </div>
                            </li>
                            <li className="dropdown-item" onClick={handleCameraButtonClick}>
                                <div className="row m-0 align-items-center justify-content-between">
                                    <div className="col-auto p-0 pe-3">
                                        <span className="fw-medium color-dark-gray">Tirar foto</span>
                                    </div>
                                    <div className="col-2 p-0 ps-2">
                                        <MaterialSymbol icon="photo_camera" size={32} fill color="#535353" />
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
                                if (answer.files[i] && (answer.files[i] instanceof Blob || answer.files[i] instanceof File)) {
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
                                                className="position-absolute d-inline-block text-white top-0 end-0"
                                                hsl={[190, 46, 70]}
                                                icon="delete"
                                                onClick={() => removeImage(i)}
                                                disabled={disabled || disableUpload}
                                            />
                                        </div>
                                    );
                                } else {
                                    removeImage(i);
                                    return null;
                                }
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
                <RoundedButton className="text-white mb-2 me-2" hsl={[190, 46, 70]} icon="visibility" onClick={toggleImageVisibility} />
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
