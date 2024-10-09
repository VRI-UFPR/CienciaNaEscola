import React, { useCallback, useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import { MaterialSymbol } from 'react-material-symbols';
import { Tooltip } from 'bootstrap';

function CreateDependencyInput(props) {
    const { currentDependency, pageIndex, groupIndex, dependencyIndex, updateDependency, removeDependency, protocol } = props;
    const [dependency, setDependency] = useState(currentDependency);
    const isPageDependency = groupIndex === undefined;

    useEffect(() => {
        if (dependency !== currentDependency) updateDependency(dependency, dependencyIndex);
    }, [dependency, pageIndex, groupIndex, dependencyIndex, updateDependency, currentDependency]);

    const getItemTargetOptions = useCallback(() => {
        if (isPageDependency) {
            const res =
                protocol.pages
                    .filter((p, i) => i < pageIndex)
                    .flatMap((p, i) =>
                        p.itemGroups.flatMap((g, j) =>
                            g.items.filter(
                                (it, k) =>
                                    ((dependency.type === 'MIN' || dependency.type === 'MAX') &&
                                        (it.type === 'CHECKBOX' ||
                                            it.type === 'NUMBERBOX' ||
                                            it.type === 'TEXTBOX' ||
                                            it.type === 'RANGE')) ||
                                    (dependency.type === 'OPTION_SELECTED' &&
                                        (it.type === 'SELECT' || it.type === 'RADIO' || it.type === 'CHECKBOX')) ||
                                    (dependency.type === 'EXACT_ANSWER' &&
                                        (it.type === 'NUMBERBOX' || it.type === 'TEXTBOX' || it.type === 'RANGE')) ||
                                    dependency.type === 'IS_ANSWERED'
                            )
                        )
                    ) || [];
            return res;
        } else {
            const res =
                protocol.pages
                    .filter((p, i) => i <= pageIndex)
                    .flatMap((p, i) =>
                        p.itemGroups
                            .filter((g, j) => i < pageIndex || (i === pageIndex && j < groupIndex))
                            .flatMap((g, j) =>
                                g.items.filter(
                                    (it, k) =>
                                        ((dependency.type === 'MIN' || dependency.type === 'MAX') &&
                                            (it.type === 'CHECKBOX' ||
                                                it.type === 'NUMBERBOX' ||
                                                it.type === 'TEXTBOX' ||
                                                it.type === 'RANGE')) ||
                                        (dependency.type === 'OPTION_SELECTED' &&
                                            (it.type === 'SELECT' || it.type === 'RADIO' || it.type === 'CHECKBOX')) ||
                                        (dependency.type === 'EXACT_ANSWER' &&
                                            (it.type === 'NUMBERBOX' || it.type === 'TEXTBOX' || it.type === 'RANGE')) ||
                                        dependency.type === 'IS_ANSWERED'
                                )
                            )
                    ) || [];
            return res;
        }
    }, [protocol, pageIndex, groupIndex, dependency.type, isPageDependency]);

    useEffect(() => {
        const tooltipList = [];
        if (dependency.tempId) {
            tooltipList.push(new Tooltip(`.delete-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.dependency-type-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
            if (getItemTargetOptions().length > 0) {
                tooltipList.push(new Tooltip(`.dependency-argument-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
                tooltipList.push(new Tooltip(`.dependency-target-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
            }
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [dependency.tempId, getItemTargetOptions]);

    return (
        <div className="mb-4" key={isPageDependency ? 'page-dependency-' + dependency.tempId : 'group-dependency-' + dependency.tempId}>
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                        Dependência {Number(dependencyIndex) + 1} (
                        {isPageDependency ? 'Página ' + (Number(pageIndex) + 1) : 'Grupo ' + (Number(groupIndex) + 1)})
                    </h1>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon="delete"
                        onClick={() => removeDependency(dependencyIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'delete-' + dependency.tempId + '-tooltip'}
                        data-bs-title={'Remover a dependência ' + (isPageDependency ? 'da página.' : 'do grupo.')}
                        className={'delete-' + dependency.tempId + '-tooltip'}
                    />
                </div>
            </div>
            <div className="bg-light-grey rounded-4 lh-1 w-100 p-4">
                <div className="mb-3">
                    <label
                        className="form-label fs-5 fw-medium me-2"
                        htmlFor={(isPageDependency ? 'page-dependency-type-' : 'group-dependency-type') + dependency.tempId}
                    >
                        Tipo de dependência
                    </label>
                    <MaterialSymbol
                        icon="question_mark"
                        size={13}
                        weight={700}
                        fill
                        color="#FFFFFF"
                        data-bs-toggle="tooltip"
                        data-bs-custom-class={'dependency-type-' + dependency.tempId + '-tooltip'}
                        data-bs-title="Qual tipo de condição deve ser atendida para que a dependência seja válida."
                        className={'bg-steel-blue dependency-type-' + dependency.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <select
                        className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                        id="group-dependency-type"
                        value={dependency.type || ''}
                        onChange={(event) => {
                            setDependency((prev) => {
                                const newDependency = { ...prev };
                                newDependency.type = event.target.value;
                                return newDependency;
                            });
                        }}
                    >
                        <option value="">Selecione...</option>
                        <option value="IS_ANSWERED">Resposta obrigatória</option>
                        <option value="EXACT_ANSWER">Resposta exata</option>
                        <option value="OPTION_SELECTED">Opção selecionada</option>
                        <option value="MIN">Mínimo (numérico, caracteres ou opções)</option>
                        <option value="MAX">Máximo (numérico, caracteres ou opções)</option>
                    </select>
                    {getItemTargetOptions().length === 0 && dependency.type !== '' && (
                        <div className="form-text text-danger fs-6 fw-medium">
                            *Não há itens anteriores compatíveis com esse tipo de dependência. Crie itens ou selecione outro tipo de
                            dependência.
                        </div>
                    )}
                </div>
                {getItemTargetOptions().length > 0 && (
                    <div className="mb-3">
                        <label
                            className="form-label fs-5 fw-medium me-2"
                            htmlFor={(isPageDependency ? 'page-dependency-argument-' : 'group-dependency-argument') + dependency.tempId}
                        >
                            Argumento
                        </label>
                        <MaterialSymbol
                            icon="question_mark"
                            size={13}
                            weight={700}
                            fill
                            color="#FFFFFF"
                            data-bs-toggle="tooltip"
                            data-bs-custom-class={'dependency-argument-' + dependency.tempId + '-tooltip'}
                            data-bs-title="Dado o tipo de dependência, qual é o valor, qualidade ou quantidade que deve ser atendido."
                            className={'bg-steel-blue dependency-argument-' + dependency.tempId + '-tooltip p-1 rounded-circle'}
                        />
                        <input
                            className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                            id="page-dependency-argument"
                            type={dependency.type === 'MIN' || dependency.type === 'MAX' ? 'number' : 'text'}
                            value={dependency.argument || ''}
                            onChange={(event) => {
                                setDependency((prev) => {
                                    const newDependency = { ...prev };
                                    newDependency.argument = event.target.value;
                                    return newDependency;
                                });
                            }}
                        />
                    </div>
                )}
                {getItemTargetOptions().length > 0 && (
                    <div className="mb-3">
                        <label
                            className="form-label fs-5 fw-medium me-2"
                            htmlFor={(isPageDependency ? 'page-dependency-target-' : 'group-dependency-target') + dependency.tempId}
                        >
                            Alvo da dependência
                        </label>
                        <MaterialSymbol
                            icon="question_mark"
                            size={13}
                            weight={700}
                            fill
                            color="#FFFFFF"
                            data-bs-toggle="tooltip"
                            data-bs-custom-class={'dependency-target-' + dependency.tempId + '-tooltip'}
                            data-bs-title="Qual item deverá atender a condição da dependência."
                            className={'bg-steel-blue dependency-target-' + dependency.tempId + '-tooltip p-1 rounded-circle'}
                        />
                        <select
                            className="form-select bg-transparent border border-steel-blue rounded-4 fs-5"
                            id="page-dependency-target"
                            value={dependency.itemTempId || ''}
                            onChange={(event) => {
                                setDependency((prev) => {
                                    const newDependency = { ...prev };
                                    newDependency.itemTempId = event.target.value;
                                    return newDependency;
                                });
                            }}
                        >
                            <option value="">Selecione...</option>
                            {getItemTargetOptions().map((it, k) => (
                                <option key={'dependency-' + dependency.tempId + '-target-' + it.tempId + '-option'} value={it.tempId}>
                                    {k + 1} - {it.text || 'Item sem texto'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {getItemTargetOptions().length > 0 && (
                    <div>
                        <label
                            className="form-label fs-5 fw-medium"
                            htmlFor={
                                (isPageDependency ? 'page-dependency-custom-message-' : 'group-dependency-custom-message') +
                                dependency.tempId
                            }
                        >
                            Mensagem personalizada
                        </label>
                        <input
                            className="form-control bg-transparent border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
                            id="page-dependency-custom-message"
                            type="text"
                            value={dependency.customMessage || ''}
                            onChange={(event) => {
                                setDependency((prev) => {
                                    const newDependency = { ...prev };
                                    newDependency.customMessage = event.target.value;
                                    return newDependency;
                                });
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateDependencyInput;
