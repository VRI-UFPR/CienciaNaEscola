/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { useState, useEffect, useRef } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip } from 'bootstrap';

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

    .img-gallery{
        max-height: 200px;
    }
`;

function CreateMultipleInputItens(props) {
    const [title, setTitle] = useState('');
    const { currentItem, pageIndex, groupIndex, itemIndex, updateItem, removeItem, updateItemPlacement, insertItemValidation } = props;
    const [item, setItem] = useState(currentItem);
    const galleryInputRef = useRef(null);

    useEffect(() => {
        switch (item.type) {
            case 'SELECT': {
                setTitle('Lista Suspensa');
                break;
            }
            case 'RADIO': {
                setTitle('Seleção única');
                break;
            }
            case 'CHECKBOX': {
                setTitle('Múltipla escolha');
                break;
            }
            default: {
                break;
            }
        }
    }, [item.type]);

    useEffect(() => {
        if (item !== currentItem) updateItem(item, itemIndex);
    }, [item, pageIndex, groupIndex, itemIndex, updateItem, currentItem]);

    useEffect(() => {
        const tooltipList = [];
        if (item.tempId) {
            tooltipList.push(new Tooltip('.move-item-' + item.tempId + '-down-tooltip', { trigger: 'hover' }));
            tooltipList.push(new Tooltip('.move-item-' + item.tempId + '-up-tooltip', { trigger: 'hover' }));
            if (item.type === 'CHECKBOX')
                tooltipList.push(new Tooltip('.add-validation-' + item.tempId + '-tooltip', { trigger: 'hover' }));
            tooltipList.push(new Tooltip('.delete-' + item.tempId + '-tooltip', { trigger: 'hover' }));
            tooltipList.push(new Tooltip('.question-' + item.tempId + '-tooltip', { trigger: 'hover' }));
            tooltipList.push(new Tooltip('.mandatory-' + item.tempId + '-tooltip', { trigger: 'hover' }));
            tooltipList.push(new Tooltip('.upload-image-' + item.tempId + '-tooltip', { trigger: 'hover' }));
            tooltipList.push(new Tooltip('.add-option-' + item.tempId + '-tooltip', { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [item.tempId, item.type]);

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

    const updateOptionPlacement = (newPlacement, oldPlacement, optionIndex) => {
        if (newPlacement < 1 || newPlacement > item.itemOptions.length) return;
        const newItem = { ...item };
        if (newPlacement > oldPlacement) {
            for (const o of newItem.itemOptions) {
                if (o.placement > oldPlacement && o.placement <= newPlacement) o.placement--;
            }
        } else {
            for (const o of newItem.itemOptions) {
                if (o.placement >= newPlacement && o.placement < oldPlacement) o.placement++;
            }
        }
        newItem.itemOptions[optionIndex].placement = newPlacement;
        newItem.itemOptions.sort((a, b) => a.placement - b.placement);
        setItem(newItem);
    };

    const addOption = () => {
        const newItem = { ...item };
        const newPlacement = newItem.itemOptions.length + 1;
        const tempId = Math.floor(Date.now() + Math.random() * 1000);
        newItem.itemOptions.push({ text: '', placement: newPlacement, tempId: tempId });
        setItem(newItem);
    };

    const removeOption = (index) => {
        const newItem = { ...item };
        newItem.itemOptions.splice(index, 1);
        for (const [i, option] of newItem.itemOptions.entries()) if (i >= index) option.placement--;
        setItem(newItem);
    };

    const updateOption = (index, value) => {
        const newItem = { ...item };
        newItem.itemOptions[index].text = value;
        setItem(newItem);
    };

    return (
        <div className="pb-4">
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                        Item {itemIndex + 1} - {title}
                    </h1>
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
                {item.type === 'CHECKBOX' && (
                    <div className="col-auto">
                        <RoundedButton
                            hsl={[190, 46, 70]}
                            icon="checklist"
                            onClick={() => insertItemValidation(itemIndex)}
                            data-bs-toggle="tooltip"
                            data-bs-custom-class={'add-validation-' + item.tempId + '-tooltip'}
                            data-bs-title="Adicionar uma validação ao item, como mínimo, máximo, dentre outras. O usuário deverá atender a todas as validações para submeter o protocolo."
                            className={'add-validation-' + item.tempId + '-tooltip text-white'}
                        />
                    </div>
                )}
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
                                                src={
                                                    file.path
                                                        ? process.env.REACT_APP_API_URL + 'api/' + file.path
                                                        : URL.createObjectURL(file.content)
                                                }
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
                {item.itemOptions.map((data, i) => {
                    return (
                        <div key={'item-option-' + data.tempId} className="mb-3">
                            <label htmlFor={'item-option-text-' + data.tempId} className="form-label fw-medium fs-5">
                                Opção {i + 1}
                            </label>
                            <div className="row gx-2 align-items-end">
                                <div className="col">
                                    <input
                                        type="text"
                                        className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                        id={'item-option-text-' + data.tempId}
                                        value={data.text || ''}
                                        aria-describedby="questionHelp"
                                        onChange={(event) => updateOption(i, event.target.value)}
                                        required
                                    />
                                </div>
                                <div className="col-auto">
                                    <RoundedButton
                                        hsl={[190, 46, 70]}
                                        size={32}
                                        className="text-white"
                                        icon="keyboard_arrow_down"
                                        onClick={() => updateOptionPlacement(data.placement + 1, data.placement, i)}
                                    />
                                </div>
                                <div className="col-auto">
                                    <RoundedButton
                                        hsl={[190, 46, 70]}
                                        size={32}
                                        className="text-white"
                                        icon="keyboard_arrow_up"
                                        onClick={() => updateOptionPlacement(data.placement - 1, data.placement, i)}
                                    />
                                </div>
                                <div className="col-auto">
                                    <RoundedButton hsl={[190, 46, 70]} size={32} icon="delete" onClick={() => removeOption(i)} />
                                </div>
                            </div>
                            {!item.itemOptions[i] && (
                                <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                                    *Por favor, preencha esta opção
                                </div>
                            )}
                        </div>
                    );
                })}
                {item.itemOptions.length < 2 && (
                    <div id="questionHelp" className="form-text text-danger fs-6 fw-medium">
                        O campo precisa ter pelo menos duas opções!
                    </div>
                )}
                <div className="d-flex justify-content-end p-0">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        size={32}
                        icon="forms_add_on"
                        onClick={() => addOption()}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'add-option-' + item.tempId + '-tooltip'}
                        data-bs-title="Adicionar uma nova opção ao item."
                        className={'bg-steel-blue add-option-' + item.tempId + '-tooltip text-white'}
                    />
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
            <style>{styles}</style>
        </div>
    );
}

export default CreateMultipleInputItens;
