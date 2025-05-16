import { useCallback, useEffect, useState } from 'react';
import RoundedButton from '../../RoundedButton';
import MaterialSymbol from '../../MaterialSymbol';
import { Tooltip } from 'bootstrap';

/**
 * Componente responsável por criar e gerenciar dependências entre diferentes itens dentro de um protocolo.
 * @param {Object} props - Propriedades do componente.
 * @param {Object} props.currentDependency - Objeto representando a dependência atual.
 * @param {number} props.pageIndex - Índice da página dentro do protocolo.
 * @param {number} [props.groupIndex] - Índice do grupo dentro da página (se aplicável).
 * @param {number} props.dependencyIndex - Índice da dependência dentro do grupo ou página.
 * @param {Function} props.updateDependency - Função chamada para atualizar a dependência.
 * @param {Function} props.removeDependency - Função chamada para remover a dependência.
 * @param {Object} props.protocol - Objeto representando o protocolo contendo páginas e grupos de itens.
 */
function CreateDependencyInput(props) {
    const { currentDependency, pageIndex, groupIndex, dependencyIndex, updateDependency, removeDependency, protocol } = props;
    const [dependency, setDependency] = useState(currentDependency);
    const isPageDependency = groupIndex === undefined;
    const groupIndexNumber = groupIndex === undefined ? -1 : Number(groupIndex);
    const pageIndexNumber = pageIndex === undefined ? -1 : Number(pageIndex);

    useEffect(() => {
        if (dependency !== currentDependency) updateDependency(dependency, dependencyIndex);
    }, [dependency, pageIndex, groupIndex, dependencyIndex, updateDependency, currentDependency]);

    const validateType = (dependencyType, itemType) => {
        switch (dependencyType) {
            case 'MIN':
            case 'MAX':
                return ['CHECKBOX', 'NUMBERBOX', 'TEXTBOX', 'RANGE'].includes(itemType);
            case 'OPTION_SELECTED':
                return ['SELECT', 'RADIO', 'CHECKBOX'].includes(itemType);
            case 'EXACT_ANSWER':
                return ['NUMBERBOX', 'TEXTBOX', 'RANGE'].includes(itemType);
            case 'IS_ANSWERED':
                return itemType !== 'TEXT';
            default:
                return false;
        }
    };

    const getItemTargetOptions = useCallback(() => {
        const res =
            protocol.pages.flatMap((p, i) =>
                p.itemGroups.flatMap((g, j) =>
                    g.items
                        .map((it, index) => ({ ...it, index: index + 1, pageIndex: i, groupIndex: j }))
                        .filter(
                            (it, _) =>
                                (it.pageIndex < pageIndexNumber ||
                                    (!isPageDependency && it.pageIndex === pageIndexNumber && it.groupIndex < groupIndexNumber)) &&
                                validateType(dependency.type, it.type)
                        )
                )
            ) || [];
        return res;
    }, [protocol, pageIndexNumber, groupIndexNumber, dependency.type, isPageDependency]);

    /** Configura tooltips para elementos interativos relacionados à dependência. */
    useEffect(() => {
        const tooltipList = [];
        if (dependency.tempId) {
            tooltipList.push(new Tooltip(`.delete-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
            tooltipList.push(new Tooltip(`.dependency-type-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
            if (getItemTargetOptions().length > 0) {
                if (dependency.type !== 'IS_ANSWERED') {
                    tooltipList.push(new Tooltip(`.dependency-argument-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
                }
                tooltipList.push(new Tooltip(`.dependency-target-${dependency.tempId}-tooltip`, { trigger: 'hover' }));
            }
        }

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, [dependency.tempId, getItemTargetOptions, dependency.type]);

    return (
        <div className="mb-4" key={isPageDependency ? 'page-dependency-' + dependency.tempId : 'group-dependency-' + dependency.tempId}>
            <div className="row gx-2 pb-2">
                <div className="col">
                    <h1 className="font-century-gothic text-steel-blue fs-4 fw-bold p-0 m-0">
                        Dependência {Number(dependencyIndex) + 1} (
                        {isPageDependency ? 'Página ' + (pageIndexNumber + 1) : 'Grupo ' + (groupIndexNumber + 1)})
                    </h1>
                </div>
                <div className="col-auto">
                    <RoundedButton
                        hsl={[190, 46, 70]}
                        icon="delete"
                        onClick={() => removeDependency(dependencyIndex)}
                        dataBsToggle="tooltip"
                        dataBsCustomClass={'delete-' + dependency.tempId + '-tooltip'}
                        dataBsTitle={'Remover a dependência ' + (isPageDependency ? 'da página.' : 'do grupo.')}
                        className={'delete-' + dependency.tempId + '-tooltip text-white'}
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
                        dataBsToggle="tooltip"
                        dataBsCustomClass={'dependency-type-' + dependency.tempId + '-tooltip'}
                        dataBsTitle="Qual tipo de condição deve ser atendida para que a dependência seja válida."
                        className={'bg-steel-blue dependency-type-' + dependency.tempId + '-tooltip p-1 rounded-circle'}
                    />
                    <select
                        className="form-select light-grey-input border border-steel-blue rounded-4 fs-5"
                        id="group-dependency-type"
                        value={dependency.type || ''}
                        onChange={(event) => {
                            setDependency((prev) => {
                                const newDependency = { ...prev };
                                newDependency.type = event.target.value;
                                return newDependency;
                            });
                        }}
                        required
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
                {getItemTargetOptions().length > 0 && dependency.type !== 'IS_ANSWERED' && (
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
                            dataBsToggle="tooltip"
                            dataBsCustomClass={'dependency-argument-' + dependency.tempId + '-tooltip'}
                            dataBsTitle="Dado o tipo de dependência, qual é o valor, qualidade ou quantidade que deve ser atendido."
                            className={'bg-steel-blue dependency-argument-' + dependency.tempId + '-tooltip p-1 rounded-circle'}
                        />
                        <input
                            className="form-control light-grey-input border-0 border-bottom border-steel-blue rounded-0 fs-5 lh-1 p-0"
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
                            required
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
                            dataBsToggle="tooltip"
                            dataBsCustomClass={'dependency-target-' + dependency.tempId + '-tooltip'}
                            dataBsTitle="Qual item deverá atender a condição da dependência."
                            className={'bg-steel-blue dependency-target-' + dependency.tempId + '-tooltip p-1 rounded-circle'}
                        />
                        <select
                            className="form-select light-grey-input border border-steel-blue rounded-4 fs-5"
                            id="page-dependency-target"
                            value={dependency.itemTempId || ''}
                            onChange={(event) => {
                                setDependency((prev) => {
                                    const newDependency = { ...prev };
                                    newDependency.itemTempId = event.target.value;
                                    return newDependency;
                                });
                            }}
                            required
                        >
                            <option value="">Selecione...</option>
                            {getItemTargetOptions().map((it, k) => (
                                <option key={'dependency-' + dependency.tempId + '-target-' + it.tempId + '-option'} value={it.tempId}>
                                    P{it.pageIndex + 1}G{it.groupIndex + 1}I{it.index + 1} - {it.text || 'Item sem texto'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CreateDependencyInput;
