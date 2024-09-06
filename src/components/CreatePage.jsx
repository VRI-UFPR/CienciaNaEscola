import { useCallback, useEffect, useState } from 'react';
import CreateMultipleInputItens from '../components/inputs/protocol/CreateMultipleInputItens';
import CreateTextBoxInput from '../components/inputs/protocol/CreateTextBoxInput';
import CreateRangeInput from '../components/inputs/protocol/CreateRangeInput';
import iconArrowUp from '../assets/images/iconArrowUp.svg';
import iconArrowDown from '../assets/images/iconArrowDown.svg';
import iconTrash from '../assets/images/iconTrash.svg';
import CreateDependencyInput from '../components/inputs/protocol/CreateDependencyInput';
import CreateValidationInput from '../components/inputs/protocol/CreateValidationInput';
import { defaultNewValidation } from '../utils/constants';
import RoundedButton from './RoundedButton';

function CreatePage(props) {
    const { currentPage, itemTarget, updatePagePlacement, removePage, protocol, updatePage } = props;

    const [page, setPage] = useState(currentPage);

    useEffect(() => {
        if (page !== currentPage) updatePage(page, itemTarget.page);
    }, [page, itemTarget.page, updatePage, currentPage]);

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

    const updateItemPlacement = useCallback(
        (newPlacement, oldPlacement, groupIndex, itemIndex) => {
            if (newPlacement < 1 || newPlacement > page.itemGroups[groupIndex].items.length) return;
            const newPage = { ...page };
            if (newPlacement > oldPlacement) {
                for (const i of newPage.itemGroups[groupIndex].items)
                    if (i.placement > oldPlacement && i.placement <= newPlacement) i.placement--;
            } else {
                for (const i of newPage.itemGroups[groupIndex].items)
                    if (i.placement >= newPlacement && i.placement < oldPlacement) i.placement++;
            }
            newPage.itemGroups[groupIndex].items[itemIndex].placement = newPlacement;
            newPage.itemGroups[groupIndex].items.sort((a, b) => a.placement - b.placement);
            setPage(newPage);
        },
        [page]
    );

    const updateItem = useCallback((item, group, index) => {
        setPage((prev) => {
            const newPage = { ...prev };
            newPage.itemGroups[group].items[index] = item;
            return newPage;
        });
    }, []);

    const removeItem = useCallback(
        (group, index) => {
            const newPage = { ...page };
            newPage.itemGroups[group].items.splice(index, 1);
            for (const [i, item] of newPage.itemGroups[group].items.entries()) {
                if (i >= index) item.placement--;
            }
            setPage(newPage);
        },
        [page]
    );

    const removeItemGroup = useCallback(
        (index) => {
            const newPage = { ...page };
            newPage.itemGroups.splice(index, 1);
            for (const [i, group] of newPage.itemGroups.entries()) {
                if (i >= index) group.placement--;
            }
            setPage(newPage);
            // if (itemTarget.group >= newProtocol.pages[page].itemGroups.length) {
            //     if (newProtocol.pages[page].itemGroups.length > 0) {
            //         setItemTarget((prev) => ({ ...prev, group: newProtocol.pages[page].itemGroups.length - 1 }));
            //     } else {
            //         setItemTarget((prev) => ({ ...prev, group: '' }));
            //     }
            // }
        },
        [page]
    );

    const updateDependency = useCallback((dependency, groupIndex, dependencyIndex) => {
        setPage((prev) => {
            const newPage = { ...prev };
            if (groupIndex === undefined) newPage.dependencies[dependencyIndex] = dependency;
            else newPage.itemGroups[groupIndex].dependencies[dependencyIndex] = dependency;
            return newPage;
        });
    }, []);

    const removeDependency = useCallback(
        (groupIndex, dependencyIndex) => {
            const newPage = { ...page };
            if (groupIndex === undefined) newPage.dependencies.splice(dependencyIndex, 1);
            else newPage.itemGroups[groupIndex].dependencies.splice(dependencyIndex, 1);
            setPage(newPage);
        },
        [page]
    );

    const updateItemValidation = useCallback((validation, group, item, index) => {
        setPage((prev) => {
            const newPage = { ...prev };
            newPage.itemGroups[group].items[item].itemValidations[index] = validation;
            return newPage;
        });
    }, []);

    const removeItemValidation = useCallback(
        (group, item, index) => {
            const newPage = { ...page };
            newPage.itemGroups[group].items[item].itemValidations.splice(index, 1);
            setPage(newPage);
        },
        [page]
    );

    const insertItemValidation = useCallback(
        (group, item) => {
            const newPage = { ...page };
            newPage.itemGroups[group].items[item].itemValidations.push(defaultNewValidation());
            setPage(newPage);
        },
        [page]
    );

    return (
        <div className="" key={'page-' + protocol.pages[itemTarget.page].tempId}>
            <div className="row gx-2 align-items-center mb-3">
                <div className="col-auto">
                    <p className="color-grey font-century-gothic text-nowrap fw-bold fs-3 m-0">Página {Number(itemTarget.page) + 1}</p>
                </div>
                <div className="col"></div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() =>
                            updatePagePlacement(
                                protocol.pages[itemTarget.page].placement + 1,
                                protocol.pages[itemTarget.page].placement,
                                itemTarget.page
                            )
                        }
                        icon={iconArrowDown}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() =>
                            updatePagePlacement(
                                protocol.pages[itemTarget.page].placement - 1,
                                protocol.pages[itemTarget.page].placement,
                                itemTarget.page
                            )
                        }
                        icon={iconArrowUp}
                    />
                </div>
                {/* <div className="col-auto">
                                                                <RoundedButton
                                                                    hsl={[197, 43, 52]}
                                                                    onClick={() => insertDependency(itemTarget.page)}
                                                                    icon={iconDependency}
                                                                />
                                                            </div> */}
                <div className="col-auto">
                    <RoundedButton hsl={[197, 43, 52]} onClick={() => removePage(itemTarget.page)} icon={iconTrash} />
                </div>
            </div>
            {protocol.pages[itemTarget.page].dependencies?.map((dependency, dependencyIndex) => (
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
            {protocol.pages[itemTarget.page].itemGroups[itemTarget.group] && (
                <div className="mb-3" key={'group-' + itemTarget.group}>
                    <div className="row gx-2 align-items-center mb-3">
                        <div className="col-auto">
                            <p className="font-century-gothic color-steel-blue fs-3 fw-bold mb-2 m-0 p-0">
                                Grupo {Number(itemTarget.group) + 1}
                            </p>
                        </div>
                        <div className="col"></div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() =>
                                    updateGroupPlacement(
                                        protocol.pages[itemTarget.page].itemGroups[itemTarget.group].placement + 1,
                                        protocol.pages[itemTarget.page].itemGroups[itemTarget.group].placement,
                                        itemTarget.page,
                                        itemTarget.group
                                    )
                                }
                                icon={iconArrowDown}
                            />
                        </div>
                        <div className="col-auto">
                            <RoundedButton
                                hsl={[197, 43, 52]}
                                onClick={() =>
                                    updateGroupPlacement(
                                        protocol.pages[itemTarget.page].itemGroups[itemTarget.group].placement - 1,
                                        protocol.pages[itemTarget.page].itemGroups[itemTarget.group].placement,
                                        itemTarget.page,
                                        itemTarget.group
                                    )
                                }
                                icon={iconArrowUp}
                            />
                        </div>
                        {/* <div className="col-auto">
                                                                        <RoundedButton
                                                                            hsl={[197, 43, 52]}
                                                                            onClick={() =>
                                                                                insertDependency(itemTarget.page, itemTarget.group)
                                                                            }
                                                                            icon={iconDependency}
                                                                        />
                                                                    </div> */}
                        <div className="col-auto">
                            <RoundedButton hsl={[197, 43, 52]} onClick={() => removeItemGroup(itemTarget.group)} icon={iconTrash} />
                        </div>
                    </div>
                    {protocol.pages[itemTarget.page].itemGroups[itemTarget.group].dependencies?.map((dependency, dependencyIndex) => (
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
                    {protocol.pages[itemTarget.page].itemGroups[itemTarget.group].items?.map((item, itemIndex) => (
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
                </div>
            )}
        </div>
    );
}

export default CreatePage;
