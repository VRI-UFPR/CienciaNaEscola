import React from 'react';
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

const hideModal = (id) => {
    Modal.getInstance(document.getElementById(id)).hide();
};

const hideAndAction = (id, action) => {
    hideModal(id);
    action();
};

function EndProtocolAlert(props) {
    const { title, id, dismissHsl, dismissText, actionHsl, actionOnClick, actionText } = props;
    return (
        <div className="modal fade" id={id} tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
            <div className="modal-dialog modal-dialog-centered p-5">
                <div className="modal-content bg-transparent border-0">
                    <div className="d-flex flex-column shadow bg-white rounded-4 w-100 mx-0 p-4 py-5 p-md-5">
                        <h1 className="font-century-gothic color-dark-gray text-center mb-4 mb-md-5 fs-3 fw-bold">{title}</h1>

                        <div className="row justify-content-center m-0">
                            <div className={`${actionHsl ? 'col' : 'col-auto'} d-flex px-1`}>
                                <TextButton
                                    className={`p-3 ${actionHsl ? '' : 'px-5'} p-md-4 fs-3`}
                                    hsl={dismissHsl}
                                    text={dismissText}
                                    onClick={() => hideModal(id)}
                                />
                            </div>
                            <div className={`col ${actionHsl ? 'd-flex' : 'd-none'} px-1`}>
                                <TextButton
                                    className="p-3 p-md-4 fs-3"
                                    hsl={actionHsl}
                                    text={actionText}
                                    onClick={() => hideAndAction(id, actionOnClick)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style>{endProtocolAlertStyles}</style>
        </div>
    );
}

EndProtocolAlert.defaultProps = {
    id: 'Modal',
    title: 'Deseja finalizar o protocolo?',
    dismissHsl: [97, 43, 70],
    dismissText: 'Ok',
    actionHsl: undefined,
    actionText: undefined,
    actionOnClick: undefined,
};

export default EndProtocolAlert;
