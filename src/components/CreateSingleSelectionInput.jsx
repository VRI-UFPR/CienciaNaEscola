import React from 'react';
import { useState } from 'react';
import iconFile from '../assets/images/iconFile.svg';
import iconTrash from '../assets/images/iconTrash.svg';
import iconPlus from '../assets/images/iconPlus.svg';

import RoundedButton from './RoundedButton';

const styles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }    

    .font-barlow {
        font-family: 'Barlow', sans-serif;
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

    .form-check-input {
        background-color: #D9D9D9;
    }

    `;

function CreateSingleSelectionInput(props) {
    const { index, inputState, onTextBoxChange, onTextBoxRemove } = props;

    const [inputEmpty, setInputEmpty] = useState([true, true]);
    const [inputs, setInputs] = useState([[]]);

    const updateInputEmpty = (i, reason) => {
        const old = [...inputEmpty];
        reason === 0 ? (old[i] = true) : (old[i] = false);
        setInputEmpty(old);
    };

    const handleTextBoxChange = (event, field) => {
        const updatedTextBox = { ...inputState };
        updatedTextBox[field] = event.target.value;
        onTextBoxChange(index, updatedTextBox);
        if (event.target.id === 'question') {
            event.target.value === '' ? updateInputEmpty(0, 0) : updateInputEmpty(0, 1);
        }
    };

    const handleAdd = () => {
        const inp = [...inputs, []];
        const inpEmp = [...inputEmpty, true];
        setInputs(inp);
        setInputEmpty(inpEmp);
    };

    const handleDeleteInput = (i) => {
        const deleteInp = [...inputs];
        deleteInp.splice(i, 1);
        setInputs(deleteInp);
    };

    const handleInputChange = (onChangeValue, i) => {
        const inputData = [...inputs];
        inputData[i] = onChangeValue.target.value;
        setInputs(inputData);
        if (onChangeValue.target.id === String(i)) {
            onChangeValue.target.value === '' ? updateInputEmpty(i + 1, 0) : updateInputEmpty(i + 1, 1);
        }
    };

    return (
        <div className="px-0 pb-4 pb-lg-5">
            <div className="row justify-content-between pb-2 m-0">
                <div className="col d-flex justify-content-start p-0">
                    <h1 className="font-century-gothic text-steel-blue fs-3 fw-bold p-0 m-0">Seleção Única</h1>
                </div>
                <div className="col d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconFile} />
                    <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} onClick={onTextBoxRemove} />
                </div>
            </div>
            <div className="row form-check form-switch pb-3 m-0 ms-2">
                <input className="form-check-input border-0 fs-5 p-0" type="checkbox" role="switch" id="flexSwitchCheckDefault" />
                <label className="form-check-label font-barlow fw-medium fs-5 p-0" htmlFor="flexSwitchCheckDefault">
                    Obrigatório
                </label>
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
                        onChange={(event) => handleTextBoxChange(event, 'question')}
                    />
                    {inputEmpty[0] && (
                        <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-5 fw-medium">
                        Descrição
                    </label>
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="description"
                        onChange={(event) => handleTextBoxChange(event, 'description')}
                    />
                </div>
                {inputs.map((data, i) => {
                    return (
                        <div key={i + 1} className="mb-3">
                            <label htmlFor={i} className="form-label fw-medium fs-5">
                                Opção {i}
                            </label>
                            <div className="d-flex">
                                <input
                                    type="text"
                                    value={data}
                                    className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                    id={i}
                                    aria-describedby="questionHelp"
                                    onChange={(event) => handleInputChange(event, i)}
                                />
                                <RoundedButton className="ms-2" hsl={[190, 46, 70]} icon={iconTrash} onClick={() => handleDeleteInput(i)} />
                            </div>
                            {inputEmpty[i + 1] && (
                                <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                                    *Por favor, preencha esta opção
                                </div>
                            )}
                        </div>
                    );
                })}
                {inputs.length < 2 && (
                    <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                        O campo precisa ter pelo menos duas opções!
                    </div>
                )}
                <div className="d-flex justify-content-end p-0">
                    <RoundedButton hsl={[190, 46, 70]} size={22} icon={iconPlus} onClick={handleAdd} />
                </div>
            </div>
            <style>{styles}</style>
        </div>
    );
}

export default CreateSingleSelectionInput;
