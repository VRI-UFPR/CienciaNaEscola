import React, { useEffect, useRef, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import iconTrash from '../../../assets/images/iconTrash.svg';
import iconArrowUp from '../../../assets/images/iconArrowUp.svg';
import iconArrowDown from '../../../assets/images/iconArrowDown.svg';
import iconUpload from '../../../assets/images/iconUpload.svg';

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

    const handleGalleryButtonClick = () => {
        galleryInputRef.current.click();
    };

    const insertImage = (e) => {
        const newItem = { ...item };
        newItem.files.push(e.target.files[0]);
        setItem(newItem);
    };

    const removeImage = (indexToRemove) => {
        const newItem = { ...item };
        newItem.files.splice(indexToRemove, 1);
        setItem(newItem);
    };

    return (
        <div className="pb-4 pb-lg-5">
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">Item {itemIndex + 1} - Intervalo numérico</h1>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon={iconArrowDown}
                        onClick={() => updateItemPlacement(item.placement + 1, item.placement, itemIndex)}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon={iconArrowUp}
                        onClick={() => updateItemPlacement(item.placement - 1, item.placement, itemIndex)}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconUpload} onClick={handleGalleryButtonClick} />
                </div>
                <div className="col-auto">
                    <RoundedButton hsl={[190, 46, 70]} icon={iconTrash} onClick={() => removeItem(itemIndex)} />
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
                <label className="form-check-label font-barlow fw-medium" htmlFor="flexSwitchCheckDefault">
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
                        value={item.text || ''}
                        aria-describedby="questionHelp"
                        onChange={(event) => setItem((prev) => ({ ...prev, text: event.target.value }))}
                    />
                    {!item.text && (
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
                        value={item.description || ''}
                        onChange={(event) => setItem((prev) => ({ ...prev, description: event.target.value }))}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="interval-min" className="form-label fs-5 fw-medium">
                        Início do intervalo
                    </label>
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
                    />
                    {!item.itemValidations.find((validation) => validation.type === 'MIN').argument && (
                        <div id="interval-min-help" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="interval-max" className="form-label fs-5 fw-medium">
                        Máximo do intervalo
                    </label>
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
                    />
                    {!item.itemValidations.find((validation) => validation.type === 'MAX').argument && (
                        <div id="interval-max-help" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>
                <div className="mb-3">
                    <label htmlFor="interval-step" className="form-label fs-5 fw-medium">
                        Granularidade do intervalo
                    </label>
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
                    />
                    {!item.itemValidations.find((validation) => validation.type === 'STEP').argument && (
                        <div id="interval-step-help" className="form-text text-danger fs-6 fw-medium">
                            *Este campo é obrigatório.
                        </div>
                    )}
                </div>

                <div className="row m-0 mt-4">
                    {item.files?.length > 0 &&
                        item.files.map((file, i) => {
                            return (
                                <div
                                    key={'item-' + item.tempId + '-image-' + file.name}
                                    className={`col-${item.files.length > 3 ? 4 : 12 / item.files.length} m-0 px-1 px-lg-2 ${
                                        i > 2 && 'mt-2'
                                    }`}
                                >
                                    <div
                                        className={`${
                                            item.files.length > 1 && 'ratio ratio-1x1'
                                        } img-gallery d-flex justify-content-center border border-secondary-subtle rounded-4 position-relative`}
                                    >
                                        <img
                                            src={URL.createObjectURL(file)}
                                            className="img-fluid object-fit-contain w-100 rounded-4"
                                            alt="Imagem selecionada"
                                        />
                                        <RoundedButton
                                            className="position-absolute top-0 start-100 translate-middle mb-2 me-2"
                                            hsl={[190, 46, 70]}
                                            icon={iconTrash}
                                            onClick={() => removeImage(i)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
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
