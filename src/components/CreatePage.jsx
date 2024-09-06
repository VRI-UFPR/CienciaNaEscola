import { useCallback, useEffect, useState } from 'react';
import iconArrowUp from '../assets/images/iconArrowUp.svg';
import iconArrowDown from '../assets/images/iconArrowDown.svg';
import iconTrash from '../assets/images/iconTrash.svg';
import CreateDependencyInput from '../components/inputs/protocol/CreateDependencyInput';
import RoundedButton from './RoundedButton';
import CreateItemGroup from './CreateItemGroup';

function CreatePage(props) {
    const { currentPage, itemTarget, updatePagePlacement, removePage, protocol, updatePage } = props;

    const [page, setPage] = useState(currentPage);
    const currentGroup = page.itemGroups[itemTarget.group];

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
            <div className="row gx-2 align-items-center mb-3">
                <div className="col-auto">
                    <p className="color-grey font-century-gothic text-nowrap fw-bold fs-3 m-0">Página {Number(itemTarget.page) + 1}</p>
                </div>
                <div className="col"></div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => updatePagePlacement(page.placement + 1, page.placement, itemTarget.page)}
                        icon={iconArrowDown}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[197, 43, 52]}
                        onClick={() => updatePagePlacement(page.placement - 1, page.placement, itemTarget.page)}
                        icon={iconArrowUp}
                    />
                </div>
                <div className="col-auto">
                    <RoundedButton hsl={[197, 43, 52]} onClick={() => removePage(itemTarget.page)} icon={iconTrash} />
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
                />
            )}
        </div>
    );
}

export default CreatePage;
