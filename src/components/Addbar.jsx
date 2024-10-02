import React from 'react';
import ExitIcon from '../assets/images/ExitSidebarIcon.svg';
import { ReactComponent as IconPlus } from '../assets/images/iconPlus.svg';

function AddBar(props) {
    const { pageIndex, groupIndex, insertDependency, insertPage, insertItemGroup, insertItem, setItemTarget, protocol } = props;

    return (
        <div className="bg-transparent d-flex flex-column h-100">
            <div className="d-flex justify-content-end">
                <button
                    type="button"
                    className="btn btn-transparent rounded-circle border-0 d-lg-none"
                    data-bs-dismiss="offcanvas"
                    data-bs-target="#addbar"
                >
                    <img className="exit-image" src={ExitIcon} alt="Exit Addbar Icon" />
                </button>
            </div>
            <div className="d-flex bg-transparent flex-column justify-content-center h-100">
                <div className="bg-pastel-blue d-flex flex-column align-items-center rounded-start-4 px-4 py-3">
                    <h1 className="font-century-gothic fs-3 fw-bold text-white mb-1">Adicionar</h1>
                    <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">Ao protocolo</h1>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={insertPage}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Nova página</span>
                    </button>
                    <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">À página atual</h1>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItemGroup(pageIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Novo grupo</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertDependency(pageIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Dependência</span>
                    </button>
                    <h1 className="font-century-gothic fs-6 fw-bold text-white mb-3">Ao grupo atual</h1>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItem('TEXTBOX', pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Caixa de texto</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItem('NUMBERBOX', pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Caixa numérica</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItem('SELECT', pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Lista suspensa</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItem('RADIO', pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Seleção única</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItem('CHECKBOX', pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Múltipla escolha</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 mb-2 p-0"
                        onClick={() => insertItem('RANGE', pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Intervalo numérico</span>
                    </button>
                    <button
                        type="button"
                        className="btn btn-transparent shadow-none d-flex align-items-center w-100 m-0 p-0"
                        onClick={() => insertDependency(pageIndex, groupIndex)}
                    >
                        <IconPlus className="icon-plus" />
                        <span className="fs-6 fw-medium lh-1 ps-3 text-nowrap">Dependência</span>
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
        </div>
    );
}

export default AddBar;
