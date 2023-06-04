import { React, useEffect, useState } from 'react';

const styles = `
    .color-dark-gray {
        color: #535353;
    }

    .font-barlow {
        font-family: 'Barlow', sans-serif;
    }

    #submitbutton {
        
    }
`;

function ImageInput(props) {
    const [image, setImage] = useState(['']);
    const { onAnswerChange, input, answer } = props;

    useEffect(() => {
        onAnswerChange(input.id, image);
    }, [image, input.id, onAnswerChange]);

    return (
        <div className="rounded-4 shadow bg-white w-100 p-3">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row rounded p-0 pb-3 m-0">
                    <label htmlFor="imageinput" className="control-label color-dark-gray font-barlow fw-medium fs-6 p-0 pb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id cursus neque. Adicione uma imagem.
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        name="imageinput"
                        capture="environment"
                        id="imageinput"
                        placeholder="Adicione uma imagem"
                        className="form-control rounded-0 shadow-none font-barlow fw-medium p-0"
                        onChange={(e) => setImage([e.target.files[0]])}
                        disabled={answer !== undefined}
                    />
                </div>
            </form>
            <style>{styles}</style>
        </div>
    );
}

export default ImageInput;
