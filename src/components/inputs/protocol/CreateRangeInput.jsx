import { useEffect, useRef, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip } from 'bootstrap';

const rangeStyles = `
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

    .form-check-input {
        background-color: #D9D9D9;
    }

    .img-gallery{
        max-height: 200px;
    }
`;

function CreateRangeInput(props) {
    const { currentItem, pageIndex, groupIndex, itemIndex, updateItem, removeItem, updateItemPlacement } = props;
    const [item, setItem] = useState(currentItem);
    const galleryInputRef = useRef(null);

    useEffect(() => {
        if (item !== currentItem) updateItem(item, itemIndex);
    }, [item, pageIndex, groupIndex, itemIndex, updateItem, currentItem]);

    useEffect(() => {
        const tooltipList = [];
        if (item.tempId) {
            tooltipList.push(new Tooltip(`.move-item-${item.tempId}-down-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.move-item-${item.tempId}-up-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.delete-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.upload-image-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.question-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.description-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.min-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.max-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.step-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.mandatory-${item.tempId}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [item.tempId]);

    const handleGalleryButtonClick = () => {
        galleryInputRef.current.click();
    };

    const insertImage = (e) => {
        const newItem = { ...item };
        newItem.files.push({ content: e.target.files[0], description: '' });
        setItem(newItem);
    };

    const removeImage = (indexToRemove) => {
        const newItem = { ...item };
        newItem.files.splice(indexToRemove, 1);
        setItem(newItem);
    };

    return (
        <div className="pb-4 pb-lg-4">
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">Item {itemIndex + 1} - Intervalo numérico</h1>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon="keyboard_arrow_down"
                        onClick={() => updateItemPlacement(item.placement + 1, item.placement, itemIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'move-item-' + item.tempId + '-down-tooltip'}
                        data-bs-title="Mover o item uma posição abaixo na ordem dos itens do grupo."
                        className={'move-item-' + item.tempId + '-down-tooltip text-white'}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon="keyboard_arrow_up"
                        onClick={() => updateItemPlacement(item.placement - 1, item.placement, itemIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'move-item-' + item.tempId + '-up-tooltip'}
                        data-bs-title="Mover o item uma posição acima na ordem dos itens do grupo."
                        className={'move-item-' + item.tempId + '-up-tooltip text-white'}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon="delete"
                        onClick={() => removeItem(itemIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'delete-' + item.tempId + '-tooltip'}
                        data-bs-title="Remover o item do grupo."
                        className={'delete-' + item.tempId + '-tooltip text-white'}
                    />
                </div>
            </div>
            <div className="form-check form-switch fs-5 mb-2">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    value={item.itemValidations.some((validation) => validation.type === 'MANDATORY' && validation.argument === true)}
                    onChange={(event) =>
                        setItem((prev) => {
                            if (event.target.checked) {
                                const newItem = { ...prev };
                                newItem.itemValidations.push({ type: 'MANDATORY', argument: true });
                                return newItem;
                            } else {
                                const newItem = { ...prev };
                                newItem.itemValidations = newItem.itemValidations.filter((validation) => validation.type !== 'MANDATORY');
                                return newItem;
                            }
                        })
                    }
                />
                <label className="form-check-label font-barlow fw-medium me-2" htmlFor="flexSwitchCheckDefault">
                    Obrigatório
                </label>
                <MaterialSymbol
                    icon="question_mark"
                    size={13}
                    weight={700}
                    fill
                    color="#FFFFFF"
                    data-bs-toggle="tooltip"
                    data-bs-custom-class={'mandatory-' + item.tempId + '-tooltip'}
                    data-bs-title="Se o usuário deverá obrigatoriamente responder a este item antes de submeter o protocolo."
                    className={'bg-steel-blue mandatory-' + item.tempId + '-tooltip p-1 rounded-circle'}
                />
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label htmlFor="question" className="form-label fs-5 fw-medium me-2">
                        Pergunta
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'question-' + item.tempId + '-tooltip'}
                        data-bs-title="Texto curto com a questão ou proposta a ser atendida. Suporta Markdown com até 3000 caracteres."
                        className={'bg-steel-blue question-' + item.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <div className="row gx-2 align-items-end">
                        <div className="col">
                            <input
                                type="text"
                                className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                id="question"
                                value={item.text || ''}
                                aria-describedby="questionHelp"
                                onChange={(event) => setItem((prev) => ({ ...prev, text: event.target.value }))}
                                minLength="3"
                                required
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[190, 46, 70]}
                                size={32}
                                icon="add_photo_alternate"
                                onClick={handleGalleryButtonClick}
                                data-bs-toggle="tooltip"
                                data-bs-custom-class={'upload-image-' + item.tempId + '-tooltip'}
                                data-bs-title="Adicione imagens ao enunciado da pergunta."
                                className={'upload-image-' + item.tempId + '-tooltip text-white'}
                            />
                        </div>
                    </div>
                    {!item.text && (
                        <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                {item.files?.length > 0 && (
                    <div className="row mb-3 mt-4 gy-4">
                        {item.files.map((file, i) => {
                            if (file?.content instanceof File || file?.path)
                                return (
                                    <div
                                        key={'item-' + item.tempId + '-image-' + file?.content?.name || file?.id}
                                        className={`col-${item.files.length > 3 ? 4 : 12 / item.files.length}`}
                                    >
                                        <div
                                            className={`${
                                                item.files.length > 1 && 'ratio ratio-1x1'
                                            } img-gallery d-flex justify-content-center border border-secondary-subtle rounded-4 position-relative`}
                                        >
                                            <img
                                                src={file.path ? file.path : URL.createObjectURL(file.content)}
                                                className="img-fluid object-fit-contain w-100 rounded-4"
                                                alt="Imagem selecionada"
                                            />
                                            <RoundedButton
                                                className="position-absolute top-0 start-100 translate-middle text-white mb-2 me-2"
                                                hsl={[190, 46, 70]}
                                                size={32}
                                                icon="delete"
                                                onClick={() => removeImage(i)}
                                            />
                                        </div>
                                    </div>
                                );
                            else {
                                removeImage(i);
                                return null;
                            }
                        })}
                    </div>
                )}
                <div className="mb-3">
                    <label htmlFor="description" className="form-label fs-5 fw-medium me-2">
                        Descrição
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'description-' + item.tempId + '-tooltip'}
                        data-bs-title="Texto que descreva outros detalhes da pergunta. Suporta Markdown com até 3000 caracteres."
                        className={'bg-steel-blue description-' + item.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <input
                        type="text"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="description"
                        value={item.description || ''}
                        onChange={(event) => setItem((prev) => ({ ...prev, description: event.target.value }))}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="interval-min" className="form-label fs-5 fw-medium me-2">
                        Início do intervalo
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'min-' + item.tempId + '-tooltip'}
                        data-bs-title="Limite inferior da barra deslizante. O valor mínimo que o usuário pode selecionar."
                        className={'bg-steel-blue min-' + item.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <input
                        type="number"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="interval-min"
                        value={item.itemValidations.find((validation) => validation.type === 'MIN').argument || ''}
                        aria-describedby="interval-min-help"
                        onChange={(event) =>
                            setItem((prev) => {
                                const newItem = { ...prev };
                                newItem.itemValidations = newItem.itemValidations.map((validation) => {
                                    if (validation.type === 'MIN') {
                                        return { ...validation, argument: event.target.value };
                                    }
                                    return validation;
                                });
                                return newItem;
                            })
                        }
                        required
                    />
                    {!item.itemValidations.find((validation) => validation.type === 'MIN').argument && (
                        <div id="interval-min-help" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="interval-max" className="form-label fs-5 fw-medium me-2">
                        Máximo do intervalo
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'max-' + item.tempId + '-tooltip'}
                        data-bs-title="Limite superior da barra deslizante. O valor máximo que o usuário pode selecionar."
                        className={'bg-steel-blue max-' + item.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <input
                        type="number"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="interval-max"
                        value={item.itemValidations.find((validation) => validation.type === 'MAX').argument || ''}
                        aria-describedby="interval-max-help"
                        onChange={(event) =>
                            setItem((prev) => {
                                const newItem = { ...prev };
                                newItem.itemValidations = newItem.itemValidations.map((validation) => {
                                    if (validation.type === 'MAX') {
                                        return { ...validation, argument: event.target.value };
                                    }
                                    return validation;
                                });
                                return newItem;
                            })
                        }
                        required
                    />
                    {!item.itemValidations.find((validation) => validation.type === 'MAX').argument && (
                        <div id="interval-max-help" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="interval-step" className="form-label fs-5 fw-medium me-2">
                        Granularidade do intervalo
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'step-' + item.tempId + '-tooltip'}
                        data-bs-title="Incremento entre os valores que o usuário pode escolher no intervalo. A barra deslizante 'salta' de acordo com este valor."
                        className={'bg-steel-blue step-' + item.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <input
                        type="number"
                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                        id="interval-step"
                        value={item.itemValidations.find((validation) => validation.type === 'STEP').argument || ''}
                        aria-describedby="interval-step-help"
                        onChange={(event) =>
                            setItem((prev) => {
                                const newItem = { ...prev };
                                newItem.itemValidations = newItem.itemValidations.map((validation) => {
                                    if (validation.type === 'STEP') {
                                        return { ...validation, argument: event.target.value };
                                    }
                                    return validation;
                                });
                                return newItem;
                            })
                        }
                        required
                    />
                    {!item.itemValidations.find((validation) => validation.type === 'STEP').argument && (
                        <div id="interval-step-help" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <input
                    type="file"
                    accept="image/*"
                    name="imageinput"
                    id="imageinput"
                    style={{ display: 'none' }}
                    onChange={insertImage}
                    ref={galleryInputRef}
                />
            </div>
            <style>{rangeStyles}</style>
        </div>
    );
}

export default CreateRangeInput;
