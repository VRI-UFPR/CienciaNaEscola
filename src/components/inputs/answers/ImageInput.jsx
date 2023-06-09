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
    // const [image, setImage] = useState(['']);
    // const { onImageChange, input, answer } = props;

    // useEffect(() => {
    //     onImageChange(input.id, image);
    // }, [image, input.id, onImageChange]);

    return (
        <div className="rounded-4 shadow bg-white w-100 p-3">
            <form className="d-flex flex-column flex-grow-1">
                <div className="row rounded p-0 pb-3 m-0">
                    <label htmlFor="imageinput" className="control-label color-dark-gray font-barlow fw-medium fs-6 p-0 pb-3">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id cursus neque. Adicione uma imagem.
                    </label>
                    <input
                        type="file"
                        accept=".jpg,.gif,.png"
                        name="imageinput"
                        id="imageinput"
                        placeholder="Adicione uma imagem"
                        className="form-control rounded-0 shadow-none font-barlow fw-medium p-0"
                        // onChange={(e) => setImage([e.target.value])}
                        // value={answer ? answer[0].value : image}
                        // disabled={answer !== undefined}
                    />
                    <input id="submitbutton" type="submit" />
                </div>
            </form>
            <style>{styles}</style>
        </div>
    );
}

export default ImageInput;
