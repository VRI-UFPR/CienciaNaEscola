import { useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip } from 'bootstrap';

function CreateValidationInput(props) {
    const { currentValidation, pageIndex, groupIndex, validationIndex, updateItemValidation, itemIndex, removeValidation, item } = props;
    const [validation, setValidation] = useState(currentValidation);

    useEffect(() => {
        if (validation !== currentValidation) updateItemValidation(validation, itemIndex, validationIndex);
    }, [validation, pageIndex, itemIndex, groupIndex, validationIndex, updateItemValidation, currentValidation]);

    useEffect(() => {
        const tooltipList = [];
        if (validation.tempId) {
            tooltipList.push(new Tooltip(`.delete-${validation.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.validation-type-${validation.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.validation-argument-${validation.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.validation-message-${validation.tempId}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [validation.tempId]);

    return (
        <div className="mb-3" key={'validation-' + validation.tempId}>
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                        Validação {Number(validationIndex) + 1} (Item {Number(itemIndex) + 1})
                    </h1>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon="delete"
                        onClick={() => removeValidation(itemIndex, validationIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'delete-' + validation.tempId + '-tooltip'}
                        data-bs-title="Remover a validação do item."
                        className={'delete-' + validation.tempId + '-tooltip text-white'}
                    />
                </div>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label htmlFor="validation-type" className="form-label fs-5 fw-medium me-2">
                        Tipo de validação
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'validation-type-' + validation.tempId + '-tooltip'}
                        data-bs-title="Qual tipo de condição deve ser atendida para que a validação seja atendida."
                        className={'bg-steel-blue validation-type-' + validation.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <select
                        className="form-select light-grey-input border border-steel-blue rounded-4 fs-5"
                        id="validation-type"
                        value={validation.type || ''}
                        onChange={(event) => setValidation((prev) => ({ ...prev, type: event.target.value }))}
                        required
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
                    <label htmlFor="validation-argument" className="form-label fs-5 fw-medium me-2">
                        Argumento
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'validation-argument-' + validation.tempId + '-tooltip'}
                        data-bs-title="Dado o tipo de validação, qual é o valor, qualidade ou quantidade que deve ser atendido."
                        className={'bg-steel-blue validation-argument-' + validation.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <input
                        className="form-control light-grey-input border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="validation-argument"
                        type="number"
                        value={validation.argument || ''}
                        onChange={(event) => setValidation((prev) => ({ ...prev, argument: event.target.value }))}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="validation-custom-message" className="form-label fs-5 fw-medium me-2">
                        Mensagem personalizada
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'validation-message-' + validation.tempId + '-tooltip'}
                        data-bs-title="Mensagem que será exibida ao usuário caso a validação não seja atendida."
                        className={'bg-steel-blue validation-message-' + validation.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <input
                        className="form-control light-grey-input border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="validation-custom-message"
                        type="text"
                        value={validation.customMessage || ''}
                        onChange={(event) => setValidation((prev) => ({ ...prev, customMessage: event.target.value }))}
                    />
                </div>
            </div>
        </div>
    );
}

export default CreateValidationInput;
