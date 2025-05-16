import { useContext, useEffect, useRef, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip } from 'bootstrap';
import { AlertContext } from '../../../contexts/AlertContext';

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

/**
 * Componente responsável por criar e gerenciar um controle de entrada de intervalo.
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.currentItem - Item atual.
 * @param {number} props.pageIndex - Índice da página em que o item está localizado.
 * @param {number} props.groupIndex - Índice do grupo em que o item está localizado.
 * @param {number} props.itemIndex - Índice do item dentro do grupo.
 * @param {Function} props.updateItem - Função para atualizar um item no formulário.
 * @param {Function} props.removeItem - Função para remover um item do formulário.
 * @param {Function} props.updateItemPlacement - Função para atualizar a posição do item.
*/
function CreateRangeInput(props) {
    const {
        currentItem,
        pageIndex,
        groupIndex,
        itemIndex,
        updateItem,
        removeItem,
        updateItemPlacement,
        moveItemBetweenPages,
        moveItemBetweenItemGroups,
        pagesQty,
        groupsQty,
        itemsQty,
    } = props;
    const [item, setItem] = useState(currentItem);
    const galleryInputRef = useRef(null);
    const { showAlert } = useContext(AlertContext);

    /** Atualiza o estado do item caso haja alteração. */
    useEffect(() => {
        if (item !== currentItem) updateItem(item, itemIndex);
    }, [item, pageIndex, groupIndex, itemIndex, updateItem, currentItem]);

    /** Configura tooltips interativos para diversos botões do item. */
    useEffect(() => {
        const tooltipList = [];
        if (item.tempId) {
            tooltipList.push(new Tooltip(`.delete-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.upload-image-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.question-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.min-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.max-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.step-${item.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.mandatory-${item.tempId}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [item.tempId]);

    /** Aciona a seleção de arquivo para inserir imagens no item. */
    const handleGalleryButtonClick = () => {
        galleryInputRef.current.click();
    };

    /**
     * Insere uma nova imagem no item.
     * @param {Event} e - Evento de alteração do input de arquivo.
    */
    const insertImage = (e) => {
        const newItem = { ...item };
        newItem.files.push({ content: e.target.files[0], description: '' });
        setItem(newItem);
    };

    /**
     * Remove uma imagem do item.
     * @param {number} indexToRemove - Índice da imagem a ser removida.
    */
    const removeImage = (indexToRemove) => {
        const newItem = { ...item };
        newItem.files.splice(indexToRemove, 1);
        setItem(newItem);
    };

    return (
        <div className="pb-4 pb-lg-4">
            <div className="row g-2 pb-2 align-items-center justify-content-end">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">Item {itemIndex + 1} - Intervalo numérico</h1>
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
                    checked={item.itemValidations.some((validation) => validation.type === 'MANDATORY' && validation.argument)}
                    onChange={(event) => {
                        const newItem = {
                            ...item,
                            itemValidations:
                                event.target.checked && !item.itemValidations.some((validation) => validation.type === 'MANDATORY')
                                    ? [...item.itemValidations, { type: 'MANDATORY', argument: 'true' }] // Add mandatory validation
                                    : item.itemValidations.filter((validation) => validation.type !== 'MANDATORY'), // Remove mandatory validation
                        };
                        setItem(newItem);
                    }}
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
            <div className="row g-2 mb-2">
                <div className="col">
                    <select
                        name="item-target-page"
                        id="item-target-page"
                        value={pageIndex}
                        className="form-select rounded-4 text-center text-dark bg-light-grey fs-6 fw-medium border-0"
                        onChange={(e) => moveItemBetweenPages(e.target.value, pageIndex, groupIndex, itemIndex)}
                    >
                        {[...Array(pagesQty).keys()].map((page) => (
                            <option key={'item-page-' + (page + 1)} value={page}>
                                Página {page + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col">
                    <select
                        name="item-target-page"
                        id="item-target-page"
                        value={groupIndex}
                        className="form-select rounded-4 text-center text-dark bg-light-grey fs-6 fw-medium border-0"
                        onChange={(e) =>
                            moveItemBetweenItemGroups(e.target.value, groupIndex, itemIndex)
                                ? {}
                                : showAlert({
                                      headerText: 'Erro ao mover item',
                                      bodyText: 'O item não pode ser movido para um grupo do tipo tabela ou ao qual já pertence',
                                  })
                        }
                    >
                        {[...Array(groupsQty).keys()].map((group) => (
                            <option key={'item-group-' + (group + 1)} value={group}>
                                Grupo {group + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="col">
                    <select
                        name="item-target-page"
                        id="item-target-page"
                        value={item.placement}
                        className="form-select rounded-4 text-center text-dark bg-light-grey fs-6 fw-medium border-0"
                        onChange={(e) => updateItemPlacement(e.target.value, item.placement, itemIndex)}
                    >
                        {[...Array(itemsQty).keys()].map((placement) => (
                            <option key={'item-placement-' + (placement + 1)} value={placement + 1}>
                                Posição {placement + 1}
                            </option>
                        ))}
                    </select>
                </div>
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
                            <textarea
                                type="text"
                                className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                                id="question"
                                value={item.text || ''}
                                aria-describedby="questionHelp"
                                onChange={(event) => setItem((prev) => ({ ...prev, text: event.target.value }))}
                                minLength="3"
                                rows="4"
                                required
                            ></textarea>
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
                            if (file?.path || file?.content instanceof File)
                                return (
                                    <div
                                        key={'item-' + item.tempId + '-image-' + file?.id || file?.content?.name}
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
