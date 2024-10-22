import { useCallback, useEffect, useState } from 'react';
import RoundedButton from './RoundedButton';
import CreateDependencyInput from './inputs/protocol/CreateDependencyInput';
import CreateTextBoxInput from './inputs/protocol/CreateTextBoxInput';
import CreateRangeInput from './inputs/protocol/CreateRangeInput';
import CreateMultipleInputItens from './inputs/protocol/CreateMultipleInputItens';
import { defaultNewValidation } from '../utils/constants';
import CreateValidationInput from './inputs/protocol/CreateValidationInput';
import CreateTableInput from './inputs/protocol/CreateTableInput';
import { Tooltip } from 'bootstrap';

function CreateItemGroup(props) {
    const { currentGroup, updateGroup, itemTarget, updateGroupPlacement, removeItemGroup, protocol, page, insertItem } = props;

    const [group, setGroup] = useState(currentGroup);

    useEffect(() => {
        if (group !== currentGroup) updateGroup(group, itemTarget.group);
    }, [group, itemTarget.group, updateGroup, currentGroup]);

    useEffect(() => {
        const tooltipList = [];
        if (group.tempId) {
            tooltipList.push(new Tooltip(`.move-group-${group.tempId.toString().slice(0, 13)}-down-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.move-group-${group.tempId.toString().slice(0, 13)}-up-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.delete-group-${group.tempId.toString().slice(0, 13)}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [group.tempId]);

    const updateItemValidation = useCallback((validation, item, index) => {
        setGroup((prev) => {
            const newGroup = { ...prev };
            newGroup.items[item].itemValidations[index] = validation;
            return newGroup;
        });
    }, []);

    const removeItemValidation = useCallback(
        (item, index) => {
            const newGroup = { ...group };
            newGroup.items[item].itemValidations.splice(index, 1);
            setGroup(newGroup);
        },
        [group]
    );

    const insertItemValidation = useCallback(
        (item) => {
            const newGroup = { ...group };
            newGroup.items[item].itemValidations.push(defaultNewValidation());
            setGroup(newGroup);
        },
        [group]
    );

    const updateItemPlacement = useCallback(
        (newPlacement, oldPlacement, itemIndex) => {
            if (newPlacement < 1 || newPlacement > group.items.length) return;
            const newGroup = { ...group };
            if (newPlacement > oldPlacement) {
                for (const i of newGroup.items) if (i.placement > oldPlacement && i.placement <= newPlacement) i.placement--;
            } else {
                for (const i of newGroup.items) if (i.placement >= newPlacement && i.placement < oldPlacement) i.placement++;
            }
            newGroup.items[itemIndex].placement = newPlacement;
            newGroup.items.sort((a, b) => a.placement - b.placement);
            setGroup(newGroup);
        },
        [group]
    );

    const updateItem = useCallback((item, index) => {
        setGroup((prev) => {
            const newGroup = { ...prev };
            newGroup.items[index] = item;
            return newGroup;
        });
    }, []);

    const removeItem = useCallback(
        (index) => {
            const newGroup = { ...group };
            newGroup.items.splice(index, 1);
            for (const [i, item] of newGroup.items.entries()) {
                if (i >= index) item.placement--;
            }
            setGroup(newGroup);
        },
        [group]
    );

    const updateDependency = useCallback((dependency, dependencyIndex) => {
        setGroup((prev) => {
            const newGroup = { ...prev };
            newGroup.dependencies[dependencyIndex] = dependency;
            return newGroup;
        });
    }, []);

    const removeDependency = useCallback(
        (dependencyIndex) => {
            const newGroup = { ...group };
            newGroup.dependencies.splice(dependencyIndex, 1);
            setGroup(newGroup);
        },
        [group]
    );

    const insertTableColumn = useCallback(() => {
        const newGroup = { ...group };
        newGroup.tableColumns.push({
            text: '',
            placement: newGroup.tableColumns.length + 1,
        });

        setGroup(newGroup);
    }, [group]);

    const removeTableColumn = useCallback(
        (index) => {
            const newGroup = { ...group };
            newGroup.tableColumns.splice(index, 1);

            newGroup.tableColumns = newGroup.tableColumns.map((column, newIndex) => ({
                ...column,
                placement: newIndex + 1, // Adjust placement to reflect the new index
            }));

            // Verifica se o grupo é "CHECKBOX_TABLE" ou "RADIO_TABLE"
            if (['CHECKBOX_TABLE', 'RADIO_TABLE'].includes(newGroup.type)) {
                newGroup.items?.map((item, itemIndex) => {
                    if (item.itemOptions.length > index) {
                        // Remove a opção do item correspondente ao índice da coluna removida
                        const updatedItemOptions = item.itemOptions.filter((_, optionIndex) => optionIndex !== index);

                        // Reajusta os placements das opções restantes
                        const adjustedItemOptions = updatedItemOptions.map((option, newOptionIndex) => ({
                            ...option,
                            placement: newOptionIndex + 1,
                        }));

                        const updatedItem = {
                            ...item,
                            itemOptions: adjustedItemOptions,
                        };

                        updateItem(updatedItem, itemTarget.page, group, itemIndex);

                        return updatedItem;
                    }
                    return item;
                });
            }

            setGroup(newGroup);
        },
        [group, itemTarget, updateItem]
    );

    const updateTableColumn = useCallback(
        (index, newText) => {
            const newGroup = { ...group };
            newGroup.tableColumns[index].text = newText;
            setGroup(newGroup);
        },
        [group]
    );

    return (
        <div className="mb-3" key={'group-' + itemTarget.group}>
            <div className="row gx-2 align-items-center mb-3">
                {group.type === 'ONE_DIMENSIONAL' && (
                    <div className="col-auto">
                        <p className="font-century-gothic color-steel-blue fs-3 fw-bold mb-2 m-0 p-0">
                            Grupo {Number(itemTarget.group) + 1}
                        </p>
                    </div>
                )}
                {group.type !== 'ONE_DIMENSIONAL' && (
                    <div className="col-auto">
                        <p className="font-century-gothic color-steel-blue fs-3 fw-bold mb-2 m-0 p-0">
                            {(() => {
                                switch (group.type) {
                                    case 'TEXTBOX_TABLE':
                                        return 'Tabela de texto';

                                    case 'RADIO_TABLE':
                                        return 'Tabela de escolha simples';

                                    case 'CHECKBOX_TABLE':
                                        return 'Tabela de múltipla escolha';

                                    default:
                                        return;
                                }
                            })()}
                        </p>
                    </div>
                )}
                <div className="col"></div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => updateGroupPlacement(group.placement + 1, group.placement, itemTarget.group)}
                        icon="keyboard_arrow_down"
                        className={`move-group-${group.tempId.toString().slice(0, 13)}-down-tooltip`}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={`move-group-${group.tempId}-down-tooltip`}
                        data-bs-title="Mover o grupo uma posição abaixo na ordem dos grupos da página."
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => updateGroupPlacement(group.placement - 1, group.placement, itemTarget.group)}
                        icon="keyboard_arrow_up"
                        className={`move-group-${group.tempId.toString().slice(0, 13)}-up-tooltip`}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={`move-group-${group.tempId}-up-tooltip`}
                        data-bs-title="Mover o grupo uma posição acima na ordem dos grupos da página."
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => removeItemGroup(itemTarget.group)}
                        icon="delete"
                        className={`delete-group-${group.tempId.toString().slice(0, 13)}-tooltip`}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={`delete-group-${group.tempId}-tooltip`}
                        data-bs-title="Remover o grupo da página."
                    />
                </div>
            </div>
            {group.dependencies?.map((dependency, dependencyIndex) => (
                <CreateDependencyInput
                    currentDependency={dependency}
                    dependencyIndex={dependencyIndex}
                    pageIndex={itemTarget.page}
                    groupIndex={itemTarget.group}
                    key={'page-dependency-' + dependency.tempId}
                    updateDependency={updateDependency}
                    removeDependency={removeDependency}
                    protocol={protocol}
                />
            ))}
            {group.type === 'ONE_DIMENSIONAL' && group.items?.length === 0 && (
                <div className="bg-light-grey rounded-4 p-4">
                    <p className="font-barlow fw-medium text-center fs-5 m-0">Nenhum item criado. Crie um por meio da aba Adicionar.</p>
                </div>
            )}
            {group.type === 'ONE_DIMENSIONAL' &&
                group.items?.map((item, itemIndex) => (
                    <div key={'item-' + item.tempId}>
                        {(() => {
                            switch (item.type) {
                                case 'TEXTBOX':
                                    return (
                                        <CreateTextBoxInput
                                            currentItem={item}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            itemIndex={itemIndex}
                                            updateItem={updateItem}
                                            removeItem={removeItem}
                                            updateItemPlacement={updateItemPlacement}
                                            insertItemValidation={insertItemValidation}
                                        />
                                    );
                                case 'NUMBERBOX':
                                    return (
                                        <CreateTextBoxInput
                                            currentItem={item}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            itemIndex={itemIndex}
                                            updateItem={updateItem}
                                            removeItem={removeItem}
                                            isNumberBox={true}
                                            updateItemPlacement={updateItemPlacement}
                                            insertItemValidation={insertItemValidation}
                                        />
                                    );
                                case 'RANGE':
                                    return (
                                        <CreateRangeInput
                                            currentItem={item}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            itemIndex={itemIndex}
                                            updateItem={updateItem}
                                            removeItem={removeItem}
                                            updateItemPlacement={updateItemPlacement}
                                        />
                                    );
                                case 'SELECT':
                                    return (
                                        <CreateMultipleInputItens
                                            currentItem={item}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            itemIndex={itemIndex}
                                            updateItem={updateItem}
                                            removeItem={removeItem}
                                            updateItemPlacement={updateItemPlacement}
                                            insertItemValidation={insertItemValidation}
                                        />
                                    );
                                case 'RADIO':
                                    return (
                                        <CreateMultipleInputItens
                                            currentItem={item}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            itemIndex={itemIndex}
                                            updateItem={updateItem}
                                            removeItem={removeItem}
                                            updateItemPlacement={updateItemPlacement}
                                            insertItemValidation={insertItemValidation}
                                        />
                                    );
                                case 'CHECKBOX':
                                    return (
                                        <CreateMultipleInputItens
                                            currentItem={item}
                                            pageIndex={itemTarget.page}
                                            groupIndex={itemTarget.group}
                                            itemIndex={itemIndex}
                                            updateItem={updateItem}
                                            removeItem={removeItem}
                                            updateItemPlacement={updateItemPlacement}
                                            insertItemValidation={insertItemValidation}
                                        />
                                    );
                                default:
                                    return null;
                            }
                        })()}
                        {item.itemValidations
                            ?.filter(
                                (v) =>
                                    (item.type === 'NUMBERBOX' || item.type === 'CHECKBOX' || item.type === 'TEXTBOX') &&
                                    v.type !== 'MANDATORY'
                            )
                            .map((validation, validationIndex) => (
                                <CreateValidationInput
                                    currentValidation={validation}
                                    validationIndex={validationIndex}
                                    pageIndex={itemTarget.page}
                                    groupIndex={itemTarget.group}
                                    itemIndex={itemIndex}
                                    key={'item-validation-' + validation.tempId}
                                    updateValidation={updateItemValidation}
                                    removeValidation={removeItemValidation}
                                    item={item}
                                />
                            ))}
                    </div>
                ))}
            {group.type === 'TEXTBOX_TABLE' && (
                <div className="bg-light mb-3">
                    <CreateTableInput
                        group={group}
                        page={page}
                        groupIndex={itemTarget.group}
                        pageIndex={itemTarget.page}
                        insertItem={insertItem}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        insertTableColumn={insertTableColumn}
                        updateTableColumn={updateTableColumn}
                        removeTableColumn={removeTableColumn}
                    />
                </div>
            )}
            {group.type === 'RADIO_TABLE' && (
                <div className="bg-light mb-3">
                    <CreateTableInput
                        group={group}
                        page={page}
                        groupIndex={itemTarget.group}
                        pageIndex={itemTarget.page}
                        insertItem={insertItem}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        insertTableColumn={insertTableColumn}
                        updateTableColumn={updateTableColumn}
                        removeTableColumn={removeTableColumn}
                    />
                </div>
            )}
            {group.type === 'CHECKBOX_TABLE' && (
                <div className="bg-light mb-3">
                    <CreateTableInput
                        group={group}
                        page={page}
                        groupIndex={itemTarget.group}
                        pageIndex={itemTarget.page}
                        insertItem={insertItem}
                        updateItem={updateItem}
                        removeItem={removeItem}
                        insertTableColumn={insertTableColumn}
                        updateTableColumn={updateTableColumn}
                        removeTableColumn={removeTableColumn}
                    />
                </div>
            )}
        </div>
    );
}

export default CreateItemGroup;
