import React from 'react';
import RoundedButton from '../../RoundedButton';
import iconFile from '../../../assets/images/iconFile.svg';
import iconTrash from '../../../assets/images/iconTrash.svg';

const textBoxStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-light-grey{
        background-color: #D9D9D9;
    }

    .text-steel-blue {
        color: #4E9BB9;
    }

    .border-steel-blue{
        border-color: #4E9BB9 !important;
    }
`;

function CreateTextBoxInput(props) {
    const { index, input, onInputChange, onInputRemove } = props;

    const handleTextBoxChange = (event, field) => {
        const updatedTextBox = { ...input };
        updatedTextBox[field] = event.target.value;
        onInputChange(index, updatedTextBox);
    };

    return (
        <div className="pb-4 pb-lg-5">
            <div className="row justify-content-between m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 pb-4 m-0">Caixa de texto</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconFile} />
                    <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} onClick={onInputRemove} />
                </div>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label htmlFor="question" className="form-label fs-5 fw-medium">
                        Pergunta
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="question"
                        aria-describedby="questionHelp"
                        value={input.question}
                        onChange={(event) => handleTextBoxChange(event, 'question')}
                    />
                    {!input.question && (
                        <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="description" className="form-label fs-5 fw-medium">
                        Descrição
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="description"
                        value={input.description}
                        onChange={(event) => handleTextBoxChange(event, 'description')}
                    />
                </div>
            </div>
            <style>{textBoxStyles}</style>
        </div>
    );
}

export default CreateTextBoxInput;
