import { useCallback, useEffect, useState } from 'react';
import RoundedButton from './RoundedButton';
import iconArrowDown from '../assets/images/iconArrowDown.svg';
import iconArrowUp from '../assets/images/iconArrowUp.svg';
import iconTrash from '../assets/images/iconTrash.svg';
import CreateDependencyInput from './inputs/protocol/CreateDependencyInput';
import CreateTextBoxInput from './inputs/protocol/CreateTextBoxInput';
import CreateRangeInput from './inputs/protocol/CreateRangeInput';
import CreateMultipleInputItens from './inputs/protocol/CreateMultipleInputItens';
import { defaultNewValidation } from '../utils/constants';
import CreateValidationInput from './inputs/protocol/CreateValidationInput';

function CreateItemGroup(props) {
    const { currentGroup, updateGroup, itemTarget, updateGroupPlacement, removeItemGroup, protocol } = props;

    const [group, setGroup] = useState(currentGroup);

    useEffect(() => {
        if (group !== currentGroup) updateGroup(group, itemTarget.group);
    }, [group, itemTarget.group, updateGroup, currentGroup]);

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

    return (
        <div className="mb-3" key={'group-' + itemTarget.group}>
            <div className="row gx-2 align-items-center mb-3">
                <div className="col-auto">
                    <p className="font-century-gothic color-steel-blue fs-3 fw-bold mb-2 m-0 p-0">Grupo {Number(itemTarget.group) + 1}</p>
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
                                (item.type === 'NUMBERBOX' || item.type === 'CHECKBOX' || item.type === 'TEXTBOX') && v.type !== 'MANDATORY'
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
    );
}

export default CreateItemGroup;
