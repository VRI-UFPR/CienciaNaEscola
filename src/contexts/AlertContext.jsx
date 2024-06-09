import { createContext, useState } from 'react';
import { Modal } from 'bootstrap';
import TextButton from '../components/TextButton';

export const AlertContext = createContext();

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

export const AlertProvider = ({ children }) => {
    const [alert, setAlert] = useState();

    const showAlert = (data) => {
        if (data) {
            const element = document.getElementById('alert-modal');

            setAlert((prev) => {
                element.removeEventListener('hidden.bs.modal', prev?.onHide);
                if (prev?.actionOnClick) {
                    element.removeEventListener('hidden.bs.modal', prev?.actionOnClick);
                }
                return data;
            });

            Modal.getOrCreateInstance(element).show();
        }
    };

    const hideAlert = (action) => {
        const element = document.getElementById('alert-modal');
        if (action) {
            element.addEventListener('hidden.bs.modal', action);
        }

        Modal.getInstance(element)?.hide();
    };

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <div className="modal fade" id="alert-modal" tabIndex="-1" aria-hidden="true" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered p-5">
                    <div className="modal-content bg-transparent border-0">
                        <div className="d-flex flex-column shadow text-break bg-white rounded-4 w-100 mx-0 p-4 py-5 p-md-5">
                            <h1
                                className={`font-century-gothic color-dark-gray text-center fs-3 fw-bold ${
                                    alert?.description ? 'mb-3' : 'mb-4 mb-md-5'
                                }`}
                            >
                                {alert?.title}
                            </h1>
                            {alert?.description && (
                                <p className="font-century-gothic color-dark-gray text-center mb-4 mb-md-5 fs-5 fw-medium">
                                    {alert?.description}
                                </p>
                            )}
                            <div className={`row ${alert?.dismissible ? '' : 'd-none'} justify-content-center m-0`}>
                                <div className={`${alert?.actionHsl ? 'col' : 'col-auto'} d-flex px-1`}>
                                    <TextButton
                                        className={`p-3 ${alert?.actionHsl ? '' : 'px-5'} py-md-4 fs-3`}
                                        hsl={alert?.dismissHsl || [97, 43, 70]}
                                        text={alert?.dismissText || 'Ok'}
                                        onClick={() => hideAlert(alert?.onHide)}
                                    />
                                </div>
                                <div className={`col ${alert?.actionHsl ? 'd-flex' : 'd-none'} px-1`}>
                                    <TextButton
                                        className="p-3 p-md-4 fs-3"
                                        hsl={alert?.actionHsl}
                                        text={alert?.actionText}
                                        onClick={() => hideAlert(alert?.actionOnClick)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <style>{AlertStyles}</style>
            </div>
        </AlertContext.Provider>
    );
};
