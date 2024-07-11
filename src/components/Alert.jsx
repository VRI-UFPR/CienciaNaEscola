/*
Copyright (C) 2024 Laboratório Visão Robótica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import React, { useState, useImperativeHandle, forwardRef } from 'react';
import TextButton from './TextButton';
import { Modal } from 'bootstrap';

const AlertStyles = `
    .font-century-gothic {
        font-family: 'Century Gothic', sans-serif;
    }

    .bg-grey {
        background-color: #D9D9D9;
    }

    .color-dark-gray{
        color: #535353;
    }
`;

const Alert = forwardRef((props, ref) => {
    const [modal, setModal] = useState(props);

    const showModal = (modalData) => {
        if (modalData) {
            const alert = document.getElementById(modal.id);
            alert.removeEventListener('hidden.bs.modal', modal.onHide);
            if (modal.actionOnClick) {
                alert.removeEventListener('hidden.bs.modal', modal.actionOnClick);
            }

            setModal({
                id: modal.id,
                title: modalData.title || modal.title,
                description: modalData.description,
                dismissible: modalData.dismissible === undefined ? modal.dismissible : modalData.dismissible,
                dismissHsl: modalData.dismissHsl || modal.dismissHsl,
                dismissText: modalData.dismissText || modal.dismissText,
                actionHsl: modalData.actionHsl,
                actionText: modalData.actionText,
                actionOnClick: modalData.actionOnClick,
                onHide: modalData.onHide,
            });

            Modal.getOrCreateInstance(alert).show();
        }
    };

    const hideModal = (action) => {
        const alert = document.getElementById(modal.id);
        if (action) {
            alert.addEventListener('hidden.bs.modal', action);
        }
        Modal.getInstance(alert).hide();
    };

    useImperativeHandle(ref, () => ({
        showModal,
    }));

    return (
        <div className="modal fade" id={modal.id} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered p-5">
                <div className="modal-content bg-transparent border-0">
                    <div className="d-flex flex-column shadow text-break bg-white rounded-4 w-100 mx-0 p-4 py-5 p-md-5">
                        <h1
                            className={`font-century-gothic color-dark-gray text-center fs-3 fw-bold ${
                                modal.description ? 'mb-3' : 'mb-4 mb-md-5'
                            }`}
                        >
                            {modal.title}
                        </h1>
                        {modal.description && (
                            <p className="font-century-gothic color-dark-gray text-center mb-4 mb-md-5 fs-5 fw-medium">
                                {modal.description}
                            </p>
                        )}
                        <div className={`row ${modal.dismissible ? '' : 'd-none'} justify-content-center m-0`}>
                            <div className={`${modal.actionHsl ? 'col' : 'col-auto'} d-flex px-1`}>
                                <TextButton
                                    className={`p-3 ${modal.actionHsl ? '' : 'px-5'} py-md-4 fs-3`}
                                    hsl={modal.dismissHsl}
                                    text={modal.dismissText}
                                    onClick={() => hideModal(modal.onHide)}
                                />
                            </div>
                            <div className={`col ${modal.actionHsl ? 'd-flex' : 'd-none'} px-1`}>
                                <TextButton
                                    className="p-3 p-md-4 fs-3"
                                    hsl={modal.actionHsl}
                                    text={modal.actionText}
                                    onClick={() => hideModal(modal.actionOnClick)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{AlertStyles}</style>
        </div>
    );
});

Alert.defaultProps = {
    id: 'Modal',
    title: 'Você foi alertado',
    dismissible: true,
    dismissHsl: [97, 43, 70],
    dismissText: 'Ok',
};

export default Alert;
