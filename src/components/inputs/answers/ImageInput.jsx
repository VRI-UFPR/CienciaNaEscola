import React, { useEffect, useState, useRef } from 'react';
import iconFile from '../../../assets/images/iconFile.svg';

const styles = `
    .color-dark-gray {
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    .image-input-button {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        background-color: #91CAD6;
        border-radius: 50%;
        width: 41px;
        height: 41px;
        padding: 8px;
        cursor: pointer;
        border: none;
        outline: none;
    }

    .image-input-button img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }

    .button-label {
        margin-left: 10px;
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
                    <label htmlFor="simpletext" className="control-label color-dark-gray font-barlow fw-medium fs-6 p-0 pb-3">
                        {input.question}
                    </label>
                    <div className="d-flex align-items-center p-0">
                        <button type="button" className="image-input-button" onClick={handleButtonClick}>
                            <img src={iconFile} alt='Selecionar Arquivo'/>
                        </button>
                        <div className="button-label color-dark-gray font-barlow fw-medium fs-6 p-0 pb-0">
                            {image ? image.name : 'Selecionar Imagem'}
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
