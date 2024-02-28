import React, { useState, useImperativeHandle, forwardRef } from 'react';
import TextButton from './TextButton';
import { Modal } from 'bootstrap';

const endProtocolAlertStyles = `
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
                    <div className="d-flex flex-column shadow bg-white rounded-4 w-100 mx-0 p-4 py-5 p-md-5">
                        <h1 className="font-century-gothic color-dark-gray text-center mb-4 mb-md-5 fs-3 fw-bold">{modal.title}</h1>

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
            <style>{endProtocolAlertStyles}</style>
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
