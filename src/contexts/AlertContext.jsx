/*
Copyright (C) 2024 Laboratorio Visao Robotica e Imagem

Departamento de Informatica - Universidade Federal do Parana - VRI/UFPR

This file is part of CienciaNaEscola. CienciaNaEscola is free software: you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
CienciaNaEscola is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details. You should have received a copy
of the GNU General Public License along with CienciaNaEscola.  If not, see <https://www.gnu.org/licenses/>
*/

import { createContext, useCallback, useState } from 'react';
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
    const [isAlertVisible, setIsAlertVisible] = useState(false);

    const showAlert = useCallback((data) => {
        if (data) {
            const element = document.getElementById('alert-modal');

            setAlert((prev) => {
                element.removeEventListener('hidden.bs.modal', prev?.onPrimaryBtnClick);
                if (prev?.onSecondaryBtnClick) {
                    element.removeEventListener('hidden.bs.modal', prev?.onSecondaryBtnClick);
                }

                return {
                    headerText: data.headerText || 'Alerta',
                    bodyText: data.bodyText,
                    isClosable: data.isClosable !== false,
                    primaryBtnLabel: data.primaryBtnLabel || 'Ok',
                    primaryBtnHsl: data.primaryBtnHsl || [97, 43, 70],
                    secondaryBtnLabel: data.secondaryBtnLabel || 'Cancelar',
                    secondaryBtnHsl: data.secondaryBtnHsl || [355, 78, 66],
                    onPrimaryBtnClick: data.onPrimaryBtnClick,
                    onSecondaryBtnClick: data.onSecondaryBtnClick,
                };
            });
            setIsAlertVisible(true);

            Modal.getOrCreateInstance(element).show();
        }
    }, []);

    const hideAlert = useCallback((action) => {
        const element = document.getElementById('alert-modal');
        if (action) {
            element.addEventListener('hidden.bs.modal', action);
        }
        setIsAlertVisible(false);

        Modal.getInstance(element)?.hide();
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert, isAlertVisible, isClosable: alert?.isClosable }}>
            {children}
            <div className="modal fade" id="alert-modal" tabIndex="-1" data-bs-backdrop="static">
                <div className="modal-dialog modal-dialog-centered p-5">
                    <div className="modal-content bg-transparent border-0">
                        <div className="d-flex flex-column shadow text-break bg-white rounded-4 w-100 mx-0 p-4 py-5 p-md-5">
                            <h1
                                className={`font-century-gothic color-dark-gray text-center fs-3 fw-bold ${
                                    alert?.bodyText ? 'mb-3' : 'mb-4 mb-md-5'
                                }`}
                            >
                                {alert?.headerText}
                            </h1>
                            {alert?.bodyText && (
                                <p className="font-century-gothic color-dark-gray text-center mb-4 mb-md-5 fs-5 fw-medium">
                                    {alert?.bodyText}
                                </p>
                            )}
                            <div className={`row ${alert?.isClosable ? '' : 'd-none'} justify-content-center m-0`}>
                                <div className={`${alert?.onSecondaryBtnClick ? 'col' : 'col-auto'} d-flex px-1`}>
                                    <TextButton
                                        className={`p-3 ${alert?.onSecondaryBtnClick ? '' : 'px-5'} py-md-4 fs-3`}
                                        hsl={alert?.primaryBtnHsl || [97, 43, 70]}
                                        text={alert?.primaryBtnLabel || 'Ok'}
                                        onClick={() => hideAlert(alert?.onPrimaryBtnClick)}
                                    />
                                </div>
                                <div className={`col ${alert?.onSecondaryBtnClick ? 'd-flex' : 'd-none'} px-1`}>
                                    <TextButton
                                        className="p-3 p-md-4 fs-3"
                                        hsl={alert?.secondaryBtnHsl}
                                        text={alert?.secondaryBtnLabel}
                                        onClick={() => hideAlert(alert?.onSecondaryBtnClick)}
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
