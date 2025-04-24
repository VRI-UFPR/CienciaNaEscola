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

/**
 * Componente responsável por gerenciar uma página.
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.currentPage - Dados da página atual.
 * @param {Object} props.itemTarget - Informações sobre o item de destino para atualizações.
 * @param {Function} props.updatePagePlacement - Função para alterar a posição da página.
 * @param {Function} props.removePage - Função para remover a página.
 * @param {Object} props.protocol - Dados do protocolo ao qual a página pertence.
 * @param {Function} props.updatePage - Função para atualizar os dados da página.
 * @param {Function} props.insertItem - Função para inserir um novo item na página.
*/
function CreatePage(props) {
    const { currentPage, itemTarget, updatePagePlacement, removePage, protocol, updatePage, insertItem } = props;

    const [page, setPage] = useState(currentPage);
    const currentGroup = page.itemGroups[itemTarget.group];

    useEffect(() => {
        if (page !== currentPage) updatePage(page, itemTarget.page);
    }, [page, itemTarget.page, updatePage, currentPage]);

    /** Efeito para inicializar tooltips ao montar o componente. */
    useEffect(() => {
        const tooltipList = [];
        if (page.tempId) {
            tooltipList.push(new Tooltip(`.move-page-${page.tempId.toString().slice(0, 13)}-down-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.move-page-${page.tempId.toString().slice(0, 13)}-up-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.delete-page-${page.tempId.toString().slice(0, 13)}-tooltip`, { trigger: 'hover' }));
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [page.tempId]);

    /**
     * Atualiza a posição de um grupo dentro da página.
     * @param {number} newPlacement - Nova posição desejada.
     * @param {number} oldPlacement - Posição original do grupo.
     * @param {number} groupIndex - Índice do grupo dentro da página.
    */
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

    /**
     * Atualiza um grupo de itens dentro da página.
     * @param {Object} newGroup - Novo estado do grupo.
     * @param {number} groupIndex - Índice do grupo dentro da página.
    */
    const updateItemGroup = useCallback((newGroup, groupIndex) => {
        setPage((prev) => {
            const newPage = { ...prev };
            newPage.itemGroups[groupIndex] = newGroup;
            return newPage;
        });
    }, []);

    /**
     * Remove um grupo de itens da página.
     * @param {number} index - Índice do grupo a ser removido.
    */
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

    /**
     * Atualiza uma dependência dentro da página.
     * @param {Object} dependency - Nova configuração da dependência.
     * @param {number} dependencyIndex - Índice da dependência dentro da página.
    */
    const updateDependency = useCallback((dependency, dependencyIndex) => {
        setPage((prev) => {
            const newPage = { ...prev };
            newPage.dependencies[dependencyIndex] = dependency;
            return newPage;
        });
    }, []);

    /**
     * Remove uma dependência da página.
     * @param {number} dependencyIndex - Índice da dependência a ser removida dentro da página.
    */
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
            <div className="row gx-2 align-items-center mb-3">
                <div className="col-auto">
                    <p className="color-grey font-century-gothic text-nowrap fw-bold fs-3 m-0">Página {Number(itemTarget.page) + 1}</p>
                </div>
                <div className="col"></div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => updatePagePlacement(page.placement + 1, page.placement, itemTarget.page)}
                        icon="keyboard_arrow_down"
                        className={`move-page-${page.tempId.toString().slice(0, 13)}-down-tooltip`}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={`move-page-${page.tempId}-down-tooltip`}
                        data-bs-title="Mover a página uma posição abaixo na ordem das páginas do protocolo."
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => updatePagePlacement(page.placement - 1, page.placement, itemTarget.page)}
                        icon="keyboard_arrow_up"
                        className={`move-page-${page.tempId.toString().slice(0, 13)}-up-tooltip`}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={`move-page-${page.tempId}-up-tooltip`}
                        data-bs-title="Mover a página uma posição acima na ordem das páginas do protocolo."
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => removePage(itemTarget.page)}
                        icon="delete"
                        className={`delete-page-${page.tempId.toString().slice(0, 13)}-tooltip`}
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
