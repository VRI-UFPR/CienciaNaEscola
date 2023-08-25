import React, { useEffect, useState, useRef } from 'react';
import iconFile from '../../../assets/images/iconFile.svg';
import RoundedButton from '../../RoundedButton';

const styles = `
    .color-dark-gray {
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .image-preview {
        max-height: 200px;
    }
`;

function ImageInput(props) {
    const [image, setImage] = useState(null);
    const { onAnswerChange, input, answer } = props;
    const fileInputRef = useRef(null);

    useEffect(() => {
        onAnswerChange(input.id, image);
    }, [image, input.id, onAnswerChange]);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const handleFileInputChange = (e) => {
        setImage(e.target.files[0]);
    };

    return (
        <div className="rounded-4 shadow bg-white w-100 p-3">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row rounded p-0 pb-3 m-0">
                    <label htmlFor="imageinput" className="control-label color-dark-gray font-barlow fw-medium fs-6 p-0 pb-3">
                        {input.question}
                    </label>
                    <div className="d-flex align-items-center p-0">
                        <RoundedButton
                            hsl={[190, 46, 70]}
                            icon={iconFile}
                            size={41}
                            alt={'Selecionar Arquivo'}
                            onClick={handleButtonClick}
                        />
                        <div className="d-flex color-dark-gray font-barlow fw-medium fs-6 w-100 p-0 ms-2">
                            {image ? (
                                <div className="d-flex justify-content-center rounded-4 overflow-hidden bg-grey w-100">
                                    <img
                                        className="image-preview img-fluid object-fit-contain"
                                        src={URL.createObjectURL(image)}
                                        alt="Imagem selecionada"
                                    />
                                </div>
                            ) : (
                                <span>Selecionar Imagem</span>
                            )}
                        </div>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        name="imageinput"
                        capture="environment"
                        id="imageinput"
                        style={{ display: 'none' }}
                        onChange={handleFileInputChange}
                        disabled={answer !== undefined}
                        ref={fileInputRef}
                    />
                </div>
            </form>
            <style>{styles}</style>
        </div>
    );
}

export default ImageInput;
