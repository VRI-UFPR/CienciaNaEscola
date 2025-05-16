/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

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

/**
 * Componente responsável por gerenciar um grupo de itens dentro de um formulário dinâmico.
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.currentGroup - Dados do grupo de itens atual.
 * @param {Function} props.updateGroup - Função para atualizar os dados do grupo.
 * @param {Object} props.itemTarget - Informações sobre o item de destino para atualizações.
 * @param {Function} props.updateGroupPlacement - Função para alterar a posição do grupo.
 * @param {Function} props.removeItemGroup - Função para remover um item do grupo.
 * @param {Object} props.protocol - Dados do protocolo ao qual o grupo pertence.
 * @param {Object} props.page - Dados da página onde o grupo está localizado.
 * @param {Function} props.insertItem - Função para inserir um novo item no grupo.
*/
function CreateItemGroup(props) {
    const {
        currentGroup,
        updateGroup,
        itemTarget,
        updateGroupPlacement,
        removeItemGroup,
        protocol,
        page,
        insertItem,
        moveItemBetweenPages,
        moveItemBetweenItemGroups,
        pagesQty,
        groupsQty,
        moveGroupBetweenPages,
    } = props;
    const [group, setGroup] = useState(currentGroup);

    useEffect(() => {
        if (group !== currentGroup) updateGroup(group, itemTarget.group);
    }, [group, itemTarget.group, updateGroup, currentGroup]);

    /** Efeito para inicializar tooltips ao montar o componente. */
    useEffect(() => {
        const tooltipList = [];
        if (group.tempId) {
            tooltipList.push(new Tooltip(`.delete-group-${group.tempId.toString().slice(0, 13)}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [group.tempId]);

    /**
     * Atualiza a validação de um item dentro do grupo.
     * @param {Object} validation - Dados da validação.
     * @param {number} item - Índice do item dentro do grupo.
     * @param {number} index - Índice da validação dentro do item.
    */
    const updateItemValidation = useCallback((validation, item, index) => {
        setGroup((prev) => {
            const newGroup = { ...prev };
            newGroup.items[item].itemValidations[index] = validation;
            return newGroup;
        });
    }, []);

    /**
     * Remove uma validação específica de um item dentro do grupo.
     * @param {number} item - Índice do item dentro do grupo.
     * @param {number} index - Índice da validação dentro do item.
    */
    const removeItemValidation = useCallback(
        (item, index) => {
            const newGroup = { ...group };
            newGroup.items[item].itemValidations.splice(index, 1);
            setGroup(newGroup);
        },
        [group]
    );

    /**
     * Insere uma nova validação para um item dentro do grupo.
     * @param {number} item - Índice do item dentro do grupo.
    */
    const insertItemValidation = useCallback(
        (item) => {
            const newGroup = { ...group };
            newGroup.items[item].itemValidations.push(defaultNewValidation());
            setGroup(newGroup);
        },
        [group]
    );

    /**
     * Atualiza a posição de um item dentro do grupo.
     * @param {number} newPlacement - Nova posição desejada.
     * @param {number} oldPlacement - Posição original do item.
     * @param {number} itemIndex - Índice do item dentro do grupo.
    */
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

    /**
     * Atualiza um item específico dentro do grupo.
     * @param {Object} item - Novo estado do item.
     * @param {number} index - Índice do item dentro do grupo.
    */
    const updateItem = useCallback((item, index) => {
        setGroup((prev) => {
            const newGroup = { ...prev };
            newGroup.items[index] = item;
            return newGroup;
        });
    }, []);

    /**
     * Remove um item específico do grupo.
     * @param {number} index - Índice do item a ser removido.
    */
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

    /**
     * Atualiza uma dependência do grupo.
     * @param {Object} dependency - Nova configuração da dependência.
     * @param {number} dependencyIndex - Índice da dependência dentro do grupo.
    */
    const updateDependency = useCallback((dependency, dependencyIndex) => {
        setGroup((prev) => {
            const newGroup = { ...prev };
            newGroup.dependencies[dependencyIndex] = dependency;
            return newGroup;
        });
    }, []);

    /**
     * Remove uma dependência do grupo.
     * @param {number} dependencyIndex - Índice da dependência dentro do grupo.
    */
    const removeDependency = useCallback(
        (dependencyIndex) => {
            const newGroup = { ...group };
            newGroup.dependencies.splice(dependencyIndex, 1);
            setGroup(newGroup);
        },
        [group]
    );

    /** Adiciona uma nova coluna à tabela do grupo. */
    const insertTableColumn = useCallback(() => {
        const newGroup = { ...group };
        newGroup.tableColumns.push({
            text: '',
            placement: newGroup.tableColumns.length + 1,
        });

        setGroup(newGroup);
    }, [group]);

    /**
     * Remove uma coluna específica da tabela do grupo.
     * @param {number} index - Índice da coluna a ser removida.
    */
    const removeTableColumn = useCallback(
        (index) => {
            const newGroup = { ...group };
            newGroup.tableColumns.splice(index, 1);

            newGroup.tableColumns = newGroup.tableColumns.map((column, newIndex) => ({
                ...column,
                placement: newIndex + 1, // Adjust placement to reflect the new index
            }));

            setGroup(newGroup);
        },
        [group]
    );

    /**
     * Atualiza o texto de uma coluna da tabela do grupo.
     * @param {number} index - Índice da coluna dentro da tabela.
     * @param {string} newText - Novo texto da coluna.
    */
    const updateTableColumn = useCallback(
        (index, newText) => {
            const newGroup = { ...group };
            newGroup.tableColumns[index].text = newText;
            setGroup(newGroup);
        },
        [group]
    );

    return (
        <div className="mb-3">
            <div className="row g-2 align-items-center mb-3 justify-content-end">
                {group.type === 'ONE_DIMENSIONAL' && (
                    <div className="col-auto">
                        <p className="font-century-gothic color-steel-blue fs-3 fw-bold m-0 p-0">Grupo {Number(itemTarget.group) + 1}</p>
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
                    <div className="col">
                        <select
                            name="item-target-page"
                            id="item-target-page"
                            value={group.placement}
                            className="form-select rounded-4 text-center text-dark bg-light-grey fs-6 fw-medium border-0"
                            onChange={(e) => updateGroupPlacement(e.target.value, group.placement, itemTarget.group)}
                        >
                            {[...Array(groupsQty).keys()].map((placement) => (
                                <option key={'item-group-placement-' + (placement + 1)} value={placement + 1}>
                                    Posição {placement + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-auto">
                    <div className="col">
                        <select
                            name="item-target-page"
                            id="item-target-page"
                            value={itemTarget.page}
                            className="form-select rounded-4 text-center text-dark bg-light-grey fs-6 fw-medium border-0"
                            onChange={(e) => moveGroupBetweenPages(e.target.value, itemTarget.page, itemTarget.group)}
                        >
                            {[...Array(pagesQty).keys()].map((page) => (
                                <option key={'item-group-page-' + (page + 1)} value={page}>
                                    Página {page + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => removeItemGroup(itemTarget.group)}
                        icon="delete"
                        className={`delete-group-${group.tempId.toString().slice(0, 13)}-tooltip text-white`}
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
                    key={'page-dependency-' + dependency.tempId + '-' + dependencyIndex}
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
                    <div key={'item-' + item.tempId + '-' + itemIndex}>
                        {(() => {
                            switch (item.type) {
                                case 'TEXTBOX':
                                case 'TEXT':
                                case 'UPLOAD':
                                case 'NUMBERBOX':
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
                                            moveItemBetweenPages={moveItemBetweenPages}
                                            moveItemBetweenItemGroups={moveItemBetweenItemGroups}
                                            pagesQty={pagesQty}
                                            groupsQty={groupsQty}
                                            itemsQty={group.items.length}
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
                                            insertItemValidation={insertItemValidation}
                                            moveItemBetweenPages={moveItemBetweenPages}
                                            moveItemBetweenItemGroups={moveItemBetweenItemGroups}
                                            pagesQty={pagesQty}
                                            groupsQty={groupsQty}
                                            itemsQty={group.items.length}
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
                                            moveItemBetweenPages={moveItemBetweenPages}
                                            moveItemBetweenItemGroups={moveItemBetweenItemGroups}
                                            pagesQty={pagesQty}
                                            groupsQty={groupsQty}
                                            itemsQty={group.items.length}
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
                                            moveItemBetweenPages={moveItemBetweenPages}
                                            moveItemBetweenItemGroups={moveItemBetweenItemGroups}
                                            pagesQty={pagesQty}
                                            groupsQty={groupsQty}
                                            itemsQty={group.items.length}
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
                                            moveItemBetweenPages={moveItemBetweenPages}
                                            moveItemBetweenItemGroups={moveItemBetweenItemGroups}
                                            pagesQty={pagesQty}
                                            groupsQty={groupsQty}
                                            itemsQty={group.items.length}
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
                                    key={'item-validation-' + validation.tempId + '-' + validationIndex}
                                    updateItemValidation={updateItemValidation}
                                    removeValidation={removeItemValidation}
                                    item={item}
                                />
                            ))}
                    </div>
                ))}
            {(group.type === 'TEXTBOX_TABLE' || group.type === 'RADIO_TABLE' || group.type === 'CHECKBOX_TABLE') && (
                <div className="mb-3">
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
