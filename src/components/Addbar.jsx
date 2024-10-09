import { Tooltip } from 'bootstrap';
import React, { useEffect } from 'react';
import { MaterialSymbol } from 'react-material-symbols';

const style = `
    .btn-addbar:hover {
        background-color: rgba(255, 255, 255, 0.5);
    }
`;

function AddBar(props) {
    const { pageIndex, groupIndex, insertDependency, insertPage, insertItemGroup, insertItem, insertTable, setItemTarget, protocol } =
        props;

    useEffect(() => {
        const tooltipList = [];
        tooltipList.push(new Tooltip('.add-page-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-group-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-page-dependency-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-textbox-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-numberbox-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-select-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-radio-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-checkbox-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-range-tooltip', { trigger: 'hover' }));
        tooltipList.push(new Tooltip('.add-group-dependency-tooltip', { trigger: 'hover' }));

        return () => {
            tooltipList.forEach((tooltip) => tooltip.dispose());
        };
    }, []);

    return (
        <div className="bg-transparent d-flex flex-column h-100">
            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-addbar btn-transparent rounded-circle border-0 m-3 p-0 d-lg-none"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#addbar"
                >
                    <MaterialSymbol icon="close" size={24} weight={700} fill color="#FFFFFF" />
                </button>
            </div>
            <div className="d-flex bg-transparent flex-column justify-content-center h-100">
                <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-start-4 p-0 py-3">
                    <h1 className="font-century-gothic fs-3 fw-bold text-white mb-1">Adicionar</h1>
                    <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">Ao protocolo</h1>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-page-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={insertPage}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-page-tooltip"
                        data-bs-title="Uma página organiza grupos de itens e define a paginação que o usuário respondendo o protocolo verá. O respondente poderá navegar entre as páginas do protocolo sequencialmente. A submissão sempre ocorrerá na última página."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Nova página</span>
                    </button>
                    <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">À página atual</h1>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-group-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItemGroup('ONE_DIMENSIONAL', pageIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-group-tooltip"
                        data-bs-title="Um grupo organiza itens dentro de uma página. O usuário respondendo o protocolo não verá os grupos diretamente, mas este é útil para definir condicionais e repetições dentro de uma mesma página."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Novo grupo</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-page-dependency-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertDependency(pageIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-page-dependency-tooltip"
                        data-bs-title="Uma dependência define condições para que a página seja mostrada para o usuário que está respondendo: uma resposta anterior específica, uma opção específica selecionada, dentre outras."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Dependência</span>
                    </button>
                    <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">Ao grupo atual</h1>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-textbox-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItem('TEXTBOX', pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-textbox-tooltip"
                        data-bs-title="Um item que é mostrado para o usuário como uma caixa de texto para ser preenchida manualmente com texto escrito."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Caixa de texto</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-numberbox-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItem('NUMBERBOX', pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-numberbox-tooltip"
                        data-bs-title="Um item que é mostrado para o usuário como uma caixa de texto para ser preenchida manualmente com um número."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Caixa numérica</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-select-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItem('SELECT', pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-select-tooltip"
                        data-bs-title="Um item que é mostrado para o usuário como uma lista dropdown de opções para que seja selecionada uma única."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Lista suspensa</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-radio-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItem('RADIO', pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-radio-tooltip"
                        data-bs-title="Um item que é mostrado para o usuário como uma lista de botões de opção para que seja selecionado um único."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Seleção única</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-checkbox-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItem('CHECKBOX', pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-checkbox-tooltip"
                        data-bs-title="Um item que é mostrado para o usuário como uma lista de caixas de seleção para que sejam selecionadas uma ou mais."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Múltipla escolha</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-range-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertItem('RANGE', pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-range-tooltip"
                        data-bs-title="Um item que é mostrado para o usuário como uma barra horizontal deslizante para que seja selecionado um valor numérico dentro de um intervalo."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Intervalo numérico</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertTable('TEXTBOX_TABLE', pageIndex)}
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Tabela de texto</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertTable('RADIO_TABLE', pageIndex)}
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Tabela de escolha simples</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0 px-4"
                        onClick={() => insertTable('CHECKBOX_TABLE', pageIndex)}
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Tabela de múltipla escolha</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-addbar rounded-0 add-group-dependency-tooltip btn-transparent shadow-none d-flex align-items-center w-100 m-0 p-0 px-4"
                        onClick={() => insertDependency(pageIndex, groupIndex)}
                        data-bs-toggle="tooltip"
                        data-bs-custom-class="add-group-dependency-tooltip"
                        data-bs-title="Uma dependência define condições para que o grupo seja mostrado para o usuário que está respondendo: uma resposta anterior específica, uma opção específica selecionada, dentre outras."
                    >
                        <MaterialSymbol icon="add" size={24} weight={700} fill color="#FFFFFF" />
                        <span className="fs-6 fw-medium lh-1 ps-1 text-nowrap">Dependência</span>
                    </button>
                </div>
                <div className="w-100 mt-2 px-3">
                    <select
                        name="item-target-page"
                        id="item-target-page"
                        value={pageIndex}
                        className="form-select rounded-4 text-center text-white bg-steel-blue fs-6 fw-medium border-0"
                        onChange={(e) => setItemTarget((prev) => ({ group: '', page: e.target.value }))}
                    >
                        <option value={''}>Página...</option>
                        {protocol.pages.map((page, index) => (
                            <option key={'page-' + page.tempId + '-option'} value={index}>
                                Página {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="w-100 mt-2 px-3">
                    <select
                        name="item-target-group"
                        id="item-target-group"
                        value={groupIndex}
                        onChange={(e) => setItemTarget((prev) => ({ ...prev, group: e.target.value }))}
                        className="form-select rounded-4 text-center text-white bg-steel-blue fs-6 fw-medium border-0"
                    >
                        <option value={''}>Grupo...</option>
                        {protocol.pages[pageIndex]?.itemGroups.map((group, index) => (
                            <option key={'group-' + group.tempId + '-option'} value={index}>
                                Grupo {index + 1}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <style>{style}</style>
        </div>
    );
}

export default AddBar;
