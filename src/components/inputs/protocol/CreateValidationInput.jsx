import React, { useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import iconTrash from '../../../assets/images/iconTrash.svg';

function CreateValidationInput(props) {
    const { currentValidation, pageIndex, groupIndex, validationIndex, updateValidation, itemIndex, removeValidation, item } = props;
    const [validation, setValidation] = useState(currentValidation);

    useEffect(() => {
        if (validation !== currentValidation) updateValidation(validation, pageIndex, groupIndex, validationIndex);
    }, [validation, pageIndex, groupIndex, validationIndex, updateValidation, currentValidation]);

    return (
        <div className="mb-3" key={'validation-' + validation.tempId}>
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                        Validação {Number(validationIndex) + 1} (Item {Number(itemIndex) + 1})
                    </h1>
                </div>
                <div className="col-auto">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconTrash} onClick={() => removeValidation(itemIndex, validationIndex)} />
                </div>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label htmlFor="validation-type" className="form-label fs-5 fw-medium">
                        Tipo de validação
                    </label>
                    <select
                        className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                        id="validation-type"
                        value={validation.type || ''}
                        onChange={(event) => {
                            setValidation((prev) => {
                                const newValidation = { ...prev };
                                newValidation.type = event.target.value;
                                return newValidation;
                            });
                        }}
                    >
                        <option value="">Selecione...</option>
                        {item.type === 'NUMBERBOX' && (
                            <>
                                <option value="MIN">Número mínimo</option>
                                <option value="MAX">Número máximo</option>
                            </>
                        )}

                        {item.type === 'TEXTBOX' && (
                            <>
                                <option value="MIN">Mínimo de caracteres</option>
                                <option value="MAX">Máximo de caracteres</option>
                            </>
                        )}
                        {item.type === 'CHECKBOX' && (
                            <>
                                <option value="MIN">Mínimo de escolhas</option>
                                <option value="MAX">Máximo de escolhas</option>
                            </>
                        )}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="validation-argument" className="form-label fs-5 fw-medium">
                        Argumento
                    </label>
                    <input
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="validation-argument"
                        type="number"
                        value={validation.argument || ''}
                        onChange={(event) => {
                            setValidation((prev) => {
                                const newValidation = { ...prev };
                                newValidation.argument = event.target.value;
                                return newValidation;
                            });
                        }}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="validation-custom-message" className="form-label fs-5 fw-medium">
                        Mensagem personalizada
                    </label>
                    <input
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="validation-custom-message"
                        type="text"
                        value={validation.customMessage || ''}
                        onChange={(event) => {
                            setValidation((prev) => {
                                const newValidation = { ...prev };
                                newValidation.customMessage = event.target.value;
                                return newValidation;
                            });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreateValidationInput;
