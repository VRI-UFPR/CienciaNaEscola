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
import CreateDependencyInput from '../components/inputs/protocol/CreateDependencyInput';
import RoundedButton from './RoundedButton';
import CreateItemGroup from './CreateItemGroup';
import { Tooltip } from 'bootstrap';

function CreatePage(props) {
    const {
        currentPage,
        itemTarget,
        updatePagePlacement,
        removePage,
        protocol,
        updatePage,
        insertItem,
        moveItemBetweenPages,
        pagesQty,
        moveGroupBetweenPages,
    } = props;

    const [page, setPage] = useState(currentPage);
    const currentGroup = page.itemGroups[itemTarget.group];

    useEffect(() => {
        if (page !== currentPage) updatePage(page, itemTarget.page);
    }, [page, itemTarget.page, updatePage, currentPage]);

    useEffect(() => {
        const tooltipList = [];
        if (page.tempId) {
            tooltipList.push(new Tooltip(`.delete-page-${page.tempId.toString().slice(0, 13)}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [page.tempId]);

    const updateGroupPlacement = useCallback(
        (newPlacement, oldPlacement, groupIndex) => {
            if (newPlacement < 1 || newPlacement > page.itemGroups.length) return;
            const newPage = { ...page };
            if (newPlacement > oldPlacement) {
                for (const g of newPage.itemGroups) if (g.placement > oldPlacement && g.placement <= newPlacement) g.placement--;
            } else {
                for (const g of newPage.itemGroups) if (g.placement >= newPlacement && g.placement < oldPlacement) g.placement++;
            }
            newPage.itemGroups[groupIndex].placement = newPlacement;
            newPage.itemGroups.sort((a, b) => a.placement - b.placement);
            setPage(newPage);
        },
        [page]
    );

    const moveItemBetweenItemGroups = useCallback(
        (newGroupIndex, oldGroupIndex, itemIndex) => {
            if (newGroupIndex === oldGroupIndex) return;
            const newPage = { ...page };
            // Find and update the item
            const item = newPage.itemGroups[oldGroupIndex].items[itemIndex];
            item.placement = newPage.itemGroups[newGroupIndex].items.length + 1;
            // Remove the item from the old group, update the placements of the remaining items and sort them (just in case)
            newPage.itemGroups[oldGroupIndex].items.splice(itemIndex, 1);
            newPage.itemGroups[oldGroupIndex].items.sort((a, b) => a.placement - b.placement);
            for (const [i, item] of newPage.itemGroups[oldGroupIndex].items.entries()) item.placement = i + 1;
            // Add the item to the new group
            newPage.itemGroups[newGroupIndex].items.push(item);
            setPage(newPage);
        },
        [page]
    );

    const updateItemGroup = useCallback((newGroup, groupIndex) => {
        setPage((prev) => {
            const newPage = { ...prev };
            newPage.itemGroups[groupIndex] = newGroup;
            return newPage;
        });
    }, []);

    const removeItemGroup = useCallback(
        (index) => {
            const newPage = { ...page };
            newPage.itemGroups.splice(index, 1);
            for (const [i, group] of newPage.itemGroups.entries()) {
                if (i >= index) group.placement--;
            }
            setPage(newPage);
        },
        [page]
    );

    const updateDependency = useCallback((dependency, dependencyIndex) => {
        setPage((prev) => {
            const newPage = { ...prev };
            newPage.dependencies[dependencyIndex] = dependency;
            return newPage;
        });
    }, []);

    const removeDependency = useCallback(
        (dependencyIndex) => {
            const newPage = { ...page };
            newPage.dependencies.splice(dependencyIndex, 1);
            setPage(newPage);
        },
        [page]
    );

    return (
        <div className="" key={'page-' + page.tempId}>
            <div className="row g-2 align-items-center justify-content-end mb-3">
                <div className="col-auto">
                    <p className="color-grey font-century-gothic text-nowrap fw-bold fs-3 m-0">Página {Number(itemTarget.page) + 1}</p>
                </div>
                <div className="col"></div>
                <div className="col-auto">
                    <div className="col">
                        <select
                            name="item-target-page"
                            id="item-target-page"
                            value={page.placement}
                            className="form-select rounded-4 text-center text-dark bg-light-grey fs-6 fw-medium border-0"
                            onChange={(e) => updatePagePlacement(e.target.value, page.placement, itemTarget.page)}
                        >
                            <option value={''}>Página...</option>
                            {[...Array(pagesQty).keys()].map((page) => (
                                <option key={page + 1} value={page + 1}>
                                    Posição {page + 1}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => removePage(itemTarget.page)}
                        icon="delete"
                        className={`delete-page-${page.tempId.toString().slice(0, 13)}-tooltip text-white`}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={`delete-page-${page.tempId}-tooltip`}
                        data-bs-title="Remover a página do protocolo."
                    />
                </div>
            </div>
            {page.dependencies?.map((dependency, dependencyIndex) => (
                <CreateDependencyInput
                    currentDependency={dependency}
                    dependencyIndex={dependencyIndex}
                    pageIndex={itemTarget.page}
                    key={'page-dependency-' + dependency.tempId}
                    updateDependency={updateDependency}
                    removeDependency={removeDependency}
                    protocol={protocol}
                />
            ))}
            {currentGroup && (
                <CreateItemGroup
                    key={'item-group-' + currentGroup.tempId}
                    currentGroup={currentGroup}
                    updateGroup={updateItemGroup}
                    itemTarget={itemTarget}
                    updateGroupPlacement={updateGroupPlacement}
                    removeItemGroup={removeItemGroup}
                    protocol={protocol}
                    page={page}
                    insertItem={insertItem}
                    moveItemBetweenPages={moveItemBetweenPages}
                    moveGroupBetweenPages={moveGroupBetweenPages}
                    moveItemBetweenItemGroups={moveItemBetweenItemGroups}
                    pagesQty={pagesQty}
                    groupsQty={page.itemGroups.length}
                />
            )}
            {!currentGroup && (
                <div className="bg-light-grey rounded-4 p-4">
                    <p className="font-barlow fw-medium text-center fs-5 m-0">
                        Nenhum grupo selecionado. Através da aba Adicionar, crie um novo grupo com o botão "Novo grupo" ou utilize os
                        seletores na parte inferior para selecionar um grupo existente.
                    </p>
                </div>
            )}
        </div>
    );
}

export default CreatePage;
